"""Ứng dụng Web Phân tích & Dự báo Chuỗi Thời Gian XSMB (nguồn: xosodaiphat.com)."""

from __future__ import annotations

from datetime import timedelta

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from src.forecaster import (
    TARGET_CONFIG,
    analyze_loto_00_99,
    evaluate_recent_forecasts,
    recommend_numbers_for_date,
    run_backtest,
    run_forecast,
    save_forecast_snapshot,
)
from src.scraper import (
    get_expected_latest_draw_date,
    load_or_update_data,
    read_sync_state,
    smart_auto_sync,
)

st.set_page_config(
    page_title="XSMB Time-Series Forecast & Analytics",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.title("📊 Nghiên cứu & Dự báo Số liệu Chuỗi Thời Gian XSMB")
st.caption(
    "Nguồn dữ liệu trực tiếp từ [xosodaiphat.com](https://xosodaiphat.com/xsmb-xo-so-mien-bac.html) "
    "| Mô hình: ARIMA/SARIMA, Holt-Winters Exponential Smoothing, Theta Seasonal & Ensemble."
)

st.info(
    "**Lưu ý khoa học:** Kết quả quay thưởng XSMB là các biến cố ngẫu nhiên độc lập theo quy luật xác suất. "
    "Các mô hình chuỗi thời gian cổ điển trong ứng dụng này dùng để **mô phỏng xu hướng, kiểm thử sai số (Backtest) "
    "và phân tích thống kê lịch sử (tần suất, loto gan)** phục vụ mục đích nghiên cứu tham khảo, không đảm bảo kết quả trúng thưởng."
)

# ---------------- Auto-Sync on Load ----------------
if "sync_notice" not in st.session_state:
    st.session_state["sync_notice"] = None

# ---------------- Sidebar ----------------
with st.sidebar:
    st.header("🤖 Tự động Cập nhật & Dự báo")

    auto_watch = st.toggle("Tự động theo dõi khi có KQXS mới", value=True)
    interval_min = st.selectbox(
        "Chu kỳ kiểm tra tự động",
        options=[1, 5, 15, 30],
        index=1,
        format_func=lambda m: f"Mỗi {m} phút",
        disabled=not auto_watch,
    )

    source_key = st.selectbox(
        "Phạm vi tải đầy đủ từ xosodaiphat.com",
        options=["200_ngay", "100_ngay", "90_ngay", "60_ngay", "30_ngay", "moi_nhat"],
        format_func=lambda k: {
            "200_ngay": "200 kỳ gần nhất (Khuyên dùng)",
            "100_ngay": "100 kỳ gần nhất",
            "90_ngay": "90 kỳ gần nhất",
            "60_ngay": "60 kỳ gần nhất",
            "30_ngay": "30 kỳ gần nhất",
            "moi_nhat": "7 kỳ mới nhất",
        }[k],
        index=0,
    )

    col_btn1, col_btn2 = st.columns(2)
    with col_btn1:
        manual_sync = st.button("⚡ Kiểm tra ngay", use_container_width=True, type="primary")
    with col_btn2:
        full_reload = st.button("🔄 Tải lại full", use_container_width=True)

    if full_reload:
        with st.spinner("Đang tải toàn bộ dữ liệu từ xosodaiphat.com..."):
            df = load_or_update_data(force_refresh=True, source_key=source_key)
            st.session_state["sync_notice"] = f"Đã tải lại {len(df)} kỳ quay từ {source_key}."
    elif manual_sync:
        with st.spinner("Đang kiểm tra kết quả ngày mới..."):
            df, sync_info = smart_auto_sync(min_interval_minutes=0, force_check=True, full_source_if_empty=source_key)
            st.session_state["sync_notice"] = sync_info["status"]
    else:
        df, sync_info = smart_auto_sync(min_interval_minutes=interval_min, force_check=False, full_source_if_empty=source_key)
        if sync_info.get("updated"):
            st.session_state["sync_notice"] = sync_info["status"]

    sync_state = read_sync_state()
    expected_dt = get_expected_latest_draw_date()
    st.caption(
        f"**Kỳ kỳ vọng (sau 18h35):** `{expected_dt.strftime('%d/%m/%Y')}`  \n"
        f"**Lần kiểm tra gần nhất:** `{sync_state.get('last_checked_at', 'Chưa có')}`"
    )
    if st.session_state.get("sync_notice"):
        st.success(st.session_state["sync_notice"])

    st.divider()
    st.header("⚙️ Cấu hình Mô hình Dự báo")

    target_col = st.selectbox(
        "Chỉ số mục tiêu cần dự báo",
        options=list(TARGET_CONFIG.keys()),
        format_func=lambda k: TARGET_CONFIG[k]["label"],
        index=0,
    )

    model_choice = st.selectbox(
        "Mô hình chuỗi thời gian",
        options=["ensemble", "arima", "holt_winters", "theta", "grey_gm11", "rl_fgm", "fourier_ridge"],
        format_func=lambda k: {
            "ensemble": "Weighted Ensemble (6 mô hình theo nghịch đảo RMSE)",
            "arima": "ARIMA / SARIMA (Tự động chọn theo AIC)",
            "holt_winters": "Exponential Smoothing (Holt-Winters 7 ngày)",
            "theta": "Theta Seasonal (Phân rã xu hướng & mùa vụ)",
            "grey_gm11": "Grey System GM(1,1) Rolling (Lý thuyết Hệ Xám)",
            "rl_fgm": "RL-FGM Fractional Grey (Tích lũy phân số Riemann-Liouville)",
            "fourier_ridge": "Fourier Harmonic Ridge (Sóng điều hòa 7/14/30d)",
        }[k],
        index=0,
    )

    horizon = st.slider("Số ngày dự báo tiếp theo", min_value=3, max_value=31, value=14, step=1)
    history_view = st.slider("Số ngày lịch sử hiển thị trên biểu đồ", min_value=30, max_value=200, value=90, step=10)

# ---------------- Background Polling Fragment ----------------
if auto_watch:
    @st.fragment(run_every=timedelta(minutes=interval_min))
    def _auto_poll_worker():
        _, info = smart_auto_sync(min_interval_minutes=interval_min, force_check=False, full_source_if_empty=source_key)
        if info.get("updated"):
            st.session_state["sync_notice"] = info["status"]
            st.toast(f"🎉 {info['status']}", icon="🔔")
            st.rerun()

    _auto_poll_worker()

if df.empty:
    st.error("Không tải được dữ liệu từ xosodaiphat.com. Vui lòng kiểm tra kết nối mạng và bấm 'Tải lại full'.")
    st.stop()

# KPI Summary Row
latest = df.iloc[-1]
based_on_date = latest["date"].strftime("%Y-%m-%d")

col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Tổng số kỳ lịch sử", f"{len(df)} ngày")
col2.metric("Kỳ mới nhất", latest["date_vn"])
col3.metric("Giải ĐB mới nhất", str(latest["gdb"]).zfill(5))
col4.metric("2 số cuối GĐB", str(latest["de_str"]).zfill(2))
col5.metric("Trung bình 27 giải", f"{latest['loto_mean']:.2f}")

# ---------------- SMART ADVISOR SECTION ----------------
with st.container(border=True):
    st.subheader("🎯 Trợ Lý Tư Vấn Lựa Chọn Tối Ưu Theo Ngày")
    adv_c1, adv_c2 = st.columns([2, 1])
    last_dt = latest["date"]
    day_options = list(range(1, 31))
    weekday_map = {0: "Thứ 2", 1: "Thứ 3", 2: "Thứ 4", 3: "Thứ 5", 4: "Thứ 6", 5: "Thứ 7", 6: "Chủ Nhật"}
    with adv_c1:
        selected_days_ahead = st.selectbox(
            "Chọn ngày muốn tư vấn số liệu",
            options=day_options,
            format_func=lambda d: (
                f"{(last_dt + timedelta(days=d)).strftime('%d/%m/%Y')} "
                f"({weekday_map[(last_dt + timedelta(days=d)).dayofweek]} — +{d} ngày)"
            ),
            index=0,
        )
    with adv_c2:
        st.markdown("<div style='height: 28px'></div>", unsafe_allow_html=True)
        run_advisor_btn = st.button(
            "🎯 Tư vấn Lựa chọn Tối ưu Nhất",
            use_container_width=True,
            type="primary",
        )

    if run_advisor_btn:
        with st.spinner("Đang tổng hợp 6 mô hình Chuỗi Thời Gian + Hệ Xám GRA + Đà 30 ngày..."):
            adv = recommend_numbers_for_date(
                df,
                days_ahead=selected_days_ahead,
                model_choice=model_choice,
                window=min(200, len(df)),
            )
            st.session_state["advisor_result"] = adv

    if "advisor_result" in st.session_state:
        adv = st.session_state["advisor_result"]
        sm = adv["summary"]
        st.success(
            f"**Ngày tư vấn: {sm['date_vn']} ({sm['weekday_vn']})** | "
            f"Trung tâm GĐB kỳ vọng: **`{sm['de_round']}`** (CI 80%: `{sm['de_ci'][0]} – {sm['de_ci'][1]}`) | "
            f"Vùng Đầu: **`{', '.join(map(str, sm['dau_range']))}`** | "
            f"Vùng Đuôi: **`{', '.join(map(str, sm['duoi_range']))}`** | "
            f"Vùng Tổng: **`{', '.join(map(str, sm['tong_range']))}`** | "
            f"Chẵn/Tài dự kiến: `{sm['even_exp']}/27` & `{sm['high_exp']}/27`"
        )
        r1, r2, r3 = st.columns(3)
        with r1:
            st.markdown("##### 🏆 Top 6 Số Tối Ưu Nhất (Giao thoa)")
            st.dataframe(
                adv["top_optimal"][["So", "Diem_Toi_Uu", "Gan_hien_tai", "Nhay_30_ngay", "Ly_do"]].rename(
                    columns={
                        "So": "Số",
                        "Diem_Toi_Uu": "Điểm tối ưu",
                        "Gan_hien_tai": "Gan (ngày)",
                        "Nhay_30_ngay": "30 ngày",
                        "Ly_do": "Cơ sở",
                    }
                ),
                use_container_width=True,
                hide_index=True,
            )
        with r2:
            st.markdown("##### 🔥 Top 6 Số Theo Đà (Momentum)")
            st.dataframe(
                adv["top_momentum"][["So", "Nhay_30_ngay", "Gan_hien_tai", "Diem_TS"]].rename(
                    columns={
                        "So": "Số",
                        "Nhay_30_ngay": "Nháy 30d",
                        "Gan_hien_tai": "Gan (ngày)",
                        "Diem_TS": "Khớp vùng",
                    }
                ),
                use_container_width=True,
                hide_index=True,
            )
        with r3:
            st.markdown("##### ⏳ Top 6 Số Bắt Gan Đỉnh (GRA)")
            st.dataframe(
                adv["top_gan"][["So", "Diem_chu_y", "Gan_hien_tai", "Max_gan", "Chenh_ky_vong"]].rename(
                    columns={
                        "So": "Số",
                        "Diem_chu_y": "Điểm GRA",
                        "Gan_hien_tai": "Gan",
                        "Max_gan": "Max gan",
                        "Chenh_ky_vong": "Chênh KV",
                    }
                ),
                use_container_width=True,
                hide_index=True,
            )

tab1, tab2, tab3, tab4 = st.tabs(
    [
        "📈 Dự báo Các Ngày Tiếp Theo",
        "🧪 Kiểm thử & Đối chiếu Dự báo",
        "🔥 Thống kê Tần suất & Loto Gan (00–99)",
        "🗂️ Dữ liệu Lịch sử 27 Giải",
    ]
)

# ---------------- TAB 1: FORECAST ----------------
with tab1:
    with st.spinner("Đang huấn luyện mô hình và tính toán dự báo..."):
        fc_df, meta = run_forecast(df, target_col=target_col, horizon=horizon, model_choice=model_choice)
        save_forecast_snapshot(fc_df, target_col=target_col, model_choice=model_choice, based_on_date=based_on_date)

    st.subheader(f"Dự báo {horizon} ngày tới: {TARGET_CONFIG[target_col]['label']}")
    st.caption(
        f"Mô hình sử dụng: **{meta['model_desc']}** | "
        f"Dữ liệu huấn luyện: **{meta['train_days']} ngày** (đến `{meta['last_date']}`) | "
        f"Trung bình lịch sử: **{meta['hist_mean']}** (±{meta['hist_std']})"
    )

    hist_plot = df.sort_values("date").tail(history_view)

    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=hist_plot["date"],
            y=hist_plot[target_col],
            mode="lines+markers",
            name="Thực tế lịch sử",
            line=dict(color="#1f77b4", width=2),
            marker=dict(size=5),
        )
    )
    fig.add_trace(
        go.Scatter(
            x=pd.concat([fc_df["date"], fc_df["date"][::-1]]),
            y=pd.concat([fc_df["upper_80"], fc_df["lower_80"][::-1]]),
            fill="toself",
            fillcolor="rgba(255, 127, 14, 0.18)",
            line=dict(color="rgba(255,255,255,0)"),
            hoverinfo="skip",
            showlegend=True,
            name="Khoảng tin cậy 80%",
        )
    )
    fig.add_trace(
        go.Scatter(
            x=fc_df["date"],
            y=fc_df["forecast_raw"],
            mode="lines+markers",
            name="Dự báo kỳ vọng",
            line=dict(color="#ff7f0e", width=3, dash="dash"),
            marker=dict(size=7, symbol="diamond"),
        )
    )
    fig.update_layout(
        height=460,
        hovermode="x unified",
        xaxis_title="Ngày",
        yaxis_title=TARGET_CONFIG[target_col]["label"],
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        margin=dict(l=20, r=20, t=40, b=20),
    )
    st.plotly_chart(fig, use_container_width=True)

    st.markdown("#### Bảng số liệu dự kiến chi tiết theo từng ngày")
    display_fc = fc_df[
        [
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
    ].rename(
        columns={
            "date_vn": "Ngày",
            "weekday_vn": "Thứ",
            "forecast": "Dự báo (Làm tròn)",
            "forecast_raw": "Giá trị kỳ vọng",
            "lower_80": "Cận dưới (80%)",
            "upper_80": "Cận trên (80%)",
            "arima": "ARIMA",
            "holt_winters": "Holt-Winters",
            "theta": "Theta",
            "grey_gm11": "Grey GM(1,1)",
            "rl_fgm": "RL-FGM",
            "fourier_ridge": "Fourier Ridge",
        }
    )
    st.dataframe(display_fc, use_container_width=True, hide_index=True)

    csv_bytes = display_fc.to_csv(index=False).encode("utf-8-sig")
    st.download_button(
        "⬇️ Tải bảng dự báo (.csv)",
        data=csv_bytes,
        file_name=f"xsmb_forecast_{target_col}_{horizon}d.csv",
        mime="text/csv",
    )

# ---------------- TAB 2: BACKTEST & SNAPSHOT EVALUATION ----------------
with tab2:
    st.subheader("Kiểm thử độ chính xác trên dữ liệu quá khứ (Holdout Backtest)")
    test_days = st.slider("Số ngày gần nhất dùng để kiểm thử", min_value=7, max_value=45, value=14, step=1)

    with st.spinner("Đang chạy Backtest trên tập kiểm thử..."):
        cmp_df, metrics_df = run_backtest(df, target_col=target_col, test_days=test_days)

    c1, c2 = st.columns([1, 2])
    with c1:
        st.markdown("##### Bảng sai số các mô hình")
        st.dataframe(metrics_df, use_container_width=True, hide_index=True)
        st.caption("MAE: Sai số tuyệt đối trung bình | RMSE: Căn bậc hai sai số bình phương trung bình (càng nhỏ càng tốt).")

    with c2:
        fig_bt = go.Figure()
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Thuc_te"], mode="lines+markers", name="Thực tế", line=dict(color="#111827", width=2.5)))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["ARIMA"], mode="lines", name="ARIMA", line=dict(dash="dot")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Holt_Winters"], mode="lines", name="Holt-Winters", line=dict(dash="dash")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Theta"], mode="lines", name="Theta", line=dict(dash="dashdot")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Grey_GM11"], mode="lines", name="Grey GM(1,1)", line=dict(dash="dot")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["RL_FGM"], mode="lines", name="RL-FGM", line=dict(dash="dashdot")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Fourier_Ridge"], mode="lines", name="Fourier Ridge", line=dict(dash="dash")))
        fig_bt.add_trace(go.Scatter(x=cmp_df["date"], y=cmp_df["Ensemble"], mode="lines+markers", name="Ensemble", line=dict(color="#ff7f0e", width=2.5)))
        fig_bt.update_layout(
            height=380,
            hovermode="x unified",
            title=f"So sánh Thực tế vs Dự báo ({test_days} ngày gần nhất)",
            margin=dict(l=20, r=20, t=40, b=20),
        )
        st.plotly_chart(fig_bt, use_container_width=True)

    st.divider()
    st.subheader("📌 Đối chiếu các bản Dự báo đã lưu khi có kết quả ngày mới")
    eval_df = evaluate_recent_forecasts(df, target_col=target_col, model_choice=model_choice)
    if eval_df.empty:
        st.caption("Chưa có dữ liệu đối chiếu (hệ thống sẽ tự động đối chiếu khi có kết quả của các ngày tiếp theo).")
    else:
        st.dataframe(
            eval_df[["based_on_date", "date_vn", "forecast", "Thuc_te", "Sai_so", "lower_80", "upper_80", "Trong_khoang_80"]].rename(
                columns={
                    "based_on_date": "Dự báo từ ngày",
                    "date_vn": "Cho ngày",
                    "forecast": "Dự báo",
                    "Thuc_te": "Thực tế về",
                    "Sai_so": "Sai số tuyệt đối",
                    "lower_80": "Cận dưới 80%",
                    "upper_80": "Cận trên 80%",
                    "Trong_khoang_80": "Nằm trong CI 80%",
                }
            ),
            use_container_width=True,
            hide_index=True,
        )

# ---------------- TAB 3: LOTO 00-99 ----------------
with tab3:
    st.subheader("Phân tích Tần suất & Loto Gan (2 số cuối của 27 giải)")
    loto_window = st.slider("Cửa sổ thống kê (số kỳ gần nhất)", min_value=30, max_value=len(df), value=min(200, len(df)), step=10)
    loto_df = analyze_loto_00_99(df, window=loto_window)

    if not loto_df.empty:
        col_a, col_b, col_c = st.columns(3)
        with col_a:
            st.markdown("##### 🔥 Top 10 số về nhiều nhất")
            top_hot = loto_df.sort_values(["So_nhay", "So_ngay_ve"], ascending=False).head(10)
            st.dataframe(top_hot[["So", "So_nhay", "Nhay_30_ngay", "Ve_G_DB"]], use_container_width=True, hide_index=True)

        with col_b:
            st.markdown("##### ⏳ Top 10 Loto Gan (chưa về lâu nhất)")
            top_gan = loto_df.sort_values("Gan_hien_tai", ascending=False).head(10)
            st.dataframe(top_gan[["So", "Gan_hien_tai", "Max_gan", "So_nhay"]], use_container_width=True, hide_index=True)

        with col_c:
            st.markdown("##### 🎯 Top 10 Điểm chú ý thống kê")
            st.caption("Kết hợp số ngày gan & mức hụt so với kỳ vọng lý thuyết 27%/ngày.")
            top_score = loto_df.sort_values("Diem_chu_y", ascending=False).head(10)
            st.dataframe(top_score[["So", "Diem_chu_y", "Gan_hien_tai", "Chenh_ky_vong"]], use_container_width=True, hide_index=True)

        st.markdown("##### 🗺️ Bản đồ nhiệt (Heatmap) Số ngày Gan hiện tại (00–99)")
        grid_gan = loto_df["Gan_hien_tai"].to_numpy().reshape(10, 10)
        grid_text = [[f"{r}{c}<br>({grid_gan[r, c]}d)" for c in range(10)] for r in range(10)]
        fig_hm = go.Figure(
            data=go.Heatmap(
                z=grid_gan,
                x=[f"Đuôi {i}" for i in range(10)],
                y=[f"Đầu {i}" for i in range(10)],
                text=grid_text,
                texttemplate="%{text}",
                colorscale="YlOrRd",
                hovertemplate="Đầu %{y} - Đuôi %{x}<br>Gan: %{z} ngày<extra></extra>",
            )
        )
        fig_hm.update_layout(height=480, yaxis=dict(autorange="reversed"), margin=dict(l=20, r=20, t=20, b=20))
        st.plotly_chart(fig_hm, use_container_width=True)

# ---------------- TAB 4: RAW DATA ----------------
with tab4:
    st.subheader("Dữ liệu Lịch sử XSMB (27 giải)")
    search_date = st.text_input("Lọc theo ngày (ví dụ: 18/11/2026 hoặc 11/2026)", "")
    view_df = df.sort_values("date", ascending=False).copy()
    if search_date.strip():
        view_df = view_df[view_df["date_vn"].str.contains(search_date.strip(), na=False)]

    st.dataframe(
        view_df[["date_vn", "weekday", "gdb", "de_str", "tong_de", "loto_mean", "even_count", "high_count", "loto_27"]],
        use_container_width=True,
        hide_index=True,
    )
    raw_csv = view_df.to_csv(index=False).encode("utf-8-sig")
    st.download_button(
        "⬇️ Tải toàn bộ dữ liệu lịch sử (.csv)",
        data=raw_csv,
        file_name="xsmb_history.csv",
        mime="text/csv",
    )
