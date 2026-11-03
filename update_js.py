import re

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. ADD JAVASCRIPT STATE AND FUNCTIONS FOR VIEW SWITCHING, ZEN AUDIO & TOGGLES
js_additions = '''
    // =========================================================================
    // HỆ THỐNG 3 GÓC NHÌN TOÀN CẢNH CHÂN THẬT (CHÍNH ĐIỆN - CỬA TAM QUAN - CÁNH TẢ)
    // =========================================================================
    let currentView = 'main'; // 'main' | 'outward' | 'side'
    let zenAudioPlaying = false;
    let zenOsc1 = null, zenOsc2 = null, zenGain = null, zenInterval = null;
    const visualRipples = [];

    function switchTempleView(viewName) {
        currentView = viewName;
        const bg = document.getElementById("temple-bg");
        
        // Cập nhật trạng thái nút bấm
        document.querySelectorAll(".view-switch-btn").forEach(b => b.classList.remove("active"));
        const activeBtn = document.getElementById(`btn-view-${viewName}`);
        if (activeBtn) activeBtn.classList.add("active");

        if (bg) {
            bg.style.opacity = "0.2";
            setTimeout(() => {
                if (viewName === 'main') {
                    bg.style.backgroundImage = "url('/static/temple_main_altar.jpg')";
                    document.getElementById("center-prayer").innerText = "🙏 Nam Mô Bổn Sư Thích Ca Mâu Ni Phật • Đại Điện Tam Chúc";
                    resetCameraView();
                } else if (viewName === 'outward') {
                    bg.style.backgroundImage = "url('/static/temple_view_outward.jpg')";
                    document.getElementById("center-prayer").innerText = "🏞️ Hướng Tiền Tam Quan • Non Nước Chốn Thiền Môn Thanh Tịnh";
                    cameraZoom = 1.0; cameraRotateX = 0; cameraRotateY = 0; cameraPanX = 0; cameraPanY = 0;
                    updateCameraTransform();
                } else if (viewName === 'side') {
                    bg.style.backgroundImage = "url('/static/temple_view_side.jpg')";
                    document.getElementById("center-prayer").innerText = "🔔 Cánh Tả Đại Điện • Chuông Trống Bát Nhã Khai Tâm";
                    cameraZoom = 1.0; cameraRotateX = 0; cameraRotateY = 0; cameraPanX = 0; cameraPanY = 0;
                    updateCameraTransform();
                }
                buildSeatsGrid();
                bg.style.opacity = "1";
            }, 250);
        }
    }

    // THU GỌN / MỞ RỘNG BỘ XOAY 3D & BẢNG CÔNG ĐỨC
    function toggleCamBox(e) {
        if (e) e.stopPropagation();
        const box = document.querySelector(".camera-3d-box");
        if (box) box.classList.toggle("minimized");
    }

    function toggleLbPanel(e) {
        if (e) e.stopPropagation();
        const panel = document.querySelector(".side-leaderboard");
        if (panel) panel.classList.toggle("minimized");
    }

    // BẬT / TẮT THIỀN ÂM (CHUÔNG NGÂN VÀ NHẠC THIỀN NỀN TĨNH LẶNG)
    function toggleZenMusic() {
        const btn = document.getElementById("zen-audio-btn");
        if (zenAudioPlaying) {
            zenAudioPlaying = false;
            if (zenGain) zenGain.gain.exponentialRampToValueAtTime(0.0001, (new (window.AudioContext || window.webkitAudioContext)()).currentTime + 1.0);
            if (zenInterval) clearInterval(zenInterval);
            if (btn) {
                btn.classList.remove("active");
                btn.innerHTML = "🔊 Thiền Âm";
            }
        } else {
            zenAudioPlaying = true;
            playTempleBell();
            startZenDrone();
            if (btn) {
                btn.classList.add("active");
                btn.innerHTML = "🔔 Đang Ngân";
            }
        }
    }

    function startZenDrone() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            zenGain = ctx.createGain();
            zenGain.gain.setValueAtTime(0.01, now);
            zenGain.gain.linearRampToValueAtTime(0.08, now + 3);

            zenOsc1 = ctx.createOscillator();
            zenOsc1.type = "sine";
            zenOsc1.frequency.setValueAtTime(108, now); // 108Hz Sacred OM frequency

            zenOsc2 = ctx.createOscillator();
            zenOsc2.type = "sine";
            zenOsc2.frequency.setValueAtTime(216, now);

            zenOsc1.connect(zenGain);
            zenOsc2.connect(zenGain);
            zenGain.connect(ctx.destination);
            zenOsc1.start();
            zenOsc2.start();

            // Định kỳ 18 giây thỉnh 1 tiếng chuông ngân nhẹ
            zenInterval = setInterval(() => {
                if (zenAudioPlaying) playTempleBell();
            }, 18000);
        } catch(e) {}
    }

    // PHÁT ÂM TRỐNG BÁT NHÃ TRẦM HÙNG (TAIKO / DHARMA DRUM)
    function playDharmaDrum() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;

            // 1. Màng da trâu cộng hưởng sâu (140Hz -> 45Hz)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(145, now);
            osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);

            gain.gain.setValueAtTime(0.55, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.4);

            // 2. Tiếng đanh của dùi trống chạm mặt da (Attack transient)
            const snap = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snap.type = "triangle";
            snap.frequency.setValueAtTime(320, now);
            snap.frequency.exponentialRampToValueAtTime(60, now + 0.05);

            snapGain.gain.setValueAtTime(0.35, now);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            snap.connect(snapGain);
            snapGain.connect(ctx.destination);
            snap.start(now);
            snap.stop(now + 0.06);
        } catch(e) {}
    }

    function triggerDharmaDrum() {
        playDharmaDrum();
        const drumX = currentView === 'side' ? width * 0.16 : width * 0.13;
        const drumY = height * 0.67;
        visualRipples.push({
            x: drumX, y: drumY, r: 15, maxR: 90, color: '#f59e0b', alpha: 0.9, type: 'drum'
        });
        document.getElementById("center-prayer").innerText = "🥁 Gióng Trống Bát Nhã • Thức Tỉnh Mê Mờ";
    }
'''

