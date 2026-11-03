import asyncio
import logging
import httpx
from TikTokLive import TikTokLiveClient
from TikTokLive.events import ConnectEvent, CommentEvent, GiftEvent, LikeEvent

logger = logging.getLogger("Platforms")

class MultiPlatformManager:
    def __init__(self, event_callback):
        self.event_callback = event_callback
        self.tiktok_client = None
        self.tiktok_task = None
        self.tiktok_username = ""
        self.tiktok_connected = False

        self.fb_task = None
        self.fb_video_id = ""
        self.fb_access_token = ""
        self.fb_connected = False
        self.seen_fb_comments = set()

    async def start_tiktok(self, username: str):
        await self.stop_tiktok()
        self.tiktok_username = username if username.startswith("@") else f"@{username}"
        logger.info(f"Đang kết nối TikTok Live: {self.tiktok_username}...")

        self.tiktok_client = TikTokLiveClient(unique_id=self.tiktok_username)

        @self.tiktok_client.on(ConnectEvent)
        async def on_connect(event: ConnectEvent):
            self.tiktok_connected = True
            logger.info(f"✅ Đã kết nối TikTok Live: {event.unique_id}")

        @self.tiktok_client.on(CommentEvent)
        async def on_comment(event: CommentEvent):
            await self.event_callback(
                platform="tiktok",
                event_type="COMMENT",
                user=event.user.nickname,
                text=event.comment
            )

        @self.tiktok_client.on(LikeEvent)
        async def on_like(event: LikeEvent):
            await self.event_callback(
                platform="tiktok",
                event_type="LIKE",
                user=event.user.nickname,
                count=event.count
            )

        @self.tiktok_client.on(GiftEvent)
        async def on_gift(event: GiftEvent):
            if event.gift.streakable and not event.streaking:
                diamonds = max(1, event.gift.diamond_count) * event.repeat_count
                await self.event_callback(
                    platform="tiktok",
                    event_type="GIFT",
                    user=event.user.nickname,
                    gift_name=event.gift.name,
                    repeat_count=event.repeat_count,
                    diamonds=diamonds
                )

        async def _run():
            try:
                await self.tiktok_client.start()
            except Exception as e:
                self.tiktok_connected = False
                logger.error(f"TikTok Live ngắt kết nối ({self.tiktok_username}): {e}")

        self.tiktok_task = asyncio.create_task(_run())

    async def stop_tiktok(self):
        if self.tiktok_client:
            try:
                await self.tiktok_client.disconnect()
            except Exception:
                pass
        if self.tiktok_task and not self.tiktok_task.done():
            self.tiktok_task.cancel()
        self.tiktok_connected = False
        logger.info("Đã dừng kết nối TikTok Live.")

    async def start_facebook(self, video_id: str, access_token: str):
        await self.stop_facebook()
        self.fb_video_id = video_id.strip()
        self.fb_access_token = access_token.strip()
        if not self.fb_video_id or not self.fb_access_token:
            logger.warning("Thiếu Facebook Live Video ID hoặc Access Token.")
            return

        self.fb_connected = True
        logger.info(f"✅ Bắt đầu lắng nghe Facebook Live Video ID: {self.fb_video_id}")

        async def _poll_fb():
            url = f"https://graph.facebook.com/v19.0/{self.fb_video_id}/comments"
            params = {
                "access_token": self.fb_access_token,
                "order": "reverse_chronological",
                "limit": 15,
                "fields": "id,from,message,created_time"
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                while self.fb_connected:
                    try:
                        resp = await client.get(url, params=params)
                        if resp.status_code == 200:
                            data = resp.json().get("data", [])
                            for item in reversed(data):
                                cid = item.get("id")
                                if cid and cid not in self.seen_fb_comments:
                                    self.seen_fb_comments.add(cid)
                                    user = item.get("from", {}).get("name", "Phật Tử FB")
                                    msg = item.get("message", "")
                                    if msg:
                                        await self.event_callback(
                                            platform="facebook",
                                            event_type="COMMENT",
                                            user=user,
                                            text=msg
                                        )
                        else:
                            logger.warning(f"Facebook Graph API trả về mã {resp.status_code}: {resp.text}")
                    except Exception as e:
                        logger.error(f"Lỗi kết nối Facebook Live: {e}")
                    await asyncio.sleep(2.5)

        self.fb_task = asyncio.create_task(_poll_fb())

    async def stop_facebook(self):
        self.fb_connected = False
        if self.fb_task and not self.fb_task.done():
            self.fb_task.cancel()
        logger.info("Đã dừng kết nối Facebook Live.")

    def get_status(self) -> dict:
        return {
            "tiktok_username": self.tiktok_username,
            "tiktok_connected": self.tiktok_connected,
            "fb_video_id": self.fb_video_id,
            "fb_connected": self.fb_connected
        }
