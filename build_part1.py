import re

# Read current world3d.html
with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD CSS FOR INTERIOR CEREMONY DOCK, FORTUNE MODAL & ROBE CHOOSER
css_additions = """
        /* MODAL BẢNG QUẺ AI THẦN DIỆU TRONG ĐIỆN 3D */
        .fortune-modal-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100;
            background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(10px);
            display: none; align-items: center; justify-content: center;
        }
        .fortune-scroll-box {
            background: linear-gradient(135deg, #2a1608, #180d04);
            border: 2px solid #d4af37; border-radius: 20px; width: 90%; max-width: 440px;
            padding: 24px; text-align: center; color: #fef08a;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.35); position: relative;
            animation: popIn 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.15);
        }
        @keyframes popIn { 0%{transform:scale(0.8);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        .fortune-title { font-size: 20px; font-weight: bold; color: #ffd700; margin-bottom: 12px; }
        .fortune-poem {
            background: rgba(0, 0, 0, 0.45); border: 1px dashed rgba(212, 175, 55, 0.6);
            border-radius: 12px; padding: 14px; font-style: italic; font-size: 14px;
            line-height: 1.8; color: #fff7ed; margin-bottom: 14px;
        }
        .fortune-meaning { font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-bottom: 16px; }
        .fortune-close-btn {
            background: linear-gradient(135deg, #d4af37, #9a7212); border: none;
            color: #1a0f00; font-weight: bold; padding: 10px 24px; border-radius: 20px;
            cursor: pointer; font-size: 13px; transition: 0.2s;
        }
        .fortune-close-btn:hover { transform: scale(1.05); filter: brightness(1.15); }

        /* BẢNG ĐIỀU KHIỂN NGHI THỨC TRONG ĐIỆN (INTERIOR CEREMONY DOCK) */
        .interior-dock {
            position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 25;
            display: none; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
            background: rgba(22, 14, 8, 0.90); backdrop-filter: blur(16px);
            border: 1.5px solid #d4af37; border-radius: 36px; padding: 8px 18px;
            box-shadow: 0 8px 36px rgba(255, 215, 0, 0.45); max-width: 95vw;
        }
        .interior-dock.active { display: flex; }
        .ceremony-btn {
            background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(212, 175, 55, 0.4);
            color: #fef08a; border-radius: 18px; padding: 7px 13px; font-size: 12px; font-weight: bold;
            cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s;
        }
        .ceremony-btn:hover { background: rgba(212, 175, 55, 0.35); color: #fff; transform: translateY(-2px); }
        .exit-btn {
            background: linear-gradient(135deg, #10b981, #059669); border-color: #34d399; color: #fff;
        }

        /* NÚT ĐỔI PHÁP PHỤC CHIBI (LAM, NÂU, VÀNG) */
        .robe-switcher {
            display: flex; gap: 4px; background: rgba(0,0,0,0.5); padding: 3px; border-radius: 16px;
        }
        .robe-dot {
            width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 1.5px solid #fff;
            transition: 0.2s;
        }
        .robe-dot:hover { transform: scale(1.2); }
"""

# Insert CSS
html = html.replace('</style>', css_additions + '\n    </style>')

# 2. ADD MODAL AND CEREMONY DOCK HTML
dock_and_modal_html = """
    <!-- CỬA SỔ XIN QUẺ AI TRONG ĐIỆN 3D -->
    <div class="fortune-modal-overlay" id="fortune-modal" onclick="if(event.target.id==='fortune-modal') closeFortuneModal()">
        <div class="fortune-scroll-box">
            <div class="fortune-title">📜 THÁNH LINH THIÊN XĂM 📜</div>
            <div style="font-size: 12px; color: #ffd700; margin-bottom: 8px;" id="fortune-tier">Quẻ Số 36 • Thượng Thượng Cát</div>
            <div class="fortune-poem" id="fortune-poem">
                "Sen vàng nở rộ chốn thiền môn,<br>
                Tâm tịnh lòng trong phước dạt dồn.<br>
                Cầu tài được tài, danh toại ý,<br>
                Bình an gia đạo vạn niềm vui."
            </div>
            <div class="fortune-meaning" id="fortune-meaning">
                <b>Lời Luận Giải:</b> Vận thế hanh thông, được chư Phật gia hộ. Mọi việc mưu cầu về công danh sự nghiệp đều thuận buồm xuôi gió. Gia đạo sum vầy, thân tâm an lạc.
            </div>
            <button class="fortune-close-btn" onclick="closeFortuneModal()">Tạ Ơn Phật Bà • Đóng Quẻ 🙏</button>
        </div>
    </div>

    <!-- BẢNG ĐIỀU KHIỂN NGHI THỨC CÚNG BÁI TRONG CHÁNH ĐIỆN 3D -->
    <div class="interior-dock" id="interior-dock">
        <button class="ceremony-btn" onclick="triggerMocCeremony()">🪷 Gõ Mõ</button>
        <button class="ceremony-btn" onclick="triggerRingBell()">🔔 Thỉnh Chuông</button>
        <button class="ceremony-btn" onclick="triggerHitDrum()">🥁 Gióng Trống</button>
        <button class="ceremony-btn" onclick="triggerIncenseCeremony()">🔥 Dâng Hương</button>
        <button class="ceremony-btn" onclick="triggerFortuneCeremony()">🎋 Xin Quẻ AI</button>
        <button class="ceremony-btn" onclick="triggerLotusGift()">🌸 Dâng Hoa Sen</button>
        <button class="ceremony-btn" onclick="toggleMeditation()">🧘 An Tọa</button>
        <button class="ceremony-btn" onclick="triggerPrayAction()">🙏 Bái Phật</button>
        <button class="ceremony-btn exit-btn" onclick="exitToCourtyard()">🚪 Ra Sân Chùa ↗</button>
    </div>
"""

# Insert before </body>
html = html.replace('<!-- THREE.JS CHÙA 3D ENGINE -->', dock_and_modal_html + '\n    <!-- THREE.JS CHÙA 3D ENGINE -->')

# Save updated HTML
with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Part 1: CSS and Modal HTML added successfully")
