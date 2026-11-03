import base64
import html
import io
import json
import logging
import random
import time
import edge_tts
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from config import (
    GEMINI_API_KEY, GEMINI_MODEL, GEMINI_COOLDOWN,
    TTS_VOICE, BAD_WORDS, FORTUNE_KEYWORDS, AVATAR_KEYWORDS, FORTUNE_DB
)

logger = logging.getLogger("AIService")

gemini_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("Đã kết nối Gemini API thành công.")
    except Exception as e:
        logger.error(f"Lỗi khởi tạo Gemini Client: {e}")
else:
    logger.warning("Chưa cấu hình GEMINI_API_KEY. Hệ thống sẽ dùng kho quẻ chuẩn FORTUNE_DB.")

class FortuneSchema(BaseModel):
    id: str = Field(description="Số thứ tự quẻ, ví dụ: Quẻ Linh Ứng Số 68, Quẻ Số 88...")
    rank: str = Field(description="Cấp độ quẻ: THƯỢNG THƯỢNG CÁT, ĐẠI CÁT, THƯỢNG CÁT, hoặc TRUNG CÁT")
    title: str = Field(description="Tên quẻ 4 chữ Hán Việt kèm nghĩa tiếng Việt trang trọng")
    poem: str = Field(description="Đúng 4 câu thơ lục bát hoặc thất ngôn vần điệu chuẩn, trang trọng, có liên hệ tới lời cầu nguyện, ngăn cách bằng \\n")
    meaning: str = Field(description="Lời bàn giải quẻ ngắn gọn (1-2 câu, dưới 40 chữ), hướng thiện và trả lời đúng trọng tâm câu hỏi")

last_ai_call_time = 0.0

def sanitize_text(text: str, max_len: int = 120) -> str:
    cleaned = html.escape(text.strip())
    return cleaned[:max_len]

def is_clean_text(text: str) -> bool:
    text_lower = text.lower()
    return not any(bad_word in text_lower for bad_word in BAD_WORDS)

def is_fortune_request(text: str) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in FORTUNE_KEYWORDS)

def detect_avatar_type(text: str) -> str:
    text_lower = text.lower()
    for avatar_type, keywords in AVATAR_KEYWORDS.items():
        if any(k in text_lower for k in keywords):
            return avatar_type
    return ""

async def generate_ai_fortune(username: str, wish_text: str, is_vip: bool = False) -> dict:
    global last_ai_call_time
    now = time.time()

    if not gemini_client or (not is_vip and (now - last_ai_call_time < GEMINI_COOLDOWN)):
        return random.choice(FORTUNE_DB)

    last_ai_call_time = now
    system_instruction = (
        "Bạn là một bậc cao tăng thông tuệ, từ bi, chuyên gieo quẻ cầu an và giải xăm. "
        "Nhiệm vụ: Dựa vào tên thí chủ và lời cầu nguyện, hãy gieo 1 quẻ xăm mang năng lượng tích cực, "
        "hướng thiện, khích lệ tinh thần. Tuyệt đối không phán điều xui rủi, mê tín cực đoan hay cổ xúy cờ bạc. "
        "Thơ giải phải đúng 4 câu lục bát hoặc thất ngôn vần điệu mượt mà, lồng ghép khéo léo mong cầu của thí chủ."
    )
    user_prompt = f"Thí chủ tên là '{username}', đang thành tâm xin quẻ với mong cầu: '{wish_text}'."

    try:
        response = await gemini_client.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=FortuneSchema,
                temperature=0.75,
            )
        )
        fortune_data = json.loads(response.text)
        logger.info(f"[GEMINI AI] Đã sáng tác quẻ riêng cho [{username}]: {fortune_data['title']}")
        return fortune_data
    except Exception as e:
        logger.error(f"Lỗi gọi Gemini API (Chuyển sang FORTUNE_DB): {e}")
        return random.choice(FORTUNE_DB)

async def generate_tts_base64(text: str) -> str:
    try:
        communicate = edge_tts.Communicate(text, TTS_VOICE, rate="+8%", pitch="-5Hz")
        audio_stream = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_stream.write(chunk["data"])
        return base64.b64encode(audio_stream.getvalue()).decode("utf-8")
    except Exception as e:
        logger.error(f"Lỗi sinh giọng đọc TTS: {e}")
        return ""