# Chèn các hàm trên vào trước class ChibiDevotee hoặc drawAltar
text = text.replace('class ChibiDevotee {', js_additions + '\n    class ChibiDevotee {')
print("1. Added View Switching and Audio JS")

# 2. ENHANCE playTempleBell
bell_old_pattern = r'function playTempleBell\(\)\s*\{[\s\S]*?\}\s*\}'
bell_new = '''function playTempleBell() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // Hòa âm đa âm bội Chuông Đại Hồng Chung (264Hz, 440Hz, 528Hz, 880Hz, 1056Hz)
            const freqs = [264, 440, 528, 880, 1056];
            const gains = [0.38, 0.24, 0.18, 0.10, 0.06];

            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now);
                if (idx > 0) {
                    osc.frequency.linearRampToValueAtTime(freq + (idx % 2 === 0 ? 1.5 : -1.5), now + 3.2);
                }
                const dur = 2.6 + (5 - idx) * 0.35;
                gain.gain.setValueAtTime(gains[idx], now);
                gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + dur);
            });

            // Sóng âm thị giác lan tỏa từ Chuông Đại Hồng Chung
            const bellX = currentView === 'side' ? width * 0.32 : width * 0.92;
            const bellY = height * 0.66;
            visualRipples.push({
                x: bellX, y: bellY, r: 18, maxR: 115, color: '#ffd700', alpha: 0.95, type: 'bell'
            });
            document.getElementById("center-prayer").innerText = "🔔 Thỉnh Chuông Đại Hồng Chung • Tiếng Chuông Ngân Xa Vạn Dặm";
        } catch(e) {}
    }'''

text = re.sub(bell_old_pattern, bell_new, text, count=1)
print("2. Enhanced playTempleBell")

