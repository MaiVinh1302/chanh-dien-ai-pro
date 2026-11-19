"""Các mô hình phân tích chuỗi thời gian cổ điển & thống kê Loto XSMB."""

from __future__ import annotations

import warnings
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from statsmodels.tsa.forecasting.theta import ThetaModel
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.statespace.sarimax import SARIMAX

warnings.filterwarnings("ignore")

FORECAST_LOG_PATH = Path(__file__).resolve().parent.parent / "data" / "forecast_log.csv"


TARGET_CONFIG = {
    "de_2so": {
        "label": "2 số cuối Giải Đặc Biệt (Đề: 00–99)",
        "min_val": 0,
        "max_val": 99,
        "is_int": True,
    },
    "dau_de": {
        "label": "Chữ số Đầu Giải Đặc Biệt (0–9)",
        "min_val": 0,
        "max_val": 9,
        "is_int": True,
    },
    "duoi_de": {
        "label": "Chữ số Đuôi Giải Đặc Biệt (0–9)",
        "min_val": 0,
        "max_val": 9,
        "is_int": True,
    },
    "tong_de": {
        "label": "Tổng 2 số cuối Giải Đặc Biệt (0–18)",
        "min_val": 0,
        "max_val": 18,
        "is_int": True,
    },
    "loto_mean": {
        "label": "Trung bình cộng 27 giải Loto (0–99)",
        "min_val": 0,
        "max_val": 99,
        "is_int": False,
    },
    "even_count": {
        "label": "Số lượng Loto Chẵn trong ngày (0–27)",
        "min_val": 0,
        "max_val": 27,
        "is_int": True,
    },
    "high_count": {
        "label": "Số lượng Loto Tài >= 50 trong ngày (0–27)",
        "min_val": 0,
        "max_val": 27,
        "is_int": True,
    },
}


def _prepare_series(df: pd.DataFrame, target_col: str) -> pd.Series:
    """Chuẩn hóa chuỗi thời gian theo tần suất ngày (fill missing nếu có ngày nghỉ lễ)."""
    s = df.set_index("date")[target_col].astype(float).sort_index()
    full_idx = pd.date_range(start=s.index.min(), end=s.index.max(), freq="D")
    s = s.reindex(full_idx).interpolate(method="linear").bfill().ffill()
    return s


def _clip_series(values: np.ndarray, target_col: str) -> np.ndarray:
    cfg = TARGET_CONFIG[target_col]
    return np.clip(values, cfg["min_val"], cfg["max_val"])


def forecast_arima(series: pd.Series, horizon: int, target_col: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray, str]:
    """Dự báo bằng ARIMA/SARIMA chọn bậc tối ưu theo AIC."""
    candidates = [
        ((1, 0, 1), (0, 0, 0, 0)),
        ((2, 0, 1), (0, 0, 0, 0)),
        ((1, 1, 1), (0, 0, 0, 0)),
        ((1, 0, 1), (1, 0, 1, 7)),
        ((2, 0, 2), (0, 0, 0, 0)),
    ]
    best_aic = float("inf")
    best_fit = None
    best_desc = "ARIMA(1,0,1)"

    for order, seasonal_order in candidates:
        try:
            model = SARIMAX(
                series,
                order=order,
                seasonal_order=seasonal_order,
                enforce_stationarity=False,
                enforce_invertibility=False,
            )
            fit = model.fit(disp=False, maxiter=100)
            if fit.aic < best_aic:
                best_aic = fit.aic
                best_fit = fit
                if seasonal_order[3] > 0:
                    best_desc = f"SARIMA{order}x{seasonal_order}"
                else:
                    best_desc = f"ARIMA{order}"
        except Exception:
            continue

    if best_fit is None:
        mean_val = np.full(horizon, series.mean())
        std_val = series.std()
        return (
            _clip_series(mean_val, target_col),
            _clip_series(mean_val - 1.28 * std_val, target_col),
            _clip_series(mean_val + 1.28 * std_val, target_col),
            "Mean Fallback",
        )

    fc = best_fit.get_forecast(steps=horizon)
    pred = fc.predicted_mean.to_numpy()
    ci = fc.conf_int(alpha=0.20).to_numpy()  # 80% CI
    lower = ci[:, 0]
    upper = ci[:, 1]
    return (
        _clip_series(pred, target_col),
        _clip_series(lower, target_col),
        _clip_series(upper, target_col),
        best_desc,
    )


