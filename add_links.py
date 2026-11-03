with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = """            <button class="view-switch-btn" id="btn-view-side" onclick="switchTempleView('side')\" title="Ảnh 3: Cánh Tả Chuông Trống & Sân Vườn">
                🔔 Cánh Tả
            </button>
        </div>"""

# Let's find btn-view-side
pos = text.find('id="btn-view-side"')
if pos != -1:
    end_btn = text.find('</button>', pos)
    end_div = text.find('</div>', end_btn)
    addon = '''
            <button class="view-switch-btn" onclick="location.href='/world3d'" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; border-color: #34d399; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);" title="Mở Rộng Không Gian: Quần Thể Chùa 3D Không Giới Hạn">
                🌐 Quần Thể 3D ↗
            </button>'''
    text = text[:end_btn+9] + addon + text[end_btn+9:]
    with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("overlay.html updated with 3D link!")

# Update join.html
with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/join.html', 'r', encoding='utf-8') as f:
    jtext = f.read()

jpos = jtext.find('Xem Chánh Điện 3D ↗')
if jpos != -1:
    jend = jtext.find('</a>', jpos)
    jaddon = '''<br><a href="/world3d" style="color: #34d399; text-decoration: none; font-weight: bold; margin-top: 8px; display: inline-block;">🕹️ Dạo Bước Khám Phá Quần Thể Chùa 3D ↗</a>'''
    jtext = jtext[:jend+4] + jaddon + jtext[jend+4:]
    with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/join.html', 'w', encoding='utf-8') as f:
        f.write(jtext)
    print("join.html updated with 3D link!")
