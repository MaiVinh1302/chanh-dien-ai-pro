import asyncio
import json
import logging
import os
import sys
import uuid
sys.stdout.reconfigure(encoding="utf-8")
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

from config import HOST, PORT, TIKTOK_USERNAME, FB_LIVE_VIDEO_ID, FB_ACCESS_TOKEN, AUTO_APPROVE_COMMENTS
from database import init_db, add_activity, get_global_stats, reset_database
from ai_service import (
    sanitize_text, is_clean_text, is_fortune_request,
    detect_avatar_type, generate_ai_fortune, generate_tts_base64
)
from platforms import MultiPlatformManager

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("MasterServer")

app = FastAPI(title="Chánh Điện Online 2.5D AI Multi-Platform Server")

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
overlay_clients: set[WebSocket] = set()
control_clients: set[WebSocket] = set()

# Trạng thái kiểm duyệt Human-in-the-Loop
moderation_state = {
    "auto_approve": AUTO_APPROVE_COMMENTS,
    "pending_queue": []  # Danh sách các sự kiện chờ con người bấm Duyệt khi auto_approve = False
}

async def broadcast_to_overlays(payload: dict):
    payload["global_stats"] = get_global_stats()
    msg = json.dumps(payload, ensure_ascii=False)
    dead = set()
    for ws in overlay_clients:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.add(ws)
    overlay_clients.difference_update(dead)

async def broadcast_to_controls():
    status_payload = {
        "type": "CONTROL_STATE",
        "auto_approve": moderation_state["auto_approve"],
        "pending_queue": moderation_state["pending_queue"],
        "platforms": platform_manager.get_status(),
        "global_stats": get_global_stats()
    }
    msg = json.dumps(status_payload, ensure_ascii=False)
    dead = set()
    for ws in control_clients:
        try:
            await ws.send_text(msg)
        except Exception:
            dead.add(ws)
    control_clients.difference_update(dead)

async def execute_approved_event(item: dict):
    """Thực thi sự kiện sau khi đã qua kiểm duyệt (Auto hoặc Human-in-the-loop)"""
    platform = item.get("platform", "tiktok")
    event_type = item.get("event_type", "COMMENT")
    user = sanitize_text(item.get("user", "Thí Chủ"), 30)
    text = sanitize_text(item.get("text", ""), 120)
    avatar_type = detect_avatar_type(text)

    if event_type == "LIKE":
        count = int(item.get("count", 1))
        add_activity(user, platform, merit_delta=count, wooden_fish_delta=count)
        await broadcast_to_overlays({
            "type": "LIKE",
            "platform": platform,
            "user": user,
            "count": count
        })

    elif event_type == "GIFT":
        gift_name = sanitize_text(item.get("gift_name", "ROSE"), 25).upper()
        repeat_count = int(item.get("repeat_count", 1))
        diamonds = int(item.get("diamonds", 1))
        merit_added = diamonds * 20

        add_activity(user, platform, merit_delta=merit_added, incense_delta=1, avatar_type="high_monk", is_vip=True)
        wish_context = f"Dâng lễ vật {repeat_count} {gift_name}, cầu gia đạo bình an, tài lộc hưng thịnh"
        fortune = await generate_ai_fortune(username=user, wish_text=wish_context, is_vip=True)
        poem_clean = fortune["poem"].replace("\n", ", ")
        tts_text = (
            f"Cảm tạ đại thí chủ {user} dâng lễ {repeat_count} {gift_name}, tích thêm {merit_added} công đức. "
            f"Ứng với {fortune['id']}, {fortune['title']}. Thơ rằng: {poem_clean}. Lời bàn: {fortune['meaning']}"
        )
        audio_b64 = await generate_tts_base64(tts_text)

        await broadcast_to_overlays({
            "type": "GIFT",
            "platform": platform,
            "user": user,
            "gift_name": gift_name,
            "count": repeat_count,
            "merit_added": merit_added,
            "avatar_type": "high_monk",
            "fortune": fortune,
            "audio": audio_b64
        })

    elif event_type == "COMMENT":
        # Nếu người xem chỉ gõ từ khóa đổi nhân vật (nam, nữ, sư, ni, tiểu, bà, cao tăng)
        if avatar_type and len(text.split()) <= 2 and not is_fortune_request(text):
            add_activity(user, platform, merit_delta=1, incense_delta=1, avatar_type=avatar_type)
            await broadcast_to_overlays({
                "type": "AVATAR_CHANGE",
                "platform": platform,
                "user": user,
                "avatar_type": avatar_type,
                "text": f"Đổi pháp phục: {text}"
            })
        elif is_fortune_request(text):
            add_activity(user, platform, merit_delta=2, incense_delta=1, avatar_type=avatar_type or None)
            fortune = await generate_ai_fortune(username=user, wish_text=text, is_vip=False)
            poem_clean = fortune["poem"].replace("\n", ", ")
            tts_text = (
                f"Thí chủ {user} rút được {fortune['id']}, {fortune['rank']}, {fortune['title']}. "
                f"Thơ rằng: {poem_clean}. Lời bàn: {fortune['meaning']}"
            )
            audio_b64 = await generate_tts_base64(tts_text)
            await broadcast_to_overlays({
                "type": "FORTUNE",
                "platform": platform,
                "user": user,
                "text": text,
                "avatar_type": avatar_type or "male",
                "fortune": fortune,
                "audio": audio_b64
            })
        else:
            add_activity(user, platform, merit_delta=1, incense_delta=1, avatar_type=avatar_type or None)
            tts_text = f"Thí chủ {user} cầu nguyện: {text[:55]}"
            audio_b64 = await generate_tts_base64(tts_text)
            await broadcast_to_overlays({
                "type": "COMMENT",
                "platform": platform,
                "user": user,
                "text": text,
                "avatar_type": avatar_type or "male",
                "audio": audio_b64
            })

    await broadcast_to_controls()

