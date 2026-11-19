"""Thu thập, chuẩn hóa và tự động đồng bộ dữ liệu KQXS Miền Bắc từ xosodaiphat.com."""

from __future__ import annotations

import json
import re
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE_URLS = {
    "200_ngay": "https://xosodaiphat.com/xsmb-200-ngay.html",
    "100_ngay": "https://xosodaiphat.com/xsmb-100-ngay.html",
    "90_ngay": "https://xosodaiphat.com/xsmb-90-ngay.html",
    "60_ngay": "https://xosodaiphat.com/xsmb-60-ngay.html",
    "30_ngay": "https://xosodaiphat.com/xsmb-30-ngay.html",
    "moi_nhat": "https://xosodaiphat.com/xsmb-xo-so-mien-bac.html",
}

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CACHE_PATH = DATA_DIR / "xsmb_history.csv"
SYNC_STATE_PATH = DATA_DIR / "sync_state.json"

VN_TZ = timezone(timedelta(hours=7))
DRAW_COMPLETE_TIME = time(18, 35)  # XSMB quay xong khoảng 18h30-18h35 hàng ngày


def now_vn() -> datetime:
    return datetime.now(VN_TZ)


def get_expected_latest_draw_date(ref_dt: Optional[datetime] = None) -> date:
    """Xác định ngày mở thưởng mới nhất kỳ vọng đã có kết quả theo giờ VN."""
    dt = ref_dt or now_vn()
    if dt.time() >= DRAW_COMPLETE_TIME:
        return dt.date()
    return dt.date() - timedelta(days=1)


