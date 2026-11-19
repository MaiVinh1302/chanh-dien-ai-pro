"""Các mô hình phân tích chuỗi thời gian cổ điển, Hệ Xám (GM(1,1), RL-FGM, GRA) & Fourier Ridge."""

from __future__ import annotations

import warnings
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from scipy.linalg import solve_triangular, toeplitz
from scipy.special import gamma
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
    ci = fc.conf_int(alpha=0.20).to_numpy()
    return (
        _clip_series(pred, target_col),
        _clip_series(ci[:, 0], target_col),
        _clip_series(ci[:, 1], target_col),
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
    margin = 1.28 * resid_std * np.sqrt(1 + 0.04 * steps)
    return (
        _clip_series(pred, target_col),
        _clip_series(pred - margin, target_col),
        _clip_series(pred + margin, target_col),
    )


def forecast_theta_seasonal(series: pd.Series, horizon: int, target_col: str) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Dự báo bằng Theta Model kết hợp thành phần mùa vụ tuần."""
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


def forecast_grey_gm11(
    series: pd.Series, horizon: int, target_col: str, window: int = 21
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Mô hình Hệ Xám GM(1,1) trên cửa sổ trượt gần nhất."""
    vals = series.to_numpy(dtype=float)[-min(window, len(series)) :]
    n = len(vals)
    if n < 5:
        mean_val = np.full(horizon, float(np.mean(vals)))
        std_val = float(np.std(vals))
        return (
            _clip_series(mean_val, target_col),
            _clip_series(mean_val - 1.28 * std_val, target_col),
            _clip_series(mean_val + 1.28 * std_val, target_col),
        )

    shift = abs(float(np.min(vals))) + 20.0
    x0 = vals + shift
    x1 = np.cumsum(x0)

    z1 = 0.5 * x1[1:] + 0.5 * x1[:-1]
    B = np.column_stack([-z1, np.ones(n - 1)])
    Y = x0[1:]

    try:
        params, _, _, _ = np.linalg.lstsq(B, Y, rcond=None)
        a, b = float(params[0]), float(params[1])
    except Exception:
        a, b = 0.0, float(np.mean(x0))

    a = float(np.clip(a, -0.08, 0.08))
    if abs(a) < 1e-6:
        in_sample_x0 = np.full(n, float(np.mean(x0)))
        fut_x0 = np.full(horizon, float(np.mean(x0)))
    else:
        ratio = b / a
        k_all = np.arange(0, n + horizon, dtype=float)
        x1_hat = (x0[0] - ratio) * np.exp(-a * k_all) + ratio
        x0_hat = np.empty_like(x1_hat)
        x0_hat[0] = x0[0]
        x0_hat[1:] = np.diff(x1_hat)
        in_sample_x0 = x0_hat[:n]
        fut_x0 = x0_hat[n:]

    pred = fut_x0 - shift
    resid = vals - (in_sample_x0 - shift)
    resid_std = float(np.std(resid)) if len(resid) > 1 else float(series.std())
    steps = np.arange(1, horizon + 1)
    margin = 1.28 * resid_std * np.sqrt(1 + 0.03 * steps)

    return (
        _clip_series(pred, target_col),
        _clip_series(pred - margin, target_col),
        _clip_series(pred + margin, target_col),
    )


def _rl_matrix(length: int, order: float) -> np.ndarray:
    """Ma trận tích lũy phân số Riemann-Liouville (RL-FGM, Xu et al. 2026 / python-GreyTheory)."""
    if order == 0:
        return np.eye(length)
    j = np.arange(1, length + 1, dtype=float)
    weights = np.empty(length)
    weights[0] = 1.0 / gamma(order + 1.0)
    weights[1:] = j[1:] ** order * (-np.expm1(order * np.log1p(-1.0 / j[1:]))) / gamma(order + 1.0)
    return toeplitz(weights, np.r_[weights[0], np.zeros(length - 1)])


def _fit_rl_fgm_fixed(vals_pos: np.ndarray, order: float) -> Tuple[float, float, float]:
    """Khớp RL-FGM với bậc phân số `order` cố định."""
    rl_mat = _rl_matrix(len(vals_pos), order)
    acc = rl_mat @ vals_pos
    deriv = np.diff(acc)
    bg = 0.5 * (acc[1:] + acc[:-1])
    design = np.column_stack([-bg, np.ones(len(bg))])
    coeffs, _, _, _ = np.linalg.lstsq(design, deriv, rcond=None)
    a = float(np.clip(coeffs[0], -0.08, 0.08))
    b = float(coeffs[1])
    return float(acc[0]), a, b


def _predict_rl_fgm_fixed(initial: float, a: float, b: float, total_len: int, order: float) -> np.ndarray:
    t = np.arange(total_len, dtype=float)
    if abs(a) < 1e-8:
        factor = t * (1.0 - a * t / 2.0 + (a * t) ** 2 / 6.0)
    else:
        factor = -np.expm1(-a * t) / a
    acc_hat = initial + (b - a * initial) * factor
    rl_mat = _rl_matrix(total_len, order)
    return solve_triangular(rl_mat, acc_hat, lower=True)


def forecast_rl_fgm(
    series: pd.Series,
    horizon: int,
    target_col: str,
    window: int = 28,
    orders: Tuple[float, ...] = (0.25, 0.5, 0.75, 1.0, 1.25),
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """
    Riemann-Liouville Fractional-Order Grey Model (RL-FGM):
    Tự động chọn bậc tích lũy phân số tối ưu trên tập validation nội bộ.
    """
    vals = series.to_numpy(dtype=float)[-min(window, len(series)) :]
    n = len(vals)
    if n < 8:
        p, lo, hi = forecast_grey_gm11(series, horizon, target_col)
        return p, lo, hi, 1.0

    shift = abs(float(np.min(vals))) + 20.0
    vals_pos = vals + shift
    holdout = min(5, max(2, n // 5))
    train_pos = vals_pos[:-holdout]
    val_actual = vals[-holdout:]

    best_order = 1.0
    best_rmse = float("inf")
    for ord_cand in orders:
        try:
            init_v, a_v, b_v = _fit_rl_fgm_fixed(train_pos, ord_cand)
            pred_all = _predict_rl_fgm_fixed(init_v, a_v, b_v, n, ord_cand) - shift
            if not np.isfinite(pred_all).all():
                continue
            rmse = float(np.sqrt(np.mean((pred_all[-holdout:] - val_actual) ** 2)))
            if rmse < best_rmse:
                best_rmse = rmse
                best_order = ord_cand
        except Exception:
            continue

    try:
        init_f, a_f, b_f = _fit_rl_fgm_fixed(vals_pos, best_order)
        full_hat = _predict_rl_fgm_fixed(init_f, a_f, b_f, n + horizon, best_order) - shift
        if not np.isfinite(full_hat).all():
            raise ValueError("non-finite RL-FGM output")
        in_sample = full_hat[:n]
        pred = full_hat[n:]
        resid_std = float(np.std(vals - in_sample))
    except Exception:
        p, lo, hi = forecast_grey_gm11(series, horizon, target_col)
        return p, lo, hi, 1.0

    steps = np.arange(1, horizon + 1)
    margin = 1.28 * resid_std * np.sqrt(1.0 + 0.03 * steps)
    return (
        _clip_series(pred, target_col),
        _clip_series(pred - margin, target_col),
        _clip_series(pred + margin, target_col),
        best_order,
    )


def _fourier_design_matrix(t: np.ndarray, periods: Tuple[int, ...] = (7, 14, 30)) -> np.ndarray:
    cols = [np.ones_like(t, dtype=float), t / max(float(np.max(t)), 1.0)]
    for p in periods:
        cols.append(np.sin(2.0 * np.pi * t / p))
        cols.append(np.cos(2.0 * np.pi * t / p))
    return np.column_stack(cols)


def forecast_fourier_ridge(
    series: pd.Series, horizon: int, target_col: str, alpha: float = 5.0
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Hồi quy Ridge trên cơ sở sóng điều hòa Fourier (chu kỳ 7, 14, 30 ngày) + xu hướng."""
    y = series.to_numpy(dtype=float)
    n = len(y)
    t_train = np.arange(n, dtype=float)
    X_train = _fourier_design_matrix(t_train)

    reg = alpha * np.eye(X_train.shape[1])
    reg[0, 0] = 0.0
    w = np.linalg.solve(X_train.T @ X_train + reg, X_train.T @ y)

    y_fit = X_train @ w
    resid_std = float(np.std(y - y_fit)) if n > 2 else float(series.std())

    t_fut = np.arange(n, n + horizon, dtype=float)
    X_fut = _fourier_design_matrix(t_fut)
    pred = X_fut @ w

    steps = np.arange(1, horizon + 1)
    margin = 1.28 * resid_std * np.sqrt(1 + 0.02 * steps)
    return (
        _clip_series(pred, target_col),
        _clip_series(pred - margin, target_col),
        _clip_series(pred + margin, target_col),
    )


def _compute_inverse_rmse_weights(series: pd.Series, target_col: str) -> Dict[str, float]:
    """Tính trọng số tối ưu theo nghịch đảo RMSE trên cửa sổ validation ngắn gần nhất."""
    keys = ["arima", "holt_winters", "theta", "grey_gm11", "rl_fgm", "fourier_ridge"]
    val_days = min(10, max(5, len(series) // 10))
    if len(series) <= val_days + 21:
        return {k: 1.0 / len(keys) for k in keys}

    train = series.iloc[:-val_days]
    actual = series.iloc[-val_days:].to_numpy()

    p_ar, _, _, _ = forecast_arima(train, val_days, target_col)
    p_hw, _, _ = forecast_holt_winters(train, val_days, target_col)
    p_th, _, _ = forecast_theta_seasonal(train, val_days, target_col)
    p_gm, _, _ = forecast_grey_gm11(train, val_days, target_col)
    p_rl, _, _, _ = forecast_rl_fgm(train, val_days, target_col)
    p_fr, _, _ = forecast_fourier_ridge(train, val_days, target_col)

    preds = {
        "arima": p_ar,
        "holt_winters": p_hw,
        "theta": p_th,
        "grey_gm11": p_gm,
        "rl_fgm": p_rl,
        "fourier_ridge": p_fr,
    }
    inv_scores = {}
    for k, p in preds.items():
        rmse = float(np.sqrt(np.mean((actual - p) ** 2)))
        inv_scores[k] = 1.0 / max(rmse, 1e-3)

    total = sum(inv_scores.values())
    return {k: v / total for k, v in inv_scores.items()}


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
    gm_pred, gm_lo, gm_hi = forecast_grey_gm11(series, horizon, target_col)
    rl_pred, rl_lo, rl_hi, rl_order = forecast_rl_fgm(series, horizon, target_col)
    fr_pred, fr_lo, fr_hi = forecast_fourier_ridge(series, horizon, target_col)

    weights = _compute_inverse_rmse_weights(series, target_col)
    ens_pred = _clip_series(
        weights["arima"] * arima_pred
        + weights["holt_winters"] * hw_pred
        + weights["theta"] * th_pred
        + weights["grey_gm11"] * gm_pred
        + weights["rl_fgm"] * rl_pred
        + weights["fourier_ridge"] * fr_pred,
        target_col,
    )
    ens_lo = _clip_series(
        weights["arima"] * arima_lo
        + weights["holt_winters"] * hw_lo
        + weights["theta"] * th_lo
        + weights["grey_gm11"] * gm_lo
        + weights["rl_fgm"] * rl_lo
        + weights["fourier_ridge"] * fr_lo,
        target_col,
    )
    ens_hi = _clip_series(
        weights["arima"] * arima_hi
        + weights["holt_winters"] * hw_hi
        + weights["theta"] * th_hi
        + weights["grey_gm11"] * gm_hi
        + weights["rl_fgm"] * rl_hi
        + weights["fourier_ridge"] * fr_hi,
        target_col,
    )

    mapping = {
        "arima": (arima_pred, arima_lo, arima_hi, arima_desc),
        "holt_winters": (hw_pred, hw_lo, hw_hi, "Holt-Winters (ETS)"),
        "theta": (th_pred, th_lo, th_hi, "Theta Seasonal (7d)"),
        "grey_gm11": (gm_pred, gm_lo, gm_hi, "Grey System GM(1,1) Rolling"),
        "rl_fgm": (rl_pred, rl_lo, rl_hi, f"RL-FGM Fractional Grey (order={rl_order})"),
        "fourier_ridge": (fr_pred, fr_lo, fr_hi, "Fourier Harmonic Ridge"),
        "ensemble": (
            ens_pred,
            ens_lo,
            ens_hi,
            f"Weighted Ensemble (6 mô hình: {arima_desc} + ETS + Theta + GM(1,1) + RL-FGM(r={rl_order}) + Fourier)",
        ),
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
            "grey_gm11": np.round(gm_pred, 2),
            "rl_fgm": np.round(rl_pred, 2),
            "fourier_ridge": np.round(fr_pred, 2),
        }
    )

    meta = {
        "model_desc": used_desc,
        "train_days": len(series),
        "last_date": last_date.strftime("%d/%m/%Y"),
        "hist_mean": round(float(series.mean()), 2),
        "hist_std": round(float(series.std()), 2),
        "rl_fgm_order": rl_order,
        "weights": {k: round(v, 3) for k, v in weights.items()},
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
    gm_pred, _, _ = forecast_grey_gm11(train, test_days, target_col)
    rl_pred, _, _, rl_order = forecast_rl_fgm(train, test_days, target_col)
    fr_pred, _, _ = forecast_fourier_ridge(train, test_days, target_col)

    weights = _compute_inverse_rmse_weights(train, target_col)
    ens_pred = _clip_series(
        weights["arima"] * arima_pred
        + weights["holt_winters"] * hw_pred
        + weights["theta"] * th_pred
        + weights["grey_gm11"] * gm_pred
        + weights["rl_fgm"] * rl_pred
        + weights["fourier_ridge"] * fr_pred,
        target_col,
    )

    actual = test.to_numpy()
    compare_df = pd.DataFrame(
        {
            "date": test.index,
            "date_vn": test.index.strftime("%d/%m/%Y"),
            "Thuc_te": actual,
            "ARIMA": np.round(arima_pred, 2),
            "Holt_Winters": np.round(hw_pred, 2),
            "Theta": np.round(th_pred, 2),
            "Grey_GM11": np.round(gm_pred, 2),
            "RL_FGM": np.round(rl_pred, 2),
            "Fourier_Ridge": np.round(fr_pred, 2),
            "Ensemble": np.round(ens_pred, 2),
        }
    )

    metrics = []
    for name, col in [
        (arima_desc, "ARIMA"),
        ("Holt-Winters (ETS)", "Holt_Winters"),
        ("Theta Seasonal", "Theta"),
        ("Grey GM(1,1) Rolling", "Grey_GM11"),
        (f"RL-FGM (r={rl_order})", "RL_FGM"),
        ("Fourier Ridge", "Fourier_Ridge"),
        ("Weighted Ensemble", "Ensemble"),
    ]:
        err = actual - compare_df[col].to_numpy()
        mae = float(np.mean(np.abs(err)))
        rmse = float(np.sqrt(np.mean(err**2)))
        metrics.append({"Mo_hinh": name, "MAE": round(mae, 3), "RMSE": round(rmse, 3)})

    metrics_df = pd.DataFrame(metrics).sort_values("RMSE").reset_index(drop=True)
    return compare_df, metrics_df


def analyze_loto_00_99(df: pd.DataFrame, window: int = 200) -> pd.DataFrame:
    """Phân tích tần suất, Loto gan và chấm điểm GRA (Grey Relational Analysis) cho 00–99."""
    sub = df.sort_values("date").tail(window).reset_index(drop=True)
    total_days = len(sub)
    if total_days == 0:
        return pd.DataFrame()

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

        current_gan = 0
        for st in reversed(day_sets):
            if code in st:
                break
            current_gan += 1

        max_gan = 0
        cur = 0
        for st in day_sets:
            if code in st:
                max_gan = max(max_gan, cur)
                cur = 0
            else:
                cur += 1
        max_gan = max(max_gan, cur)

        expected_freq = 0.27 * total_days
        deviation = freq_all - expected_freq
        gan_ratio = current_gan / max(max_gan, 1)

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
                "Gan_ratio": round(gan_ratio, 3),
            }
        )

    res = pd.DataFrame(stats_rows)

    def _minmax(col: np.ndarray) -> np.ndarray:
        mn, mx = float(np.min(col)), float(np.max(col))
        if mx - mn < 1e-9:
            return np.zeros_like(col)
        return (col - mn) / (mx - mn)

    n_gan = _minmax(res["Gan_hien_tai"].to_numpy(dtype=float))
    n_ratio = _minmax(res["Gan_ratio"].to_numpy(dtype=float))
    n_deficit = _minmax(-res["Chenh_ky_vong"].to_numpy(dtype=float))

    deltas = np.column_stack([1.0 - n_gan, 1.0 - n_ratio, 1.0 - n_deficit])
    d_min = float(np.min(deltas))
    d_max = float(np.max(deltas))
    rho = 0.5
    grc = (d_min + rho * d_max) / (deltas + rho * d_max + 1e-9)
    gra_grade = np.mean(grc, axis=1)

    res["Diem_chu_y"] = np.round(gra_grade * 100.0, 2)
    return res


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


def recommend_numbers_for_date(
    df: pd.DataFrame,
    days_ahead: int = 1,
    model_choice: str = "ensemble",
    window: int = 200,
) -> Dict:
    """
    Tư vấn lựa chọn tối ưu nhất và các bộ số có khả năng/tín hiệu thống kê cao
    cho ngày thứ `days_ahead` tiếp theo (1 = ngày kế tiếp).
    Kết hợp:
      1) Vùng kỳ vọng Chuỗi Thời Gian (Weighted Ensemble 6 mô hình: Đầu, Đuôi, Tổng, Đề)
      2) Điểm Quan hệ Xám GRA (Gan hiện tại, Tỷ lệ Gan/Max, Chênh kỳ vọng)
      3) Đà tần suất ngắn hạn 30 ngày (Momentum)
    """
    horizon = max(1, int(days_ahead))
    targets = ["de_2so", "dau_de", "duoi_de", "tong_de", "even_count", "high_count"]
    fc_map = {}
    for col in targets:
        fc_df, _ = run_forecast(df, target_col=col, horizon=horizon, model_choice=model_choice)
        fc_map[col] = fc_df.iloc[horizon - 1]

    target_date_vn = str(fc_map["de_2so"]["date_vn"])
    target_weekday = str(fc_map["de_2so"]["weekday_vn"])

    de_exp = float(fc_map["de_2so"]["forecast_raw"])
    dau_exp = float(fc_map["dau_de"]["forecast_raw"])
    duoi_exp = float(fc_map["duoi_de"]["forecast_raw"])
    tong_exp = float(fc_map["tong_de"]["forecast_raw"])
    even_exp = float(fc_map["even_count"]["forecast_raw"])
    high_exp = float(fc_map["high_count"]["forecast_raw"])

    loto_df = analyze_loto_00_99(df, window=min(window, len(df))).copy()
    max_30 = max(float(loto_df["Nhay_30_ngay"].max()), 1.0)

    ts_scores = []
    mom_scores = []
    total_scores = []
    reasons = []

    for _, row in loto_df.iterrows():
        num = int(row["So"])
        d_dau = num // 10
        d_duoi = num % 10
        d_tong = d_dau + d_duoi

        # 1) Điểm khớp vùng Chuỗi Thời Gian (0..40)
        s_dau = max(0.0, 12.0 - 4.0 * abs(d_dau - dau_exp))
        s_duoi = max(0.0, 12.0 - 4.0 * abs(d_duoi - duoi_exp))
        s_tong = max(0.0, 10.0 - 2.5 * abs(d_tong - tong_exp))
        s_de = max(0.0, 6.0 - 0.2 * abs(num - de_exp))
        ts_sc = s_dau + s_duoi + s_tong + s_de

        # 2) Điểm GRA (0..40)
        gra_sc = 0.40 * float(row["Diem_chu_y"])

        # 3) Điểm Đà 30 ngày (0..20) - thưởng các số đang chạy đều
        mom_sc = 20.0 * (float(row["Nhay_30_ngay"]) / max_30)
        if int(row["Gan_hien_tai"]) <= 3:
            mom_sc = min(20.0, mom_sc + 4.0)

        tot_sc = round(ts_sc + gra_sc + 0.5 * mom_sc, 2)
        ts_scores.append(round(ts_sc, 2))
        mom_scores.append(round(mom_sc, 2))
        total_scores.append(tot_sc)

        tags = []
        if abs(d_dau - dau_exp) <= 1.2:
            tags.append(f"Khớp Đầu {d_dau}")
        if abs(d_duoi - duoi_exp) <= 1.2:
            tags.append(f"Khớp Đuôi {d_duoi}")
        if abs(d_tong - tong_exp) <= 2.0:
            tags.append(f"Tổng {d_tong}")
        if float(row["Gan_ratio"]) >= 0.85:
            tags.append("Chạm đỉnh Gan")
        elif int(row["Gan_hien_tai"]) <= 3 and int(row["Nhay_30_ngay"]) >= 8:
            tags.append("Đà chạy đều")
        reasons.append(", ".join(tags) if tags else "Cân bằng đa tiêu chí")

    loto_df["Diem_TS"] = ts_scores
    loto_df["Diem_Da"] = mom_scores
    loto_df["Diem_Toi_Uu"] = total_scores
    loto_df["Ly_do"] = reasons

    top_optimal = loto_df.sort_values(["Diem_Toi_Uu", "Diem_chu_y"], ascending=False).head(6).reset_index(drop=True)
    top_momentum = (
        loto_df[loto_df["Gan_hien_tai"] <= 5]
        .sort_values(["Diem_Da", "Diem_TS"], ascending=False)
        .head(6)
        .reset_index(drop=True)
    )
    top_gan = loto_df.sort_values(["Diem_chu_y", "Gan_hien_tai"], ascending=False).head(6).reset_index(drop=True)

    # Khoanh vùng Đầu / Đuôi / Tổng tốt nhất
    dau_center = int(round(dau_exp))
    duoi_center = int(round(duoi_exp))
    tong_center = int(round(tong_exp))

    summary = {
        "date_vn": target_date_vn,
        "weekday_vn": target_weekday,
        "days_ahead": horizon,
        "de_exp": round(de_exp, 2),
        "de_round": f"{int(round(de_exp)):02d}",
        "de_ci": (float(fc_map["de_2so"]["lower_80"]), float(fc_map["de_2so"]["upper_80"])),
        "dau_range": sorted({max(0, min(9, dau_center + d)) for d in (-1, 0, 1)}),
        "duoi_range": sorted({max(0, min(9, duoi_center + d)) for d in (-1, 0, 1)}),
        "tong_range": sorted({max(0, min(18, tong_center + d)) for d in (-1, 0, 1)}),
        "even_exp": round(even_exp, 1),
        "high_exp": round(high_exp, 1),
    }

    return {
        "summary": summary,
        "top_optimal": top_optimal,
        "top_momentum": top_momentum,
        "top_gan": top_gan,
    }
