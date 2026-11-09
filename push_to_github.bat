@echo off
chcp 65001 >nul
title TT GROUP - DONG BO CODE LEN GITHUB & GITHUB PAGES
color 0B
cd /d "D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro"

echo ==============================================================================
echo       TT GROUP - DONG BO HE SINH THAI PDF & CHUAN HOA GITHUB PAGES
echo ==============================================================================
echo.
echo [1/3] Kho luu tru GitHub: https://github.com/MaiVinh1302/chanh-dien-ai-pro
echo [2/3] Danh sach cong cu da tich hop san sang:
echo       - TT GROUP PDF Ultra Engine V4.0 Pro (pdf_merger.html)
echo       - Foxit Web PDF Editor Pro (pdf_editor.html)
echo       - Portal Index Hub (index.html)
echo       - GitHub Actions Automated Deployment (.github/workflows/deploy-pages.yml)
echo.
echo [3/3] Dang tien hanh day du lieu len nhanh main...
echo       (Neu la lan dau, trinh duyet se bat cua so dang nhap GitHub trong 3 giay)
echo.

git push -f -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================================
    echo [THANH CONG] Toan bo du an da duoc day len GitHub thanh cong!
    echo ==============================================================================
    echo.
    echo  Link GitHub Repository:
    echo  https://github.com/MaiVinh1302/chanh-dien-ai-pro
    echo.
    echo  Link GitHub Pages (Truy cap toan cau 24/7 sau khi bat Pages):
    echo  https://maivinh1302.github.io/chanh-dien-ai-pro/
    echo  https://maivinh1302.github.io/chanh-dien-ai-pro/pdf_merger.html
    echo  https://maivinh1302.github.io/chanh-dien-ai-pro/pdf_editor.html
    echo.
) else (
    echo.
    echo ==============================================================================
    echo [THONG BAO] Yeu cau xac thuc tai khoan GitHub!
    echo ==============================================================================
    echo Neu trinh duyet khong tu mo, vui long kiem tra lai quyen truy cap
    echo hoac dung Personal Access Token (PAT) cua GitHub.
    echo.
)

echo.
pause