def read_sync_state() -> Dict:
    if SYNC_STATE_PATH.exists():
        try:
            return json.loads(SYNC_STATE_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def _write_sync_state(state: Dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SYNC_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def _extract_date_near_table(tbl) -> Optional[str]:
    """Tìm ngày DD/MM/YYYY ở các phần tử ngay phía trước bảng kết quả."""
    cur = tbl
    for _ in range(12):
        cur = cur.find_previous(["h2", "h3", "div", "a"])
        if cur is None:
            break
        text = cur.get_text(" ", strip=True)
        m = re.search(r"(\d{2}/\d{2}/\d{4})", text)
        if m:
            return m.group(1)
    return None


def parse_xsmb_html(html: str) -> pd.DataFrame:
    """Parse HTML từ xosodaiphat.com thành DataFrame chuẩn hóa."""
    soup = BeautifulSoup(html, "lxml")
    tables = soup.select("table.table-xsmb")
    rows: List[Dict] = []

    for tbl in tables:
        date_str = _extract_date_near_table(tbl)
        if not date_str:
            continue

        prizes: Dict[str, List[str]] = {}
        for tr in tbl.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) < 2:
                continue
            label = tds[0].get_text(" ", strip=True)
            spans = [
                s.get_text(strip=True)
                for s in tds[1].find_all("span")
                if s.get_text(strip=True)
            ]
            if not spans:
                spans = tds[1].get_text(" ", strip=True).split()
            prizes[label] = spans

        gdb_list = prizes.get("G.ĐB", [])
        if not gdb_list:
            continue

        gdb = re.sub(r"\D", "", gdb_list[0])
        if len(gdb) < 2:
            continue

        prize_keys = ["G.ĐB", "G.1", "G.2", "G.3", "G.4", "G.5", "G.6", "G.7"]
        all_numbers: List[str] = []
        for k in prize_keys:
            for item in prizes.get(k, []):
                cleaned = re.sub(r"\D", "", item)
                if len(cleaned) >= 2:
                    all_numbers.append(cleaned)

        loto_27 = [num[-2:].zfill(2) for num in all_numbers]
        loto_ints = [int(x) for x in loto_27]

        de_2so = int(gdb[-2:])
        dau_de = de_2so // 10
        duoi_de = de_2so % 10
        tong_de = dau_de + duoi_de

        try:
            dt = datetime.strptime(date_str, "%d/%m/%Y").date()
        except ValueError:
            continue

        rows.append(
            {
                "date": dt.isoformat(),
                "date_vn": date_str,
                "weekday": dt.strftime("%A"),
                "gdb": gdb,
                "de_2so": de_2so,
                "de_str": f"{de_2so:02d}",
                "dau_de": dau_de,
                "duoi_de": duoi_de,
                "tong_de": tong_de,
                "g1": ",".join(prizes.get("G.1", [])),
                "g2": ",".join(prizes.get("G.2", [])),
                "g3": ",".join(prizes.get("G.3", [])),
                "g4": ",".join(prizes.get("G.4", [])),
                "g5": ",".join(prizes.get("G.5", [])),
                "g6": ",".join(prizes.get("G.6", [])),
                "g7": ",".join(prizes.get("G.7", [])),
                "loto_27": ",".join(loto_27),
                "loto_count": len(loto_ints),
                "loto_mean": round(sum(loto_ints) / max(len(loto_ints), 1), 2),
                "loto_sum": sum(loto_ints),
                "even_count": sum(1 for x in loto_ints if x % 2 == 0),
                "high_count": sum(1 for x in loto_ints if x >= 50),
            }
        )

    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df = df.drop_duplicates(subset=["date"]).sort_values("date").reset_index(drop=True)
    return df


def fetch_xsmb_data(source_key: str = "200_ngay", timeout: int = 25) -> pd.DataFrame:
    """Tải dữ liệu trực tiếp từ xosodaiphat.com."""
    url = BASE_URLS.get(source_key, BASE_URLS["200_ngay"])
    resp = requests.get(url, headers=DEFAULT_HEADERS, timeout=timeout)
    resp.raise_for_status()
    resp.encoding = "utf-8"
    return parse_xsmb_html(resp.text)


def parse_minhngoc_html(html: str) -> pd.DataFrame:
    """Parse HTML từ minhngoc.net.vn (div.box_kqxs) thành DataFrame chuẩn hóa."""
    soup = BeautifulSoup(html, "lxml")
    boxes = soup.select("div.box_kqxs")
    rows: List[Dict] = []

    cls_map = [
        ("G.ĐB", "giaidb"),
        ("G.1", "giai1"),
        ("G.2", "giai2"),
        ("G.3", "giai3"),
        ("G.4", "giai4"),
        ("G.5", "giai5"),
        ("G.6", "giai6"),
        ("G.7", "giai7"),
    ]

    for box in boxes:
        ngay_el = box.select_one(".ngay")
        if not ngay_el:
            continue
        m = re.search(r"(\d{2}/\d{2}/\d{4})", ngay_el.get_text(" ", strip=True))
        if not m:
            continue
        date_str = m.group(1)

        prizes: Dict[str, List[str]] = {}
        for label, cls in cls_map:
            nums = [
                re.sub(r"\D", "", x.get_text(strip=True))
                for x in box.select(f".{cls} div")
                if re.sub(r"\D", "", x.get_text(strip=True))
            ]
            prizes[label] = nums

        gdb_list = prizes.get("G.ĐB", [])
        if not gdb_list or len(gdb_list[0]) < 2:
            continue
        gdb = gdb_list[0]

        all_numbers: List[str] = []
        for label, _ in cls_map:
            for item in prizes.get(label, []):
                if len(item) >= 2:
                    all_numbers.append(item)

        if not all_numbers:
            continue

        loto_27 = [num[-2:].zfill(2) for num in all_numbers]
        loto_ints = [int(x) for x in loto_27]

        de_2so = int(gdb[-2:])
        dau_de = de_2so // 10
        duoi_de = de_2so % 10
        tong_de = dau_de + duoi_de

        try:
            dt = datetime.strptime(date_str, "%d/%m/%Y").date()
        except ValueError:
            continue

        rows.append(
            {
                "date": dt.isoformat(),
                "date_vn": date_str,
                "weekday": dt.strftime("%A"),
                "gdb": gdb,
                "de_2so": de_2so,
                "de_str": f"{de_2so:02d}",
                "dau_de": dau_de,
                "duoi_de": duoi_de,
                "tong_de": tong_de,
                "g1": ",".join(prizes.get("G.1", [])),
                "g2": ",".join(prizes.get("G.2", [])),
                "g3": ",".join(prizes.get("G.3", [])),
                "g4": ",".join(prizes.get("G.4", [])),
                "g5": ",".join(prizes.get("G.5", [])),
                "g6": ",".join(prizes.get("G.6", [])),
                "g7": ",".join(prizes.get("G.7", [])),
                "loto_27": ",".join(loto_27),
                "loto_count": len(loto_ints),
                "loto_mean": round(sum(loto_ints) / max(len(loto_ints), 1), 2),
                "loto_sum": sum(loto_ints),
                "even_count": sum(1 for x in loto_ints if x % 2 == 0),
                "high_count": sum(1 for x in loto_ints if x >= 50),
            }
        )

    if not rows:
        return pd.DataFrame()
    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    return df.drop_duplicates(subset=["date"]).sort_values("date").reset_index(drop=True)


def fetch_xsmb_minhngoc(target_date: Optional[date] = None, timeout: int = 20) -> pd.DataFrame:
    """Tải 7 kỳ XSMB quanh `target_date` (hoặc mới nhất) từ minhngoc.net.vn."""
    if target_date is None:
        url = "https://www.minhngoc.net.vn/ket-qua-xo-so/mien-bac.html"
    else:
        url = f"https://www.minhngoc.net.vn/ket-qua-xo-so/mien-bac/{target_date.strftime('%d-%m-%Y')}.html"
    resp = requests.get(url, headers=DEFAULT_HEADERS, timeout=timeout)
    resp.raise_for_status()
    resp.encoding = "utf-8"
    return parse_minhngoc_html(resp.text)


def fetch_minhngoc_history_days(days: int = 365) -> pd.DataFrame:
    """Tải dữ liệu lịch sử sâu (mỗi request lấy 7 ngày) từ minhngoc.net.vn và hợp nhất vào cache."""
    cached = load_cached_data()
    cur_dt = now_vn().date()
    frames = [cached] if not cached.empty else []

    steps = max(1, (days + 6) // 7)
    for i in range(steps):
        ref = cur_dt - timedelta(days=i * 7)
        try:
            part = fetch_xsmb_minhngoc(target_date=ref)
            if not part.empty:
                frames.append(part)
        except Exception:
            continue

    if not frames:
        return pd.DataFrame()
    merged = pd.concat(frames, ignore_index=True)
    merged = merged.drop_duplicates(subset=["date"], keep="last").sort_values("date").reset_index(drop=True)
    _save_cache(merged)
    return merged


def _save_cache(df: pd.DataFrame) -> None:
    if df.empty:
        return
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    to_save = df.copy()
    to_save["date"] = to_save["date"].dt.strftime("%Y-%m-%d")
    to_save.to_csv(CACHE_PATH, index=False, encoding="utf-8-sig")


def load_cached_data() -> pd.DataFrame:
    if not CACHE_PATH.exists():
        return pd.DataFrame()
    df = pd.read_csv(CACHE_PATH)
    if not df.empty:
        df["date"] = pd.to_datetime(df["date"])
        df = df.drop_duplicates(subset=["date"]).sort_values("date").reset_index(drop=True)
    return df


def load_or_update_data(force_refresh: bool = False, source_key: str = "200_ngay") -> pd.DataFrame:
    """Đọc dữ liệu từ cache local; nếu chưa có hoặc force_refresh thì tải mới và hợp nhất."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    cached_df = load_cached_data()

    if not force_refresh and not cached_df.empty:
        return cached_df

    fresh_df = fetch_xsmb_data(source_key=source_key)
    if fresh_df.empty and not cached_df.empty:
        return cached_df

    if not cached_df.empty and not fresh_df.empty:
        merged = pd.concat([cached_df, fresh_df], ignore_index=True)
        merged = merged.drop_duplicates(subset=["date"], keep="last")
        merged = merged.sort_values("date").reset_index(drop=True)
    else:
        merged = fresh_df

    _save_cache(merged)
    return merged


def smart_auto_sync(
    min_interval_minutes: int = 5,
    force_check: bool = False,
    full_source_if_empty: str = "200_ngay",
) -> Tuple[pd.DataFrame, Dict]:
    """
    Tự động kiểm tra và cập nhật dữ liệu khi có kỳ quay của ngày tiếp theo.
    - Nếu chưa có cache: tải full (`full_source_if_empty`).
    - Nếu đã có cache: kiểm tra xem `last_date < expected_latest_draw_date()` không.
      Nếu thiếu ngày mới và đã quá `min_interval_minutes` (hoặc `force_check=True`),
      tải nhanh `moi_nhat` (7 kỳ gần nhất) và hợp nhất vào cache.
    """
    cached_df = load_cached_data()
    current_vn = now_vn()
    expected_date = get_expected_latest_draw_date(current_vn)
    state = read_sync_state()

    if cached_df.empty:
        df = load_or_update_data(force_refresh=True, source_key=full_source_if_empty)
        latest_dt = df["date"].max().date().isoformat() if not df.empty else None
        info = {
            "checked": True,
            "updated": not df.empty,
            "added_count": len(df),
            "added_dates": df["date_vn"].tolist()[-3:] if not df.empty else [],
            "last_checked_at": current_vn.strftime("%d/%m/%Y %H:%M:%S"),
            "latest_data_date": latest_dt,
            "expected_date": expected_date.isoformat(),
            "status": "Khởi tạo dữ liệu lịch sử thành công" if not df.empty else "Không tải được dữ liệu",
        }
        _write_sync_state(info)
        return df, info

    last_data_date = cached_df["date"].max().date()
    need_update = last_data_date < expected_date

    # Kiểm tra throttle thời gian giữa các lần ping web
    throttled = False
    if not force_check and state.get("last_checked_at"):
        try:
            prev_check = datetime.strptime(state["last_checked_at"], "%d/%m/%Y %H:%M:%S").replace(tzinfo=VN_TZ)
            if (current_vn - prev_check) < timedelta(minutes=min_interval_minutes):
                throttled = True
        except Exception:
            pass

    if not need_update and not force_check:
        info = {
            "checked": False,
            "updated": False,
            "added_count": 0,
            "added_dates": [],
            "last_checked_at": state.get("last_checked_at", current_vn.strftime("%d/%m/%Y %H:%M:%S")),
            "latest_data_date": last_data_date.isoformat(),
            "expected_date": expected_date.isoformat(),
            "status": f"Dữ liệu đã mới nhất (đến {last_data_date.strftime('%d/%m/%Y')})",
        }
        return cached_df, info

    if throttled and not force_check:
        info = {
            "checked": False,
            "updated": False,
            "added_count": 0,
            "added_dates": [],
            "last_checked_at": state.get("last_checked_at"),
            "latest_data_date": last_data_date.isoformat(),
            "expected_date": expected_date.isoformat(),
            "status": f"Đang chờ kỳ kiểm tra tiếp theo (mỗi {min_interval_minutes} phút)",
        }
        return cached_df, info

    # Tiến hành fetch nhanh 7 kỳ mới nhất (Dual-Source: xosodaiphat.com + fallback minhngoc.net.vn)
    fresh_df = pd.DataFrame()
    err_msg = None
    try:
        fresh_df = fetch_xsmb_data(source_key="moi_nhat")
    except Exception as exc:
        err_msg = str(exc)

    existing_dates = set(cached_df["date"].dt.date)
    if fresh_df.empty or fresh_df[~fresh_df["date"].dt.date.isin(existing_dates)].empty:
        try:
            mn_df = fetch_xsmb_minhngoc()
            if not mn_df.empty:
                fresh_df = pd.concat([fresh_df, mn_df], ignore_index=True) if not fresh_df.empty else mn_df
                fresh_df = fresh_df.drop_duplicates(subset=["date"], keep="last")
        except Exception as exc2:
            if fresh_df.empty and err_msg:
                err_msg = f"{err_msg} | MinhNgoc: {exc2}"

    if fresh_df.empty and err_msg:
        info = {
            "checked": True,
            "updated": False,
            "added_count": 0,
            "added_dates": [],
            "last_checked_at": current_vn.strftime("%d/%m/%Y %H:%M:%S"),
            "latest_data_date": last_data_date.isoformat(),
            "expected_date": expected_date.isoformat(),
            "status": f"Lỗi kết nối khi kiểm tra cập nhật: {err_msg}",
        }
        _write_sync_state(info)
        return cached_df, info

    if fresh_df.empty:
        info = {
            "checked": True,
            "updated": False,
            "added_count": 0,
            "added_dates": [],
            "last_checked_at": current_vn.strftime("%d/%m/%Y %H:%M:%S"),
            "latest_data_date": last_data_date.isoformat(),
            "expected_date": expected_date.isoformat(),
            "status": "Chưa có dữ liệu mới trên trang nguồn",
        }
        _write_sync_state(info)
        return cached_df, info

    existing_dates = set(cached_df["date"].dt.date)
    new_rows = fresh_df[~fresh_df["date"].dt.date.isin(existing_dates)]

    if new_rows.empty:
        info = {
            "checked": True,
            "updated": False,
            "added_count": 0,
            "added_dates": [],
            "last_checked_at": current_vn.strftime("%d/%m/%Y %H:%M:%S"),
            "latest_data_date": last_data_date.isoformat(),
            "expected_date": expected_date.isoformat(),
            "status": f"Chưa có kết quả ngày mới (mới nhất vẫn là {last_data_date.strftime('%d/%m/%Y')})",
        }
        _write_sync_state(info)
        return cached_df, info

    merged = pd.concat([cached_df, fresh_df], ignore_index=True)
    merged = merged.drop_duplicates(subset=["date"], keep="last").sort_values("date").reset_index(drop=True)
    _save_cache(merged)

    added_dates_vn = new_rows["date_vn"].tolist()
    new_latest = merged["date"].max().date().isoformat()
    info = {
        "checked": True,
        "updated": True,
        "added_count": len(new_rows),
        "added_dates": added_dates_vn,
        "last_checked_at": current_vn.strftime("%d/%m/%Y %H:%M:%S"),
        "latest_data_date": new_latest,
        "expected_date": expected_date.isoformat(),
        "status": f"Đã tự động cập nhật thêm {len(new_rows)} kỳ mới: {', '.join(added_dates_vn)}",
    }
    _write_sync_state(info)
    return merged, info
