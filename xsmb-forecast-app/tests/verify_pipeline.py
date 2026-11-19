import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.forecaster import analyze_loto_00_99, run_backtest, run_forecast
from src.scraper import load_or_update_data


def main():
    print("1. Fetching live XSMB 200-day data...")
    df = load_or_update_data(force_refresh=True, source_key="200_ngay")
    assert not df.empty, "DataFrame should not be empty"
    print(f"   Loaded {len(df)} records: {df['date_vn'].iloc[0]} -> {df['date_vn'].iloc[-1]}")
    print(f"   Latest G.DB={df['gdb'].iloc[-1]}, de_2so={df['de_str'].iloc[-1]}, loto_count={df['loto_count'].iloc[-1]}")

    print("\n2. Running forecast (horizon=14, target=de_2so, model=ensemble)...")
    fc_df, meta = run_forecast(df, target_col="de_2so", horizon=14, model_choice="ensemble")
    assert len(fc_df) == 14
    print("   Model:", meta["model_desc"])
    print(fc_df[["date_vn", "weekday_vn", "forecast", "lower_80", "upper_80"]].head(5).to_string(index=False))

    print("\n3. Running backtest (test_days=14, target=de_2so)...")
    cmp_df, metrics_df = run_backtest(df, target_col="de_2so", test_days=14)
    assert len(cmp_df) == 14
    print(metrics_df.to_string(index=False))

    print("\n4. Running Loto 00-99 analysis...")
    loto_df = analyze_loto_00_99(df, window=200)
    assert len(loto_df) == 100
    print("   Top 5 Loto Gan:")
    print(loto_df.sort_values("Gan_hien_tai", ascending=False).head(5)[["So", "Gan_hien_tai", "Max_gan", "So_nhay"]].to_string(index=False))

    print("\nALL CHECKS PASSED!")


if __name__ == "__main__":
    main()