# 3. UPDATE drawAltar TO ADAPT PERFECTLY TO 3 VIEWS
altar_old_pattern = r'function drawAltar\(ctx\)\s*\{[\s\S]*?ctx\.restore\(\);\s*\}'
altar_new = '''function drawAltar(ctx) {
        flamePhase += 0.15;
        const isPortrait = currentOrientation === "portrait" || (width < height);

        let altarX = width * 0.50;
        let altarY = height * 0.638;

        if (currentView === 'outward') {
            altarX = width * 0.50;
            altarY = height * 0.865;
        } else if (currentView === 'side') {
            altarX = width * 0.84;
            altarY = height * 0.645;
        }

        // Cập nhật khói trầm hương từ chính đỉnh hương
        updateAndDrawSmoke(ctx, altarX, altarY);

        ctx.save();
        // ÁNH HÀO QUANG VÀNG ẤM ÁP LAN TỎA QUANH BÀN THỜ
        const glow = ctx.createRadialGradient(altarX, altarY - 10, 5, altarX, altarY - 10, 85);
        glow.addColorStop(0, "rgba(255, 215, 0, 0.32)");
        glow.addColorStop(0.5, "rgba(255, 180, 50, 0.12)");
        glow.addColorStop(1, "rgba(255, 180, 50, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(altarX, altarY - 10, 85, 0, Math.PI * 2);
        ctx.fill();

        // 3 CHÂN NHANG ĐỎ HỒNG ĐANG CHÁY LINH THIÊNG
        const emberAlpha = 0.75 + Math.sin(flamePhase * 1.5) * 0.25;
        ctx.fillStyle = `rgba(255, 68, 68, ${emberAlpha})`;
        ctx.shadowColor = "#ff2200";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(altarX - 3.5, altarY - 12, 1.8, 0, Math.PI * 2);
        ctx.arc(altarX, altarY - 14, 2.0, 0, Math.PI * 2);
        ctx.arc(altarX + 3.5, altarY - 12, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 2 ĐỐM LỬA NẾN LUNG LINH TRÊN ĐÔI CHÂN NẾN ĐỒNG
        if (currentView === 'main') {
            const candleAlpha = 0.80 + Math.sin(flamePhase * 2.2) * 0.20;
            ctx.fillStyle = `rgba(255, 215, 0, ${candleAlpha})`;
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 10;
            // Nến bên trái
            ctx.beginPath();
            ctx.ellipse(altarX - 42, altarY - 10, 2.2, 5.0, 0, 0, Math.PI * 2);
            ctx.fill();
            // Nến bên phải
            ctx.beginPath();
            ctx.ellipse(altarX + 42, altarY - 10, 2.2, 5.0, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (currentView === 'outward') {
            // Đôi nến lớn ở tiền cảnh
            const candleAlpha = 0.85 + Math.sin(flamePhase * 2.0) * 0.15;
            ctx.fillStyle = `rgba(255, 220, 80, ${candleAlpha})`;
            ctx.shadowColor = "#ffaa00";
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.ellipse(altarX - 70, altarY - 32, 3.5, 8.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(altarX + 70, altarY - 32, 3.5, 8.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // VẼ CÁC VÒNG SÓNG ÂM THỊ GIÁC (RIPPLES) KHI ĐÁNH TRỐNG HOẶC THỈNH CHUÔNG
        for (let i = visualRipples.length - 1; i >= 0; i--) {
            const rip = visualRipples[i];
            rip.r += 2.2;
            rip.alpha -= 0.022;
            if (rip.alpha <= 0 || rip.r >= rip.maxR) {
                visualRipples.splice(i, 1);
            } else {
                ctx.save();
                ctx.strokeStyle = rip.color;
                ctx.globalAlpha = rip.alpha;
                ctx.lineWidth = 2.2;
                ctx.shadowColor = rip.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }
    }'''

text = re.sub(altar_old_pattern, altar_new, text, count=1)
print("3. Updated drawAltar for 3 Views and Ripples")

# 4. UPDATE buildSeatsGrid TO MATCH PERSPECTIVE OF EACH VIEW
seats_old_pattern = r'function buildSeatsGrid\(\)\s*\{[\s\S]*?document\.getElementById\("capacity-txt"\)\.innerText = `\$\{devotees\.size\}/\$\{seats\.length\}`;'
seats_new = '''function buildSeatsGrid() {
        seats = [];
        const isPortrait = currentOrientation === "portrait" || (width < height);
        const vpX = width * 0.50;

        if (currentView === 'main') {
            // HƯỚNG PHẬT TAM THẾ (ẢNH 1): Chiếu cói 2 bên, lối đi trung tâm rộng mở
            const rows = isPortrait ? 4 : 4;
            const colsPerSide = isPortrait ? 2 : 3;

            for (let r = 0; r < rows; r++) {
                const rowProgress = (r + 0.5) / rows;
                // Bồ đoàn dọc theo hàng chiếu cói từ y=0.72 đến 0.94
                const y = height * (0.72 + rowProgress * 0.22);
                const scale = 0.44 + rowProgress * 0.42;

                const aisleGap = width * (isPortrait ? 0.09 : 0.08);
                const stepCol = width * (isPortrait ? 0.09 : 0.065);

                // Dãy Chiếu Cói bên Tả (bên trái án thờ)
                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX - aisleGap - (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }

                // Dãy Chiếu Cói bên Hữu (bên phải án thờ)
                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX + aisleGap + (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
            }
        } else if (currentView === 'outward') {
            // HƯỚNG TIỀN CỬA TAM QUAN (ẢNH 2)
            const rows = 3;
            const colsPerSide = 3;
            for (let r = 0; r < rows; r++) {
                const rowProgress = (r + 0.5) / rows;
                const y = height * (0.64 + rowProgress * 0.18);
                const scale = 0.40 + rowProgress * 0.35;
                const aisleGap = width * 0.085;
                const stepCol = width * 0.065;

                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX - aisleGap - (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
                for (let c = 0; c < colsPerSide; c++) {
                    const x = vpX + aisleGap + (c * stepCol);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
            }
        } else {
            // CÁNH TẢ CHUÔNG TRỐNG (ẢNH 3)
            const rows = 3;
            const cols = 5;
            for (let r = 0; r < rows; r++) {
                const rowProgress = (r + 0.5) / rows;
                const y = height * (0.68 + rowProgress * 0.22);
                const scale = 0.45 + rowProgress * 0.40;
                for (let c = 0; c < cols; c++) {
                    const x = width * 0.38 + c * (width * 0.075);
                    seats.push({ index: seats.length, x, y, scale, occupiedBy: null });
                }
            }
        }

        document.getElementById("capacity-txt").innerText = `${devotees.size}/${seats.length}`;'''

