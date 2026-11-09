@echo off
chcp 65001 >nul
cd /d "D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro"
echo ===================================================================
echo 🏛️  ĐANG TỰ ĐỘNG ĐẨY TOÀN BỘ CODE LÊN GITHUB
echo    Repo: https://github.com/MaiVinh1302/chanh-dien-ai-pro
echo ===================================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================================
    echo ✅ THÀNH CÔNG! Toàn bộ code đã được đồng bộ lên GitHub của bạn!
    echo    Truy cập: https://github.com/MaiVinh1302/chanh-dien-ai-pro
    echo ===================================================================
) else (
    echo ❌ Có lỗi xảy ra trong quá trình kết nối hoặc quyền truy cập.
)
echo.
pause
