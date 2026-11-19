"""Script tự động kiểm tra, cập nhật dữ liệu XSMB mới và tái dự báo (CLI / GitHub Actions)."""

from __future__ import annotations

import json
from pathlib import Path

from src.forecaster import (
    TARGET_CONFIG,
    analyze_loto_00_99,
    run_backtest,
    run_forecast,
    save_forecast_snapshot,
)
from src.scraper import DATA_DIR, smart_auto_sync


def main(force_check: bool = True) -> None:
    df, sync_info = smart_auto_sync(min_interval_minutes=1, force_check=force_check)
    print(f"[SYNC] {sync_info['status']}")
    if df.empty:
        print("[ERROR] Không có dữ liệu để dự báo.")
        return

    based_on = df["date"].max().strftime("%Y-%m-%d")
    summary = {
        "sync_info": sync_info,
        "based_on_date": based_on,
        "total_records": len(df),
        "forecasts": {},
    }

    web_payload = {
        "sync_info": sync_info,
        "based_on_date": based_on,
        "total_records": len(df),
        "target_config": TARGET_CONFIG,
        "history": df.sort_values("date")
        .assign(date=lambda x: x["date"].dt.strftime("%Y-%m-%d"))[
            [
                "date",
                "date_vn",
                "weekday",
                "gdb",
                "de_str",
                "de_2so",
                "dau_de",
                "duoi_de",
                "tong_de",
                "loto_mean",
                "even_count",
                "high_count",
                "loto_27",
            ]
        ]
        .to_dict("records"),
        "forecasts": {},
        "backtests": {},
        "loto_stats": analyze_loto_00_99(df, window=min(200, len(df))).to_dict("records"),
    }

    for target_col in list(TARGET_CONFIG.keys()):
        fc_df, meta = run_forecast(df, target_col=target_col, horizon=30, model_choice="ensemble")
        save_forecast_snapshot(fc_df, target_col=target_col, model_choice="ensemble", based_on_date=based_on)

        fc_records = fc_df.assign(date=lambda x: x["date"].dt.strftime("%Y-%m-%d"))[
            [
                "date",
                "date_vn",
                "weekday_vn",
                "forecast",
                "forecast_raw",
                "lower_80",
                "upper_80",
                "arima",
                "holt_winters",
                "theta",
                "grey_gm11",
                "rl_fgm",
                "fourier_ridge",
            ]
        ].to_dict("records")

        cmp_df, metrics_df = run_backtest(df, target_col=target_col, test_days=14)
        bt_records = cmp_df.assign(date=lambda x: x["date"].dt.strftime("%Y-%m-%d")).to_dict("records")

        web_payload["forecasts"][target_col] = {
            "meta": meta,
            "rows": fc_records,
        }
        web_payload["backtests"][target_col] = {
            "metrics": metrics_df.to_dict("records"),
            "rows": bt_records,
        }
        summary["forecasts"][target_col] = {
            "label": TARGET_CONFIG[target_col]["label"],
            "model": meta["model_desc"],
            "next_3_days": fc_df[["date_vn", "weekday_vn", "forecast", "lower_80", "upper_80"]].head(3).to_dict("records"),
        }

    out_summary = Path(DATA_DIR) / "latest_forecast_summary.json"
    out_summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    out_web = Path(DATA_DIR) / "xsmb_web_payload.json"
    out_web.write_text(json.dumps(web_payload, ensure_ascii=False), encoding="utf-8")

    print(f"[FORECAST] Đã cập nhật dự báo 30 ngày tới (đến {based_on}) -> {out_web}")


if __name__ == "__main__":
    main()