async def handle_platform_event(platform: str, event_type: str, user: str, text: str = "",
                                count: int = 1, gift_name: str = "ROSE", repeat_count: int = 1, diamonds: int = 1):
    if event_type == "COMMENT" and not is_clean_text(text):
        logger.warning(f"Đã chặn bình luận vi phạm từ [{user}]: {text}")
        return

    event_obj = {
        "id": str(uuid.uuid4())[:8],
        "platform": platform,
        "event_type": event_type,
        "user": user,
        "text": text,
        "count": count,
        "gift_name": gift_name,
        "repeat_count": repeat_count,
        "diamonds": diamonds
    }

    # LIKE và GIFT luôn chạy ngay; COMMENT đi qua chế độ Human-in-the-loop nếu tắt auto_approve
    if event_type in ("LIKE", "GIFT") or moderation_state["auto_approve"]:
        await execute_approved_event(event_obj)
    else:
        moderation_state["pending_queue"].append(event_obj)
        if len(moderation_state["pending_queue"]) > 30:
            moderation_state["pending_queue"].pop(0)
        await broadcast_to_controls()

platform_manager = MultiPlatformManager(event_callback=handle_platform_event)

@app.on_event("startup")
async def on_startup():
    init_db()
    logger.info(f"🚀 Hệ thống khởi chạy! Mở Overlay OBS: http://{HOST}:{PORT}/overlay")
    logger.info(f"🎛️ Mở Bảng Điều Khiển (Control Panel): http://{HOST}:{PORT}/control")

