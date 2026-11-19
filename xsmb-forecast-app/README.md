# Ứng dụng Nghiên cứu & Dự báo Chuỗi Thời Gian XSMB

Ứng dụng web (Python + Streamlit) thu thập dữ liệu kết quả xổ số Miền Bắc (XSMB) trực tiếp từ `xosodaiphat.com`, phân tích thống kê và thử nghiệm các mô hình dự báo chuỗi thời gian cổ điển.

## 1. Cấu trúc dự án

- `app.py`: Giao diện web Streamlit (4 tab: Dự báo, Backtest, Thống kê Tần suất & Loto Gan 00–99, Dữ liệu lịch sử).
- `src/scraper.py`: Module cào và chuẩn hóa 27 giải XSMB (hỗ trợ tối đa 200 kỳ gần nhất mỗi lần quét, lưu cache tại `data/xsmb_history.csv`).
- `src/forecaster.py`: Các mô hình dự báo cổ điển (`SARIMA / ARIMA`, `Holt-Winters Exponential Smoothing`, `Theta Seasonal`, `Ensemble`) + Walk-forward Backtest + Phân tích Loto 00–99.
- `requirements.txt`: Danh sách thư viện Python.

## 2. Cách chạy ứng dụng

```powershell
cd C:\Users\vinhmv\.gemini\antigravity\scratch\xsmb-forecast-app
.\.venv\Scripts\streamlit.exe run app.py
```

## 3. Lưu ý khoa học

Kết quả quay số XSMB là các biến cố ngẫu nhiên độc lập. Các mô hình chuỗi thời gian trong ứng dụng chỉ phục vụ mục đích nghiên cứu thống kê lịch sử, kiểm thử sai số (MAE, RMSE) và trực quan hóa dữ liệu tham khảo.