def forecast_holt_winters(series: pd.Series, horizon: int, target_col: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Dự báo bằng Exponential Smoothing (Holt-Winters chu kỳ 7 ngày)."""
    try:
        use_seasonal = len(series) >= 21
        model = ExponentialSmoothing(
            series,
            trend="add",
            damped_trend=True,
            seasonal="add" if use_seasonal else None,
            seasonal_periods=7 if use_seasonal else None,
        )
        fit = model.fit(optimized=True)
        pred = fit.forecast(horizon).to_numpy()
        resid_std = float(np.std(fit.resid)) if len(fit.resid) > 0 else float(series.std())
    except Exception:
        pred = np.full(horizon, series.ewm(span=14).mean().iloc[-1])
        resid_std = float(series.std())

    steps = np.arange(1, horizon + 1)
    margin = 1.28 * resid_std * np.sqrt(1 + 0.05 * steps)
    return (
        _clip_series(pred, target_col),
        _clip_series(pred - margin, target_col),
        _clip_series(pred + margin, target_col),
    )


def forecast_theta_seasonal(series: pd.Series, horizon: int, target_col: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Dự báo bằng Theta Model kết hợp thành phần mùa vụ tuần (tương tự cấu trúc Prophet nhẹ)."""
    try:
        model = ThetaModel(series, period=7 if len(series) >= 21 else 1, deseasonalize=len(series) >= 21)
        fit = model.fit()
        pred = fit.forecast(horizon).to_numpy()
        pi = fit.prediction_intervals(horizon, alpha=0.20)
        lower = pi["lower"].to_numpy()
        upper = pi["upper"].to_numpy()
    except Exception:
        pred = np.full(horizon, series.rolling(14, min_periods=1).mean().iloc[-1])
        std_val = float(series.std())
        lower = pred - 1.28 * std_val
        upper = pred + 1.28 * std_val

    return (
        _clip_series(pred, target_col),
        _clip_series(lower, target_col),
        _clip_series(upper, target_col),
    )


def run_forecast(
    df: pd.DataFrame,
    target_col: str,
    horizon: int = 14,
    model_choice: str = "ensemble",
) -> Tuple[pd.DataFrame, Dict]:
    """Chạy dự báo cho `horizon` ngày tiếp theo và trả về DataFrame + metadata."""
    series = _prepare_series(df, target_col)
    last_date = series.index.max()
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=horizon, freq="D")

    arima_pred, arima_lo, arima_hi, arima_desc = forecast_arima(series, horizon, target_col)
    hw_pred, hw_lo, hw_hi = forecast_holt_winters(series, horizon, target_col)
    th_pred, th_lo, th_hi = forecast_theta_seasonal(series, horizon, target_col)

    ens_pred = _clip_series((arima_pred + hw_pred + th_pred) / 3.0, target_col)
    ens_lo = _clip_series((arima_lo + hw_lo + th_lo) / 3.0, target_col)
    ens_hi = _clip_series((arima_hi + hw_hi + th_hi) / 3.0, target_col)

    mapping = {
        "arima": (arima_pred, arima_lo, arima_hi, arima_desc),
        "holt_winters": (hw_pred, hw_lo, hw_hi, "Holt-Winters (ETS)"),
        "theta": (th_pred, th_lo, th_hi, "Theta Seasonal (7d)"),
        "ensemble": (ens_pred, ens_lo, ens_hi, f"Ensemble ({arima_desc} + ETS + Theta)"),
    }
    pred, lo, hi, used_desc = mapping.get(model_choice, mapping["ensemble"])

    is_int = TARGET_CONFIG[target_col]["is_int"]
    out = pd.DataFrame(
        {
            "date": future_dates,
            "date_vn": future_dates.strftime("%d/%m/%Y"),
            "weekday_vn": future_dates.dayofweek.map(
                {0: "Thứ 2", 1: "Thứ 3", 2: "Thứ 4", 3: "Thứ 5", 4: "Thứ 6", 5: "Thứ 7", 6: "Chủ Nhật"}
            ),
            "forecast": np.round(pred, 0).astype(int) if is_int else np.round(pred, 2),
            "forecast_raw": np.round(pred, 2),
            "lower_80": np.round(lo, 2),
            "upper_80": np.round(hi, 2),
            "arima": np.round(arima_pred, 2),
            "holt_winters": np.round(hw_pred, 2),
            "theta": np.round(th_pred, 2),
        }
    )

    meta = {
        "model_desc": used_desc,
        "train_days": len(series),
        "last_date": last_date.strftime("%d/%m/%Y"),
        "hist_mean": round(float(series.mean()), 2),
        "hist_std": round(float(series.std()), 2),
    }
    return out, meta