text = re.sub(seats_old_pattern, seats_new, text, count=1)
print("4. Updated buildSeatsGrid")

# 5. UPDATE CLICK LISTENER TO INTERACT WITH DRUM, BELL, ALTAR & FLOOR
click_old_pattern = r'// NHẤP CHUỘT / CHẠM VÀO SÀN ĐỂ NHÂN VẬT DI CHUYỂN[\s\S]*?spawnFloatingLotus\(clickX, clickY, 3\);\s*\}\s*\}\);'
click_new = '''// TƯƠNG TÁC NHẤP CHUỘT: ĐÁNH TRỐNG, THỈNH CHUÔNG, THẮP HƯƠNG & BƯỚC ĐI
    canvas.addEventListener("click", (e) => {
        if (panDragDist > 8) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

        // 1. NHẤP VÀO TRỐNG BÁT NHÃ TRÊN ẢNH
        const drumX = currentView === 'side' ? width * 0.16 : width * 0.13;
        const drumY = height * 0.67;
        if (Math.hypot(clickX - drumX, clickY - drumY) < 65) {
            triggerDharmaDrum();
            spawnFloatingLotus(drumX, drumY - 20, 3);
            return;
        }

        // 2. NHẤP VÀO CHUÔNG ĐẠI HỒNG CHUNG TRÊN ẢNH
        const bellX = currentView === 'side' ? width * 0.32 : width * 0.92;
        const bellY = height * 0.66;
        if (Math.hypot(clickX - bellX, clickY - bellY) < 65) {
            playTempleBell();
            spawnFloatingLotus(bellX, bellY - 20, 3);
            return;
        }

        // 3. NHẤP VÀO ÁN HƯƠNG ĐỂ DÂNG HƯƠNG CẦU AN
        const altarX = currentView === 'side' ? width * 0.84 : width * 0.50;
        const altarY = currentView === 'outward' ? height * 0.865 : height * 0.638;
        if (Math.hypot(clickX - altarX, clickY - altarY) < 55) {
            const incSpan = document.getElementById("incense-count");
            if (incSpan) incSpan.innerText = parseInt(incSpan.innerText.replace(".", "")) + 1;
            spawnFloatingLotus(altarX, altarY - 30, 4);
            document.getElementById("center-prayer").innerText = "🔥 Thành Kính Dâng Một Nén Tâm Hương Lên Đức Phật";
            playWoodenFishSound();
            return;
        }

        // 4. DI CHUYỂN TRÊN KHU VỰC SÀN ĐÁ & LỐI ĐI CHÍNH ĐIỆN
        if (clickY < height * 0.65) return;

        const activeDev = devotees.get("노고만 구름") || devotees.get("Diệu Thảo Tâm An") || Array.from(devotees.values())[0];
        if (activeDev) {
            let nearestSeat = null;
            let minDist = 9999;
            seats.forEach((s) => {
                const d = Math.hypot(s.x - clickX, s.y - clickY);
                if (d < minDist) { minDist = d; nearestSeat = s; }
            });

            if (nearestSeat && minDist < 60) {
                if (activeDev.seat) activeDev.seat.occupiedBy = null;
                activeDev.seat = nearestSeat;
                nearestSeat.occupiedBy = activeDev.name;
                activeDev.targetX = nearestSeat.x;
                activeDev.targetY = nearestSeat.y;
                activeDev.scale = nearestSeat.scale;
            } else {
                activeDev.targetX = clickX;
                activeDev.targetY = clickY;
            }
            activeDev.state = "WALKING";
            activeDev.bubbleText = "Nam Mô A Di Đà Phật 🙏";
            activeDev.bubbleTimer = 180;
            playWoodenFishSound();
            spawnFloatingLotus(clickX, clickY, 3);
        }
    });'''

text = re.sub(click_old_pattern, click_new, text, count=1)
print("5. Updated canvas click interactions")

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/overlay.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("All JS updates written to overlay.html successfully!")
