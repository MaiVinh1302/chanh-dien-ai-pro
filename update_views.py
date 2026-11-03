import re

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. REPLACE TOP NAV
top_nav_old_pattern = r'<div class="top-nav">[\s\S]*?</div>\s*</div>\s*(?=<!-- SỚ CẦU AN)'
top_nav_new = '''<div class="top-nav">
        <div class="glass-pill">
            <span class="live-pulse"></span>
            <span>CHÁNH ĐIỆN TAM CHÚC • <span id="capacity-txt">0/30</span> Tọa vị</span>
        </div>

        <!-- BỘ CHUYỂN 3 GÓC NHÌN TOÀN CẢNH CHÂN THẬT TỪ ẢNH -->
        <div class="view-switcher-group">
            <button class="view-switch-btn active" id="btn-view-main" onclick="switchTempleView('main')" title="Ảnh 1: Đại Điện Tam Thế Phật">
                🏛️ Hướng Phật
            </button>
            <button class="view-switch-btn" id="btn-view-outward" onclick="switchTempleView('outward')" title="Ảnh 2: Hướng Tiền Cửa Tam Quan & Non Nước">
                🏞️ Cửa Tam Quan
            </button>
            <button class="view-switch-btn" id="btn-view-side" onclick="switchTempleView('side')" title="Ảnh 3: Cánh Tả Chuông Trống & Sân Vườn">
                🔔 Cánh Tả
            </button>
        </div>

        <div class="glass-pill" style="gap: 8px;">
            <span>🔥 <span id="incense-count">736</span> &nbsp;•&nbsp; 
            ✨ <span id="merit-count">26.589</span> CĐ &nbsp;•&nbsp; 
            🪷 <span id="wf-count">2.344</span></span>
            
            <!-- BẬT TẮT THIỀN ÂM -->
            <button class="zen-audio-btn" id="zen-audio-btn" onclick="toggleZenMusic()" title="Bật/Tắt Thiền Âm Chuông Mõ Tĩnh Tâm">
                🔊 Thiền Âm
            </button>

            <!-- BỘ PHÓNG TO THU NHỎ GÓC NHÌN CẢ PHÒNG -->
            <div class="zoom-controls">
                <button class="zoom-btn" onclick="zoomChange(-0.15)" title="Thu nhỏ cả phòng (−)">−</button>
                <span class="zoom-val" id="zoom-txt" onclick="zoomReset()" title="Bấm để trở về 100%">100%</span>
                <button class="zoom-btn" onclick="zoomChange(0.15)" title="Phóng to cả phòng (+)">+</button>
            </div>

            <button onclick="toggleOrientation()" id="orient-top-btn" style="background: rgba(59,130,246,0.25); border: 1px solid #3b82f6; color: #93c5fd; border-radius: 14px; padding: 4px 10px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s;" title="Chuyển đổi Ngang (16:9) / Dọc (9:16)">
                🔄 <span id="orient-txt">Ngang (16:9)</span>
            </button>
            <button onclick="openShareModal()" style="background: rgba(16,185,129,0.25); border: 1px solid #10b981; color: #34d399; border-radius: 14px; padding: 4px 10px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s;" onmouseover="this.style.background='rgba(16,185,129,0.45)'" onmouseout="this.style.background='rgba(16,185,129,0.25)'">
                🔗 Mời Vào
            </button>
            <button onclick="openControlModal()" style="background: rgba(212,175,55,0.22); border: 1px solid #ffd700; color: #ffd700; border-radius: 14px; padding: 4px 10px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.4)'" onmouseout="this.style.background='rgba(212,175,55,0.22)'">
                ⚙️ Setting
            </button>
        </div>
    </div>
    '''

text = re.sub(top_nav_old_pattern, top_nav_new, text, count=1)
print("1. Top Nav replaced")