def run_backtest(df: pd.DataFrame, target_col: str, test_days: int = 14) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Đánh giá hiệu năng các mô hình trên `test_days` ngày gần nhất."""
    series = _prepare_series(df, target_col)
    if len(series) <= test_days + 21:
        test_days = max(7, len(series) // 4)

    train = series.iloc[:-test_days]
    test = series.iloc[-test_days:]

    arima_pred, _, _, arima_desc = forecast_arima(train, test_days, target_col)
    hw_pred, _, _ = forecast_holt_winters(train, test_days, target_col)
    th_pred, _, _ = forecast_theta_seasonal(train, test_days, target_col)
    ens_pred = _clip_series((arima_pred + hw_pred + th_pred) / 3.0, target_col)

    actual = test.to_numpy()
    compare_df = pd.DataFrame(
        {
            "date": test.index,
            "date_vn": test.index.strftime("%d/%m/%Y"),
            "Thuc_te": actual,
            "ARIMA": np.round(arima_pred, 2),
            "Holt_Winters": np.round(hw_pred, 2),
            "Theta": np.round(th_pred, 2),
            "Ensemble": np.round(ens_pred, 2),
        }
    )

    metrics = []
    for name, col in [
        (arima_desc, "ARIMA"),
        ("Holt-Winters (ETS)", "Holt_Winters"),
        ("Theta Seasonal", "Theta"),
        ("Ensemble (Tổ hợp)", "Ensemble"),
    ]:
        err = actual - compare_df[col].to_numpy()
        mae = float(np.mean(np.abs(err)))
        rmse = float(np.sqrt(np.mean(err**2)))
        metrics.append({"Mo_hinh": name, "MAE": round(mae, 3), "RMSE": round(rmse, 3)})

    metrics_df = pd.DataFrame(metrics).sort_values("RMSE").reset_index(drop=True)
    return compare_df, metrics_df


def analyze_loto_00_99(df: pd.DataFrame, window: int = 200) -> pd.DataFrame:
    """Phân tích tần suất xuất hiện và Loto gan cho 100 cặp số 00–99."""
    sub = df.sort_values("date").tail(window).reset_index(drop=True)
    total_days = len(sub)
    if total_days == 0:
        return pd.DataFrame()

    # Chuẩn bị list set các số loto mỗi ngày
    day_sets: List[set] = []
    day_lists: List[List[str]] = []
    for s in sub["loto_27"].astype(str):
        nums = [x.strip().zfill(2) for x in s.split(",") if x.strip()]
        day_lists.append(nums)
        day_sets.append(set(nums))

    de_list = sub["de_str"].astype(str).str.zfill(2).tolist()

    stats_rows = []
    for num in range(100):
        code = f"{num:02d}"
        freq_all = sum(lst.count(code) for lst in day_lists)
        days_hit = sum(1 for st in day_sets if code in st)
        freq_30 = sum(lst.count(code) for lst in day_lists[-30:]) if total_days >= 30 else freq_all
        de_hits = sum(1 for d in de_list if d == code)

        # Tính số ngày gan hiện tại (tính từ cuối lên)
        current_gan = 0
        for st in reversed(day_sets):
            if code in st:
                break
            current_gan += 1

        # Tính max gan trong window
        max_gan = 0
        cur = 0
        for st in day_sets:
            if code in st:
                max_gan = max(max_gan, cur)
                cur = 0
            else:
                cur += 1
        max_gan = max(max_gan, cur)

        # Kỳ vọng lý thuyết: 27 lần quay / 100 số => trung bình mỗi ngày xuất hiện ~0.27 lần,
        # xác suất về ít nhất 1 nháy trong ngày ~ 1 - (99/100)^27 ≈ 23.77%
        expected_freq = 0.27 * total_days
        deviation = freq_all - expected_freq
        # Điểm chú ý thống kê (kết hợp gan hiện tại và độ hụt tần suất)
        score = round(current_gan * 0.65 + max(0.0, -deviation) * 0.35, 2)

        stats_rows.append(
            {
                "So": code,
                "So_nhay": freq_all,
                "So_ngay_ve": days_hit,
                "Nhay_30_ngay": freq_30,
                "Ve_G_DB": de_hits,
                "Gan_hien_tai": current_gan,
                "Max_gan": max_gan,
                "Chenh_ky_vong": round(deviation, 2),
                "Diem_chu_y": score,
            }
        )

    return pd.DataFrame(stats_rows)


def save_forecast_snapshot(
    fc_df: pd.DataFrame,
    target_col: str,
    model_choice: str,
    based_on_date: str,
) -> None:
    """Lưu lại bản dự báo theo ngày gốc (`based_on_date`) để đối chiếu khi có KQXS mới."""
    if fc_df.empty:
        return
    FORECAST_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

    snap = fc_df[["date", "date_vn", "forecast", "forecast_raw", "lower_80", "upper_80"]].copy()
    snap["target_date"] = snap["date"].dt.strftime("%Y-%m-%d")
    snap["target_col"] = target_col
    snap["model_choice"] = model_choice
    snap["based_on_date"] = based_on_date
    snap = snap[
        ["based_on_date", "target_col", "model_choice", "target_date", "date_vn", "forecast", "forecast_raw", "lower_80", "upper_80"]
    ]

    if FORECAST_LOG_PATH.exists():
        old = pd.read_csv(FORECAST_LOG_PATH)
        combined = pd.concat([old, snap], ignore_index=True)
        combined = combined.drop_duplicates(
            subset=["based_on_date", "target_col", "model_choice", "target_date"],
            keep="last",
        )
    else:
        combined = snap

    combined.to_csv(FORECAST_LOG_PATH, index=False, encoding="utf-8-sig")


def evaluate_recent_forecasts(df: pd.DataFrame, target_col: str, model_choice: str) -> pd.DataFrame:
    """Đối chiếu các bản dự báo đã lưu trước đó với kết quả thực tế mới cập nhật."""
    if not FORECAST_LOG_PATH.exists() or df.empty:
        return pd.DataFrame()

    log_df = pd.read_csv(FORECAST_LOG_PATH)
    sub = log_df[(log_df["target_col"] == target_col) & (log_df["model_choice"] == model_choice)].copy()
    if sub.empty:
        return pd.DataFrame()

    actual_map = df.assign(target_date=df["date"].dt.strftime("%Y-%m-%d"))[["target_date", target_col]].rename(
        columns={target_col: "Thuc_te"}
    )
    merged = sub.merge(actual_map, on="target_date", how="inner")
    if merged.empty:
        return pd.DataFrame()

    merged["Sai_so"] = (merged["Thuc_te"] - merged["forecast_raw"]).abs().round(2)
    merged["Trong_khoang_80"] = (merged["Thuc_te"] >= merged["lower_80"]) & (merged["Thuc_te"] <= merged["upper_80"])
    return merged.sort_values(["target_date", "based_on_date"], ascending=[False, False]).reset_index(drop=True)