@app.get("/overlay", response_class=HTMLResponse)
async def serve_overlay():
    with open(os.path.join(STATIC_DIR, "overlay.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/world3d", response_class=HTMLResponse)
async def serve_world3d():
    with open(os.path.join(STATIC_DIR, "world3d.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/control", response_class=HTMLResponse)
async def serve_control():
    with open(os.path.join(STATIC_DIR, "control.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/join", response_class=HTMLResponse)
async def serve_join():
    with open(os.path.join(STATIC_DIR, "join.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/pdf-editor", response_class=HTMLResponse)
@app.get("/pdf", response_class=HTMLResponse)
async def serve_pdf_editor():
    with open(os.path.join(STATIC_DIR, "pdf_editor.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/pdf-merger", response_class=HTMLResponse)
@app.get("/merger", response_class=HTMLResponse)
async def serve_pdf_merger():
    with open(os.path.join(STATIC_DIR, "pdf_merger.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/qlvb", response_class=HTMLResponse)
async def serve_qlvb():
    with open(os.path.join(STATIC_DIR, "qlvb.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.websocket("/ws/overlay")
async def ws_overlay_endpoint(websocket: WebSocket):
    await websocket.accept()
    overlay_clients.add(websocket)
    await websocket.send_text(json.dumps({"type": "INIT", "global_stats": get_global_stats()}, ensure_ascii=False))
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        overlay_clients.discard(websocket)

@app.websocket("/ws/control")
async def ws_control_endpoint(websocket: WebSocket):
    await websocket.accept()
    control_clients.add(websocket)
    await broadcast_to_controls()
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        control_clients.discard(websocket)

class PlatformConnectReq(BaseModel):
    platform: str
    action: str
    tiktok_username: str = ""
    fb_video_id: str = ""
    fb_access_token: str = ""

@app.post("/api/platform")
async def api_platform(req: PlatformConnectReq):
    if req.platform == "tiktok":
        if req.action == "start":
            await platform_manager.start_tiktok(req.tiktok_username or TIKTOK_USERNAME)
        else:
            await platform_manager.stop_tiktok()
    elif req.platform == "facebook":
        if req.action == "start":
            await platform_manager.start_facebook(req.fb_video_id or FB_LIVE_VIDEO_ID, req.fb_access_token or FB_ACCESS_TOKEN)
        else:
            await platform_manager.stop_facebook()
    await broadcast_to_controls()
    return JSONResponse({"status": "ok", "platforms": platform_manager.get_status()})

class ModerationReq(BaseModel):
    action: str  # "toggle_auto", "approve", "reject", "reset_db"
    item_id: str = ""
    auto_approve: bool = True

@app.post("/api/moderation")
async def api_moderation(req: ModerationReq):
    if req.action == "toggle_auto":
        moderation_state["auto_approve"] = req.auto_approve
    elif req.action == "approve":
        for idx, item in enumerate(moderation_state["pending_queue"]):
            if item["id"] == req.item_id:
                approved_item = moderation_state["pending_queue"].pop(idx)
                await execute_approved_event(approved_item)
                break
    elif req.action == "reject":
        moderation_state["pending_queue"] = [i for i in moderation_state["pending_queue"] if i["id"] != req.item_id]
    elif req.action == "reset_db":
        reset_database()
        await broadcast_to_overlays({"type": "INIT"})
    await broadcast_to_controls()
    return JSONResponse({"status": "ok"})

class SimulateReq(BaseModel):
    platform: str = "tiktok"
    event_type: str = "FORTUNE"
    user: str = "Bá Vương"
    text: str = "Xin quẻ triển khai dự án mới tại Hải Phòng"
    gift_name: str = "ROSE"
    diamonds: int = 1

@app.post("/api/simulate")
async def api_simulate(req: SimulateReq):
    await handle_platform_event(
        platform=req.platform,
        event_type=req.event_type,
        user=req.user,
        text=req.text,
        gift_name=req.gift_name,
        repeat_count=1,
        diamonds=req.diamonds
    )
    return JSONResponse({"status": "simulated"})

class JoinReq(BaseModel):
    name: str = "Thí Chủ"
    avatar_type: str = "novice"
    wish: str = ""
    is_vip: bool = False

@app.post("/api/join")
async def api_join(req: JoinReq):
    user = sanitize_text(req.name, 30) or "Thí Chủ"
    wish = sanitize_text(req.wish, 120)
    av_type = req.avatar_type if req.avatar_type in ["male", "female", "monk", "nun", "novice", "elder", "high_monk"] else "novice"
    add_activity(user, "web_join", merit_delta=5, incense_delta=1, avatar_type=av_type, is_vip=req.is_vip)
    
    await broadcast_to_overlays({
        "type": "USER_JOINED",
        "platform": "web",
        "user": user,
        "avatar_type": av_type,
        "text": wish or "Thành tâm đảnh lễ Chánh Điện",
        "is_vip": req.is_vip
    })
    return JSONResponse({"status": "joined", "user": user, "avatar_type": av_type})

class DevoteeActionReq(BaseModel):
    user: str
    action: str  # "moc", "bell", "wish", "fortune"
    text: str = ""

@app.post("/api/devotee_action")
async def api_devotee_action(req: DevoteeActionReq):
    user = sanitize_text(req.user, 30) or "Thí Chủ"
    if req.action == "moc":
        add_activity(user, "web", merit_delta=1, wooden_fish_delta=1)
        await broadcast_to_overlays({
            "type": "LIKE",
            "platform": "web",
            "user": user,
            "count": 1
        })
    elif req.action == "bell":
        add_activity(user, "web", merit_delta=2, incense_delta=1)
        await broadcast_to_overlays({
            "type": "BELL_RING",
            "platform": "web",
            "user": user
        })
    elif req.action in ["zoom_in", "zoom_out", "zoom_reset"]:
        await broadcast_to_overlays({
            "type": "CAMERA_ZOOM",
            "action": req.action,
            "user": user
        })
    elif req.action == "wish":
        wish = sanitize_text(req.text, 120)
        add_activity(user, "web", merit_delta=1, incense_delta=1)
        await broadcast_to_overlays({
            "type": "COMMENT",
            "platform": "web",
            "user": user,
            "text": wish
        })
    elif req.action == "fortune":
        wish = sanitize_text(req.text, 120) or "Cầu gia đạo bình an, hanh thông vạn sự"
        fortune = await generate_ai_fortune(user, wish)
        poem_clean = fortune["poem"].replace("\n", ", ")
        tts = f"Thí chủ {user} rút được {fortune['id']}, {fortune['rank']}. Thơ rằng: {poem_clean}. Lời bàn: {fortune['meaning']}"
        audio_b64 = await generate_tts_base64(tts)
        await broadcast_to_overlays({
            "type": "FORTUNE",
            "platform": "web",
            "user": user,
            "text": wish,
            "fortune": fortune,
            "audio": audio_b64
        })
        return JSONResponse({"status": "ok", "fortune": fortune})
    return JSONResponse({"status": "ok"})

class DevoteeMoveReq(BaseModel):
    user: str
    target_x: float = 0.5    # Tọa độ tương đối 0.0 -> 1.0
    target_y: float = 0.82   # Tọa độ tương đối 0.0 -> 1.0
    seat_index: int = -1     # Số thứ tự bồ đoàn nếu chọn trực tiếp
    direction: str = ""      # "UP", "DOWN", "LEFT", "RIGHT"

@app.post("/api/devotee_move")
async def api_devotee_move(req: DevoteeMoveReq):
    user = sanitize_text(req.user, 30) or "Thí Chủ"
    await broadcast_to_overlays({
        "type": "DEVOTEE_MOVE",
        "user": user,
        "target_x": req.target_x,
        "target_y": req.target_y,
        "seat_index": req.seat_index,
        "direction": req.direction
    })
    return JSONResponse({"status": "moved", "user": user})

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=False)
