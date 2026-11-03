# -*- coding: utf-8 -*-
"""
Script to upgrade static/world3d.html with:
1. Authentic Vietnamese Pagoda Interior Architecture (matching the 4 uploaded reference photos)
2. 3 Golden Tam Thế Phật statues with soaring Bodhi Leaf Mandorlas (Lá Đề Quang Minh)
3. "TAM ĐỨC TÍNH LINH" center plaque & "ĐẠI HÙNG BẢO ĐIỆN", "MINH TÂM KIẾN TÍNH" plaques
4. Gilded couplets (Câu Đối) on timber columns & hanging 5-color Buddhist banners
5. Twin bronze cranes on turtles (Đôi Hạc cưỡi rùa) & triple altar table
6. Inner Đại Hồng Chung and Trống Bát Nhã
7. Straw mats, red carpet, and 48 meditation cushions
8. Congregation of meditating monks in saffron robes & lay devotees in grey áo lam
9. Multi-perspective interior camera views (Chiêm Bái Phật, Hướng Ra Sân, Toàn Cảnh Nghiêng, Tự Do)
"""

import sys

with open(r'D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro\static\world3d.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS for .interior-dock
old_css = """.interior-dock {
            position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 25;
            display: none; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
            background: rgba(22, 14, 8, 0.90); backdrop-filter: blur(16px);
            border: 1.5px solid #d4af37; border-radius: 36px; padding: 8px 18px;
            box-shadow: 0 8px 36px rgba(255, 215, 0, 0.45); max-width: 95vw;
        }
        .interior-dock.active { display: flex; }"""

new_css = """.interior-dock {
            position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 25;
            display: none; flex-direction: column; align-items: center; gap: 8px;
            background: rgba(18, 11, 6, 0.93); backdrop-filter: blur(18px);
            border: 1.5px solid #d4af37; border-radius: 28px; padding: 10px 18px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.35);
            max-width: 96vw;
        }
        .interior-dock.active { display: flex; }
        .interior-row {
            display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
        }
        .view-btn {
            background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.5);
            color: #fef08a; padding: 6px 14px; border-radius: 18px; font-size: 13px; font-weight: 600;
            cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 5px;
        }
        .view-btn:hover {
            background: rgba(212, 175, 55, 0.35); transform: translateY(-2px);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }
        .view-btn.active {
            background: linear-gradient(135deg, #d97706, #b45309);
            border-color: #ffd700; color: #fff;
            box-shadow: 0 0 16px rgba(255, 215, 0, 0.7);
        }"""

assert old_css in content, "old_css not found in content"
content = content.replace(old_css, new_css, 1)

# 2. Update HTML markup for #interior-dock
old_html = """    <!-- BẢNG ĐIỀU KHIỂN NGHI THỨC CÚNG BÁI TRONG CHÁNH ĐIỆN 3D -->
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
    </div>"""

new_html = """    <!-- BẢNG ĐIỀU KHIỂN CHÁNH ĐIỆN 3D NGUY NGA & NGHI THỨC CÚNG BÁI -->
    <div class="interior-dock" id="interior-dock">
        <!-- Hàng 1: Hệ thống Góc Nhìn Không Gian & Đạo Tràng Tọa Thiền -->
        <div class="interior-row">
            <span style="color:#d4af37; font-size:12px; font-weight:bold; margin-right:2px;">GÓC NHÌN:</span>
            <button class="view-btn active" id="view-btn-altar" onclick="setInteriorView('altar')">👁️ Chiêm Bái Phật</button>
            <button class="view-btn" id="view-btn-outward" onclick="setInteriorView('outward')">🚪 Hướng Ra Sân</button>
            <button class="view-btn" id="view-btn-side" onclick="setInteriorView('side')">📐 Toàn Cảnh Nghiêng</button>
            <button class="view-btn" id="view-btn-free" onclick="setInteriorView('free')">🚶 Tự Do Dạo Điện</button>
            <button class="view-btn" id="btn-toggle-congregation" onclick="toggleCongregation()" style="background: rgba(59, 130, 246, 0.25); border-color:#60a5fa;">👥 Đạo Tràng: BẬT</button>
        </div>
        <!-- Hàng 2: Nghi thức hành lễ tâm linh -->
        <div class="interior-row" style="margin-top: 2px;">
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
    </div>"""

assert old_html in content, "old_html not found in content"
content = content.replace(old_html, new_html, 1)

# 3. Replace buildMainSanctuary with the authentic Vietnamese Pagoda architecture
sanctuary_start_marker = "        // 7. CÔNG TRÌNH 5: 🏛️ ĐẠI ĐIỆN TAM THẾ PHẬT (CHÁNH ĐIỆN NGUY NGA 3 TẦNG MÁI)"
sanctuary_end_marker = "        // =========================================================================\n        // 8. CÔNG TRÌNH 6: 🗼 BẢO THÁP XÁ LỢI 13 TẦNG"

sanctuary_code = '''        // 7. CÔNG TRÌNH 5: 🏛️ ĐẠI ĐIỆN TAM THẾ PHẬT (CHÁNH ĐIỆN NGUY NGA 3 TẦNG MÁI)
        // DỰNG THEO CHUẨN THỰC TẾ ĐẠI TỰ BÁI ĐÍNH / TAM CHÚC TỪ CÁC BỨC ẢNH
        // =========================================================================

        // Tạo Texture Hoành Phi thếp vàng sơn mài
        function createHoanhPhiTexture(titleText, subText, bgHex, borderHex, textHex) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 160;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = bgHex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = borderHex;
            ctx.lineWidth = 10;
            ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
            ctx.lineWidth = 3;
            ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

            ctx.fillStyle = textHex;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 50px "Times New Roman", "Noto Serif", serif';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(titleText, canvas.width / 2, canvas.height / 2 - (subText ? 12 : 0));

            if (subText) {
                ctx.font = 'italic 20px "Segoe UI", sans-serif';
                ctx.fillStyle = '#fef08a';
                ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 38);
            }

            return new THREE.CanvasTexture(canvas);
        }

        // Tạo Texture Câu Đối chữ Hán/Quốc ngữ dọc thân cột gỗ lim
        function createCauDoiTexture(chars, bgHex, borderHex, textHex) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 640;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = bgHex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = borderHex;
            ctx.lineWidth = 6;
            ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

            ctx.fillStyle = textHex;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 36px "Times New Roman", "Noto Serif", serif';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;

            const charList = chars.split('');
            const step = (canvas.height - 50) / charList.length;
            charList.forEach((ch, idx) => {
                ctx.fillText(ch, canvas.width / 2, 40 + idx * step);
            });

            return new THREE.CanvasTexture(canvas);
        }

        // Tạo Texture Dải Cờ Ngũ Sắc Phật Giáo (Xanh, Vàng, Đỏ, Trắng, Cam)
        function createBuddhistFlagTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            const cols = ['#1d4ed8', '#facc15', '#dc2626', '#ffffff', '#ea580c'];
            const w = canvas.width / cols.length;
            cols.forEach((col, i) => {
                ctx.fillStyle = col;
                ctx.fillRect(i * w, 0, w, canvas.height);
            });
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            return new THREE.CanvasTexture(canvas);
        }

        // Tạo Texture Lá Đề Quang Minh Thếp Vàng chạm trổ
        function createBodhiMandorlaTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 768;
            const ctx = canvas.getContext('2d');

            const grad = ctx.createRadialGradient(256, 460, 40, 256, 460, 360);
            grad.addColorStop(0, '#fffbeb');
            grad.addColorStop(0.3, '#fde047');
            grad.addColorStop(0.7, '#ca8a04');
            grad.addColorStop(1, '#854d0e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Vòng hào quang rạng rỡ
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 3;
            for (let r = 50; r < 360; r += 32) {
                ctx.beginPath();
                ctx.arc(256, 460, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
                ctx.beginPath();
                ctx.moveTo(256, 460);
                ctx.lineTo(256 + Math.cos(a) * 360, 460 + Math.sin(a) * 360);
                ctx.stroke();
            }
            return new THREE.CanvasTexture(canvas);
        }

        // Tạo Tượng Hạc Đồng Ngự Lưng Rùa (Đôi Hạc chầu Án Thờ Chánh Điện)
        function createCraneOnTurtle(x, z) {
            const group = new THREE.Group();
            group.position.set(x, 2.5, z);

            // Rùa đá/đồng đội hạc
            const turtleShell = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.35, 12), bronzeMat);
            turtleShell.position.y = 0.2;
            turtleShell.scale.set(1.2, 1, 0.9);
            group.add(turtleShell);

            const turtleHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), bronzeMat);
            turtleHead.position.set(0, 0.25, 0.9);
            group.add(turtleHead);

            // Đôi chân hạc mảnh khảnh thanh cao
            [-0.2, 0.2].forEach(lx => {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), bronzeMat);
                leg.position.set(lx, 1.1, 0);
                group.add(leg);
            });

            // Mình hạc
            const craneBody = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), bronzeMat);
            craneBody.position.set(0, 2.1, 0);
            craneBody.scale.set(0.7, 1.2, 0.8);
            group.add(craneBody);

            // Cổ hạc cong vươn cao
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.3, 8), bronzeMat);
            neck.position.set(0, 3.1, 0.15);
            neck.rotation.x = 0.15;
            group.add(neck);

            // Đầu và mỏ hạc ngậm hoa sen
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), bronzeMat);
            head.position.set(0, 3.8, 0.25);
            group.add(head);

            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.5, 6), bronzeMat);
            beak.position.set(0, 3.75, 0.5);
            beak.rotation.x = Math.PI / 2;
            group.add(beak);

            const lotusFlower = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), lotusMat);
            lotusFlower.position.set(0, 3.65, 0.7);
            group.add(lotusFlower);

            return group;
        }

        // Tạo hình nhân vật Phật tử / Chư Tăng tọa thiền tĩnh tọa
        function createMeditatingFigure(x, z, isMonk) {
            const fig = new THREE.Group();
            fig.position.set(x, 2.8, z);

            const robeColor = isMonk ? 0xf59e0b : 0x64748b; // Áo Cà Sa vàng hoặc Áo Lam
            const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.8 });
            const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });

            // Thân ngồi kiết già
            const body = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.85, 8), robeMat);
            body.position.y = 0.42;
            fig.add(body);

            // Đầu Chibi hiền hòa
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
            head.position.y = 0.95;
            fig.add(head);

            // Chắp tay hiệp chưởng trước ngực
            const hands = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.14), skinMat);
            hands.position.set(0, 0.48, 0.32);
            fig.add(hands);

            return fig;
        }

        function buildMainSanctuary() {
            const hall = new THREE.Group();
            hall.position.set(0, 0, -35);

            // Nền bệ đá đồ sộ (Rộng 64m, Sâu 54m)
            const foundation = new THREE.Mesh(new THREE.BoxGeometry(64, 2.8, 54), stoneMat);
            foundation.position.y = 1.4;
            foundation.receiveShadow = true;
            hall.add(foundation);

            // Bậc thang đá rồng chầu phía trước
            const steps = new THREE.Mesh(new THREE.BoxGeometry(26, 1.8, 10), stoneMat);
            steps.position.set(0, 0.9, 31);
            steps.receiveShadow = true;
            hall.add(steps);

            // Vách Chánh Điện bằng gỗ lim sơn cánh gián cổ kính
            const backWall = new THREE.Mesh(new THREE.BoxGeometry(60, 16, 1.5), woodLimMat);
            backWall.position.set(0, 9.5, -24.5); backWall.castShadow = true; hall.add(backWall);

            const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 16, 50), woodLimMat);
            leftWall.position.set(-29.5, 9.5, 0); leftWall.castShadow = true; hall.add(leftWall);

            const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 16, 50), woodLimMat);
            rightWall.position.set(29.5, 9.5, 0); rightWall.castShadow = true; hall.add(rightWall);

            // Cửa mặt tiền hai bên (Để ngỏ 3 gian cửa lớn thông thoáng đón sáng như ảnh thực tế)
            const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 1.5), woodLimMat);
            frontWallL.position.set(-20.5, 9.5, 24.5); frontWallL.castShadow = true; hall.add(frontWallL);

            const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 1.5), woodLimMat);
            frontWallR.position.set(20.5, 9.5, 24.5); frontWallR.castShadow = true; hall.add(frontWallR);

            // Sàn gạch nung Bát Tràng bóng sáng trong điện
            const innerFloor = new THREE.Mesh(new THREE.BoxGeometry(58, 0.4, 48), new THREE.MeshStandardMaterial({
                color: 0x5a2d18, roughness: 0.45, metalness: 0.1
            }));
            innerFloor.position.set(0, 2.5, 0); innerFloor.receiveShadow = true; hall.add(innerFloor);

            // Thảm đỏ lối đi chính giữa Chánh Điện (Central Red Carpet Runner)
            const carpet = new THREE.Mesh(new THREE.BoxGeometry(7, 0.42, 42), new THREE.MeshStandardMaterial({
                color: 0x991b1b, roughness: 0.8
            }));
            carpet.position.set(0, 2.55, 3);
            hall.add(carpet);

            // Ánh sáng vàng nến ấm cúng tỏa rạng toàn điện
            const innerLight1 = new THREE.PointLight(0xffea9f, 3.2, 60);
            innerLight1.position.set(0, 11, -10);
            innerLight1.castShadow = true;
            hall.add(innerLight1);

            const innerLight2 = new THREE.PointLight(0xffd277, 2.5, 50);
            innerLight2.position.set(0, 11, 10);
            hall.add(innerLight2);

            // =========================================================================
            // HỆ THỐNG RƯỜNG CỘT GỖ LIM ĐỒ SỘ (4 HÀNG CỘT CÁI & CỘT QUÂN CHUẨN ĐẠI TỰ)
            // =========================================================================
            const colXList = [-20, -7.5, 7.5, 20];
            const colZList = [-18, -10, -2, 6, 14, 22];

            colXList.forEach(cx => {
                colZList.forEach(cz => {
                    // Chân tảng đá hoa sen
                    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 0.6, 16), stoneMat);
                    plinth.position.set(cx, 2.8, cz);
                    hall.add(plinth);

                    // Thân cột gỗ lim nguyên khối
                    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.82, 14, 18), woodLimMat);
                    col.position.set(cx, 9.8, cz);
                    col.castShadow = true;
                    hall.add(col);
                });
            });

            // Xà ngang, xà dọc, quá giang kết nối trên trần gỗ
            colXList.forEach(cx => {
                const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 44), woodLimMat);
                beamZ.position.set(cx, 15.5, 2);
                hall.add(beamZ);
            });
            colZList.forEach(cz => {
                const beamX = new THREE.Mesh(new THREE.BoxGeometry(42, 0.9, 0.9), woodLimMat);
                beamX.position.set(0, 15.5, cz);
                hall.add(beamX);
            });

            // =========================================================================
            // HOÀNH PHI & CÂU ĐỐI THẾP VÀNG TRONG ĐIỆN (CHUẨN THEO ẢNH 1, 2, 4)
            // =========================================================================
            // 1. Hoành Phi "TAM ĐỨC TÍNH LINH" ngay trước Tam Thế Phật (Ảnh 1)
            const hpTamDucTex = createHoanhPhiTexture("TAM ĐỨC TÍNH LINH", "三 德 性 靈", "#991b1b", "#f59e0b", "#fef08a");
            const hpTamDucMat = new THREE.MeshBasicMaterial({ map: hpTamDucTex });
            const hpTamDuc = new THREE.Mesh(new THREE.PlaneGeometry(8, 2.5), hpTamDucMat);
            hpTamDuc.position.set(0, 14.2, -14.5);
            hall.add(hpTamDuc);

            // 2. Hoành Phi "ĐẠI HÙNG BẢO ĐIỆN" phía trên lối vào
            const hpDaiHungTex = createHoanhPhiTexture("ĐẠI HÙNG BẢO ĐIỆN", "大 雄 寶 殿", "#18181b", "#f59e0b", "#fef08a");
            const hpDaiHung = new THREE.Mesh(new THREE.PlaneGeometry(8, 2.5), new THREE.MeshBasicMaterial({ map: hpDaiHungTex }));
            hpDaiHung.position.set(0, 14.5, 18);
            hall.add(hpDaiHung);

            // 3. Các bức Hoành Phi Tả Hữu hai bên gian điện ("TỪ BI HỶ XẢ", "MINH TÂM KIẾN TÍNH", v.v.)
            const sidePlaques = [
                { text: "TỪ BI HỶ XẢ", x: -14, z: -10, rotY: Math.PI / 2 },
                { text: "MINH TÂM KIẾN TÍNH", x: 14, z: -10, rotY: -Math.PI / 2 },
                { text: "VẠN ĐỨC TRANG NGHIÊM", x: -14, z: 6, rotY: Math.PI / 2 },
                { text: "QUANG CHIẾU THẬP PHƯƠNG", x: 14, z: 6, rotY: -Math.PI / 2 }
            ];
            sidePlaques.forEach(p => {
                const tex = createHoanhPhiTexture(p.text, "", "#7f1d1d", "#f59e0b", "#fef08a");
                const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.8), new THREE.MeshBasicMaterial({ map: tex }));
                m.position.set(p.x, 13.5, p.z);
                m.rotation.y = p.rotY;
                hall.add(m);
            });

            // 4. Bốn Liễn Câu Đối Thếp Vàng dọc theo 4 thân cột cái trung tâm (Ảnh 1, 2, 4, 5)
            const cauDoiTexts = [
                "TịnhĐộNhânGianHoằngChánhPháp",
                "ChânNhưPhápGiớiĐộQuầnMê",
                "BồĐềDiệuĐạoKhaiTríHuệ",
                "TừBiHỷXảCứuQuầnSanh"
            ];
            const cauDoiCols = [
                { x: -7.5, z: -1.2 }, { x: 7.5, z: -1.2 },
                { x: -7.5, z: 6.8 }, { x: 7.5, z: 6.8 }
            ];
            cauDoiTexts.forEach((txt, i) => {
                const cdTex = createCauDoiTexture(txt, "#581c87", "#eab308", "#fef08a");
                const cdMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 7.5), new THREE.MeshBasicMaterial({ map: cdTex }));
                cdMesh.position.set(cauDoiCols[i].x, 8.8, cauDoiCols[i].z);
                hall.add(cdMesh);
            });

            // 5. Các Dải Cờ Phật Giáo Ngũ Sắc buông rủ từ các xà ngang
            const flagTex = createBuddhistFlagTexture();
            const flagMat = new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide });
            [-7.5, 7.5].forEach(fx => {
                [-6, 2, 10].forEach(fz => {
                    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.5), flagMat);
                    flag.position.set(fx, 12.8, fz);
                    hall.add(flag);
                });
            });

            // =========================================================================
            // 3 PHO ĐẠI TƯỢNG TAM THẾ PHẬT DÁT VÀNG & LÁ ĐỀ QUANG MINH KHỔNG LỒ (ẢNH 1 & 5)
            // =========================================================================
            const mandorlaTex = createBodhiMandorlaTexture();
            const mandorlaMat = new THREE.MeshStandardMaterial({
                map: mandorlaTex,
                color: 0xffd700,
                emissive: 0xd97706,
                emissiveIntensity: 0.45,
                roughness: 0.3,
                metalness: 0.7,
                side: THREE.DoubleSide
            });

            // Shape chiếc Lá Bồ Đề vuốt nhọn lên cao vút
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(2.4, 1.2, 3.4, 3.8, 2.2, 6.2);
            leafShape.bezierCurveTo(1.4, 7.8, 0.4, 8.8, 0, 10.2);
            leafShape.bezierCurveTo(-0.4, 8.8, -1.4, 7.8, -2.2, 6.2);
            leafShape.bezierCurveTo(-3.4, 3.8, -2.4, 1.2, 0, 0);
            const mandorlaGeo = new THREE.ShapeGeometry(leafShape);

            const buddhaPositions = [
                { x: -11, name: "A Di Đà Phật" },
                { x: 0, name: "Thích Ca Mâu Ni Phật" },
                { x: 11, name: "Dược Sư Lưu Ly Phật" }
            ];

            buddhaPositions.forEach((bPos) => {
                const bGroup = new THREE.Group();
                bGroup.position.set(bPos.x, 3.8, -18.5);

                // Tòa sen 3 tầng bệ đá chạm khắc cánh sen vàng
                const stoneBase1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.7, 16), stoneMat);
                stoneBase1.position.y = 0.35;
                bGroup.add(stoneBase1);

                const stoneBase2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 0.7, 16), stoneMat);
                stoneBase2.position.y = 1.05;
                bGroup.add(stoneBase2);

                const lotusDais = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.6, 1.0, 16), goldMat);
                lotusDais.position.y = 1.85;
                bGroup.add(lotusDais);

                // Thân tượng Phật ngồi kiết già trang nghiêm
                const body = new THREE.Mesh(new THREE.ConeGeometry(2.4, 4.2, 12), goldMat);
                body.position.y = 4.2;
                bGroup.add(body);

                // Đầu Phật với nhục kế Ushnisha
                const head = new THREE.Mesh(new THREE.SphereGeometry(1.15, 16, 16), goldMat);
                head.position.y = 6.8;
                bGroup.add(head);

                const ushnisha = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), goldMat);
                ushnisha.position.y = 8.0;
                bGroup.add(ushnisha);

                // Vầng Hào Quang Lá Bồ Đề (Mandorla) cao vút 10m phía sau
                const mandorlaMesh = new THREE.Mesh(mandorlaGeo, mandorlaMat);
                mandorlaMesh.position.set(0, 1.8, -0.6);
                bGroup.add(mandorlaMesh);

                hall.add(bGroup);
            });

            // =========================================================================
            // ÁN GIAN THỜ NGUY NGA, ĐÔI HẠC ĐỒNG CƯỠI RÙA & LỄ PHẨM (ẢNH 1, 3, 5)
            // =========================================================================
            // Bàn thờ chính phủ gấm đỏ thắm
            const mainAltar = new THREE.Mesh(new THREE.BoxGeometry(14, 2.6, 4.2), new THREE.MeshStandardMaterial({
                color: 0x991b1b, roughness: 0.6
            }));
            mainAltar.position.set(0, 3.8, -9);
            hall.add(mainAltar);

            // Hai bàn hương án phụ phủ lụa vàng
            [-8.5, 8.5].forEach(sx => {
                const subAltar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.4, 3.8), new THREE.MeshStandardMaterial({
                    color: 0xeab308, roughness: 0.5
                }));
                subAltar.position.set(sx, 3.7, -9);
                hall.add(subAltar);
            });

            // Đôi Hạc Đồng Cưỡi Lưng Rùa hai bên Án Thờ
            hall.add(createCraneOnTurtle(-5.2, -6.8));
            hall.add(createCraneOnTurtle(5.2, -6.8));

            // Đỉnh Lư Hương Đồng Đốt Trầm trên bàn thờ chính
            const censer = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.65, 1.4, 16), bronzeMat);
            censer.position.set(0, 5.7, -9);
            hall.add(censer);

            // Nhang trầm phát sáng
            for (let i = -1; i <= 1; i++) {
                const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
                stick.position.set(i * 0.15, 6.7, -9);
                hall.add(stick);
                const ember = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
                ember.position.set(i * 0.15, 7.15, -9);
                hall.add(ember);
            }

            // Đôi lộc bình hoa sen hai bên
            [-4.0, 4.0].forEach(vx => {
                const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
                vase.position.set(vx, 5.8, -9);
                hall.add(vase);

                for (let k = 0; k < 4; k++) {
                    const lFlower = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), lotusMat);
                    lFlower.position.set(vx + (k - 1.5) * 0.25, 6.8 + (k % 2) * 0.2, -9);
                    hall.add(lFlower);
                }
            });

            // =========================================================================
            // CHUÔNG ĐẠI HỒNG CHUNG & TRỐNG BÁT NHÃ TRONG CHÁNH ĐIỆN (ẢNH 2, 4, 5)
            // =========================================================================
            // Trống Bát Nhã bên Tả (Trái: x = -19, z = 4)
            const drumStand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.2, 2.4), woodLimMat);
            drumStand.position.set(-19, 4.6, 4);
            hall.add(drumStand);

            const innerDrum = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.4, 16), new THREE.MeshStandardMaterial({
                color: 0x991b1b, roughness: 0.5
            }));
            innerDrum.position.set(-19, 5.2, 4);
            innerDrum.rotation.z = Math.PI / 2;
            hall.add(innerDrum);

            // Chuông U Minh bên Hữu (Phải: x = 19, z = 4)
            const bellStand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 5.5, 2.4), woodLimMat);
            bellStand.position.set(19, 5.2, 4);
            hall.add(bellStand);

            const innerBell = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 2.8, 16), bronzeMat);
            innerBell.position.set(19, 4.8, 4);
            hall.add(innerBell);

            // =========================================================================
            // CHIẾU CÓI & HÀNG BỒ ĐOÀN ĐỆM NGỒI TỌA THIỀN (ẢNH 2 & 5)
            // =========================================================================
            // Chiếu cói trải dài hai bên lối đi
            const matMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
            const matLeft = new THREE.Mesh(new THREE.BoxGeometry(10, 0.42, 26), matMat);
            matLeft.position.set(-9.5, 2.58, 6);
            hall.add(matLeft);

            const matRight = new THREE.Mesh(new THREE.BoxGeometry(10, 0.42, 26), matMat);
            matRight.position.set(9.5, 2.58, 6);
            hall.add(matRight);

            // Các hàng bồ đoàn đệm nhung nâu sẫm (Mỗi bên 4 hàng dọc x 6 hàng ngang)
            const cushionMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
            for (let r = 0; r < 6; r++) {
                for (let c = 0; c < 3; c++) {
                    // Bên Tả
                    const cL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 1.4), cushionMat);
                    cL.position.set(-6.2 - c * 2.8, 2.85, -4 + r * 3.6);
                    hall.add(cL);

                    // Bên Hữu
                    const cR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 1.4), cushionMat);
                    cR.position.set(6.2 + c * 2.8, 2.85, -4 + r * 3.6);
                    hall.add(cR);
                }
            }

            // =========================================================================
            // ĐẠO TRÀNG CHƯ TĂNG & PHẬT TỬ TỌA THIỀN (BẬT / TẮT THEO Ý MUỐN)
            // =========================================================================
            const congregationGroup = new THREE.Group();
            congregationGroup.name = "congregationGroup";

            // 2 hàng đầu: Chư Tăng mặc áo Cà Sa vàng
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 3; c++) {
                    congregationGroup.add(createMeditatingFigure(-6.2 - c * 2.8, -4 + r * 3.6, true));
                    congregationGroup.add(createMeditatingFigure(6.2 + c * 2.8, -4 + r * 3.6, true));
                }
            }
            // 4 hàng sau: Phật tử áo lam hiền hòa
            for (let r = 2; r < 6; r++) {
                for (let c = 0; c < 3; c++) {
                    congregationGroup.add(createMeditatingFigure(-6.2 - c * 2.8, -4 + r * 3.6, false));
                    congregationGroup.add(createMeditatingFigure(6.2 + c * 2.8, -4 + r * 3.6, false));
                }
            }
            hall.add(congregationGroup);

            // 3 Tầng Mái ngói cong vút trùng diêm
            const roofTier1 = new THREE.Mesh(new THREE.ConeGeometry(46, 6.5, 4), roofTileMat);
            roofTier1.position.y = 19;
            roofTier1.rotation.y = Math.PI / 4;
            roofTier1.scale.set(1.25, 1, 0.85);
            roofTier1.castShadow = true;
            hall.add(roofTier1);

            const roofTier2 = new THREE.Mesh(new THREE.ConeGeometry(34, 5.5, 4), roofTileMat);
            roofTier2.position.y = 24.5;
            roofTier2.rotation.y = Math.PI / 4;
            roofTier2.scale.set(1.25, 1, 0.85);
            roofTier2.castShadow = true;
            hall.add(roofTier2);

            const roofTier3 = new THREE.Mesh(new THREE.ConeGeometry(22, 5.0, 4), roofTileMat);
            roofTier3.position.y = 29.5;
            roofTier3.rotation.y = Math.PI / 4;
            roofTier3.scale.set(1.25, 1, 0.85);
            roofTier3.castShadow = true;
            hall.add(roofTier3);

            scene.add(hall);
        }
        buildMainSanctuary();\n'''

start_pos = content.find(sanctuary_start_marker)
end_pos = content.find(sanctuary_end_marker)
assert start_pos != -1, "sanctuary_start_marker not found"
assert end_pos != -1, "sanctuary_end_marker not found"

content = content[:start_pos] + sanctuary_code + content[end_pos:]

# 4. Update enterMainHallInterior and camera views
old_interior_funcs = """        function enterMainHallInterior() {
            isInsideMainHall = true;
            document.getElementById("interior-dock").classList.add("active");
            document.querySelector(".bottom-dock").style.display = "none";

            // Di chuyển nhân vật đứng chính diện trong Chánh Điện trước án hương (z = -26)
            player.position.set(0, 2.6, -26);
            player.rotation.y = Math.PI; // Quay mặt chiêm bái Tam Thế Phật
            targetPos = null;

            // Camera lùi nhẹ sau lưng nhân vật nhìn thẳng vào Tam Thế Phật và Án Hương
            cameraMode = 'interior_ceremony';
            camera.position.set(0, 5.2, -17);
            orbitControls.target.set(0, 6.0, -38);

            showBubble("🏛️ Đã bước vào Chánh Điện Tam Thế • Thân tâm an tịnh");
            playWoodenFishSound();
        }"""

new_interior_funcs = """        let currentInteriorView = 'altar';
        let showCongregation = true;

        function setInteriorView(viewName) {
            currentInteriorView = viewName;
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.getElementById('view-btn-' + viewName);
            if (targetBtn) targetBtn.classList.add('active');

            if (viewName === 'altar') {
                // Góc 1: Chiêm bái Tam Thế Phật & Án Hương chính diện (Ảnh 1 & 5)
                cameraMode = 'interior_preset';
                player.position.set(0, 2.6, -26);
                player.rotation.y = Math.PI;
                camera.position.set(0, 5.5, -16);
                orbitControls.target.set(0, 6.8, -48);
                showBubble("🙏 Chiêm bái Tam Thế Phật • Trang nghiêm thanh tịnh");
            } else if (viewName === 'outward') {
                // Góc 2: Hướng từ hương án nhìn ra sân chùa & non nước (Ảnh 3)
                cameraMode = 'interior_preset';
                player.position.set(0, 2.6, -30);
                player.rotation.y = 0;
                camera.position.set(0, 6.5, -36);
                orbitControls.target.set(0, 4.0, 25);
                showBubble("🚪 Hướng ra Sân Tiền Điện • Non nước tĩnh lặng");
            } else if (viewName === 'side') {
                // Góc 3: Toàn cảnh nghiêng hàng cột, cờ ngũ sắc & chuông trống (Ảnh 4)
                cameraMode = 'interior_preset';
                player.position.set(-6, 2.6, -24);
                player.rotation.y = Math.PI * 0.85;
                camera.position.set(-19, 6.8, -12);
                orbitControls.target.set(8, 7.0, -32);
                showBubble("📐 Toàn cảnh rường cột, cờ ngũ sắc & chuông trống Chánh Điện");
            } else if (viewName === 'free') {
                // Góc 4: Tự do điều khiển nhân vật đi lại trong điện
                cameraMode = 'third_person';
                showBubble("🚶 Tự do dạo bước trong điện bằng WASD hoặc Joystick");
            }
        }

        function toggleCongregation() {
            showCongregation = !showCongregation;
            const cGroup = scene.getObjectByName('congregationGroup');
            if (cGroup) cGroup.visible = showCongregation;
            const btn = document.getElementById('btn-toggle-congregation');
            if (btn) btn.innerHTML = showCongregation ? '👥 Đạo Tràng: BẬT' : '👥 Đạo Tràng: TẮT';
            showBubble(showCongregation ? '🙏 Đạo tràng Chư Tăng & Phật tử đồng thanh niệm Phật' : '🕊️ Không gian Chánh Điện tĩnh lặng thanh vắng');
        }

        function enterMainHallInterior() {
            isInsideMainHall = true;
            document.getElementById("interior-dock").classList.add("active");
            document.querySelector(".bottom-dock").style.display = "none";
            targetPos = null;

            setInteriorView('altar');
            playWoodenFishSound();
        }"""

assert old_interior_funcs in content, "old_interior_funcs not found in content"
content = content.replace(old_interior_funcs, new_interior_funcs, 1)

with open(r'D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro\static\world3d.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: static/world3d.html successfully upgraded!")