# 2. REPLACE CAMERA BOX HEADER WITH MINIMIZE BUTTON
cam_box_old = '<div class="cam-title">🎥 XOAY GÓC NHÌN 3D</div>'
cam_box_new = '<div class="cam-title">🎥 XOAY GÓC NHÌN 3D <button class="panel-toggle-btn" onclick="toggleCamBox(event)" title="Thu gọn/Mở rộng">−</button></div>'
text = text.replace(cam_box_old, cam_box_new)
print("2. Cam box updated")

# 3. REPLACE LEADERBOARD HEADER WITH MINIMIZE BUTTON
lb_old = '<h3>✦ TẤM LÒNG THÀNH ✦</h3>'
lb_new = '<h3>✦ TẤM LÒNG THÀNH ✦ <button class="panel-toggle-btn" onclick="toggleLbPanel(event)" title="Thu gọn/Mở rộng">−</button></h3>'
text = text.replace(lb_old, lb_new)
print("3. Leaderboard updated")

# 4. REPLACE BOTTOM DOCK
dock_old_pattern = r'<div class="bottom-dock">[\s\S]*?</div>\s*(?=<!-- CỬA SỔ MODAL CONTROL)'
dock_new = '''<div class="bottom-dock">
        <!-- 3 NÚT CHUYỂN GÓC NHÌN -->
        <div class="dock-btn" onclick="switchTempleView('main')" title="Ảnh 1: Hướng nhìn Tam Thế Phật">
            <span class="dock-icon">🏛️</span>
            <span>Hướng Phật</span>
        </div>
        <div class="dock-btn" onclick="switchTempleView('outward')" title="Ảnh 2: Hướng nhìn Cửa Tam Quan & Non Nước">
            <span class="dock-icon">🏞️</span>
            <span>Tam Quan</span>
        </div>
        <div class="dock-btn" onclick="switchTempleView('side')" title="Ảnh 3: Cánh Tả Chuông Trống & Sân Vườn">
            <span class="dock-icon">🔔</span>
            <span>Cánh Tả</span>
        </div>

        <!-- VÁCH NGĂN PHÂN CHIA TINH TẾ -->
        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.16); margin: 0 2px;"></div>

        <!-- CÁC PHÁP KHÍ CHÙA (TRỐNG BÁT NHÃ, ĐẠI HỒNG CHUNG, MÕ, QUẺ, DÂNG LỄ) -->
        <div class="dock-btn" onclick="triggerDharmaDrum()" title="Gióng Trống Bát Nhã (Cánh Tả)">
            <span class="dock-icon">🥁</span>
            <span>Trống</span>
        </div>
        <div class="dock-btn" onclick="triggerBell()" title="Thỉnh Chuông Đại Hồng Chung (Cánh Hữu)">
            <span class="dock-icon">🔔</span>
            <span>Chuông</span>
        </div>
        <div class="dock-btn" onclick="triggerMoc()" title="Gõ Mõ tụng kinh">
            <span class="dock-icon">🪷</span>
            <span>Gõ Mõ</span>
        </div>
        <div class="dock-btn" onclick="triggerFortune()" title="Xin Quẻ AI cầu an">
            <span class="dock-icon">🎋</span>
            <span>Xin Quẻ</span>
        </div>
        <div class="dock-btn" onclick="triggerGift()" title="Dâng Lễ Cúng Dường">
            <span class="dock-icon">🌸</span>
            <span>Dâng Lễ</span>
        </div>

        <!-- VÁCH NGĂN PHÂN CHIA TINH TẾ -->
        <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.16); margin: 0 2px;"></div>

        <div class="dock-btn" onclick="openShareModal()" title="Mời Phật tử / Quét QR vào Chánh Điện">
            <span class="dock-icon">👥</span>
            <span>Đạo Hữu</span>
        </div>
        <div class="dock-btn setting-btn" onclick="openControlModal()" title="Mở Bảng Điều Khiển & Cài Đặt">
            <span class="dock-icon">⚙️</span>
            <span>Cài Đặt</span>
        </div>
    </div>
    '''
text = re.sub(dock_old_pattern, dock_new, text, count=1)
print("4. Bottom dock replaced")

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("HTML successfully saved")
