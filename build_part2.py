import re

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. REPLACE createChibiModel WITH DETAILED CUTE CHIBI MONK 3D MODEL
old_chibi_pattern = r'function createChibiModel\(\)\s*\{[\s\S]*?return model;\s*\}'
new_chibi_code = '''function createChibiModel(robeColor = 0x8faec5) {
            const model = new THREE.Group();

            // 1. THÂN ÁO TU TRUYỀN THỐNG (Áo Tràng Phật Giáo thụng rộng)
            const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.65 });
            const robeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.95, 2.3, 16), robeMat);
            robeBody.position.y = 1.6;
            robeBody.castShadow = true;
            robeBody.name = "robeBody";
            model.add(robeBody);

            // Vạt áo Cà Sa vàng nghệ vắt chéo qua vai trái
            const kasayaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55 });
            const sash = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.18, 8, 20), kasayaMat);
            sash.rotation.x = Math.PI / 2.7;
            sash.rotation.y = 0.25;
            sash.position.set(-0.08, 1.95, 0.05);
            sash.castShadow = true;
            model.add(sash);

            // Khuy cài Cà Sa bằng vàng trên vai
            const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16), goldMat);
            buckle.position.set(-0.48, 2.45, 0.42);
            model.add(buckle);

            // 2. CHUỖI TRÀNG HẠT BỒ ĐỀ (108 HẠT GỖ ĐEO CỔ)
            const beadMat = new THREE.MeshStandardMaterial({ color: 0x542618, roughness: 0.6 });
            for (let b = 0; b < 16; b++) {
                const angle = (b / 16) * Math.PI * 2;
                const bead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), beadMat);
                bead.position.set(Math.sin(angle) * 0.62, 2.3 + Math.cos(angle) * 0.48, 0.48);
                model.add(bead);
            }

            // 3. ĐẦU CHIBI TRÒN TRĨNH ĐÁNG YÊU (CUTE CHIBI HEAD)
            const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.45 });
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), skinMat);
            head.position.y = 3.35;
            head.castShadow = true;
            model.add(head);

            // Hai má hồng phúng phính (Blushing pink cheeks)
            const blushMat = new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.8 });
            const leftBlush = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), blushMat);
            leftBlush.position.set(-0.44, 3.18, 0.68);
            model.add(leftBlush);
            const rightBlush = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), blushMat);
            rightBlush.position.set(0.44, 3.18, 0.68);
            model.add(rightBlush);

            // Cặp mắt to tròn hiền từ lấp lánh (Cute expressive anime eyes)
            const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const eyeBlackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 });

            [-0.26, 0.26].forEach((ex) => {
                // Tròng đen
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), eyeBlackMat);
                eye.scale.set(1, 1.25, 0.4);
                eye.position.set(ex, 3.35, 0.80);
                model.add(eye);

                // Đốm sáng long lanh trong mắt
                const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeWhiteMat);
                pupil.position.set(ex - 0.04, 3.42, 0.85);
                model.add(pupil);
            });

            // Nụ cười từ bi mỉm cười hoan hỷ
            const mouthMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
            const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.025, 6, 12, Math.PI), mouthMat);
            mouth.rotation.x = Math.PI;
            mouth.position.set(0, 3.08, 0.82);
            model.add(mouth);

            // Hai tai tròn nhỏ hai bên
            [-0.82, 0.82].forEach((tx) => {
                const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), skinMat);
                ear.position.set(tx, 3.35, 0);
                model.add(ear);
            });

            // 4. HAI TAY ÁO THỤNG VÀ BÀN TAY CHẮP BÁI (ANJALI MUDRA)
            const sleeveLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 1.1, 10), robeMat);
            sleeveLeft.rotation.z = Math.PI / 4;
            sleeveLeft.position.set(-0.75, 2.1, 0.25);
            sleeveLeft.name = "sleeveLeft";
            model.add(sleeveLeft);

            const sleeveRight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 1.1, 10), robeMat);
            sleeveRight.rotation.z = -Math.PI / 4;
            sleeveRight.position.set(0.75, 2.1, 0.25);
            sleeveRight.name = "sleeveRight";
            model.add(sleeveRight);

            // Hai bàn tay chắp trước ngực
            const hands = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.28), skinMat);
            hands.position.set(0, 2.1, 0.82);
            hands.name = "hands";
            model.add(hands);

            // 5. HAI BÀN CHÂN & HÀI TRẮNG
            const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.68), shoeMat);
            leftShoe.position.set(-0.35, 0.15, 0.1);
            leftShoe.name = "leftFoot";
            model.add(leftShoe);

            const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.68), shoeMat);
            rightShoe.position.set(0.35, 0.15, 0.1);
            rightShoe.name = "rightFoot";
            model.add(rightShoe);

            // Vầng hào quang khi tọa thiền
            const aura = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.4, 32), new THREE.MeshBasicMaterial({
                color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0
            }));
            aura.position.set(0, 3.4, -0.2);
            aura.name = "aura";
            model.add(aura);

            return model;
        }'''

text = re.sub(old_chibi_pattern, new_chibi_code, text, count=1)
print("1. Replaced createChibiModel with detailed 3D Chibi Monk")

# 2. ADD INTERIOR LOGIC, CEREMONIES, AUDIO & TRANSITION
interior_js = '''
        // =========================================================================
        // HỆ THỐNG NGHI THỨC TRONG CHÁNH ĐIỆN 3D (CÚNG BÁI, GÕ MÕ, XIN QUẺ, DÂNG HƯƠNG)
        // =========================================================================
        let isInsideMainHall = false;
        let isMeditating = false;

        function enterMainHallInterior() {
            isInsideMainHall = true;
            document.getElementById("interior-dock").classList.add("active");
            document.querySelector(".bottom-dock").style.display = "none";

            // Di chuyển nhân vật đứng giữa Chánh Điện trước án hương
            player.position.set(0, 2.6, 9.5);
            player.rotation.y = Math.PI; // Quay mặt về phía Tam Thế Phật
            targetPos = null;

            // Camera góc nhìn cận cảnh trang nghiêm
            cameraMode = 'interior_ceremony';
            camera.position.set(0, 5.8, 17.5);
            orbitControls.target.set(0, 6.2, -4);

            showBubble("🏛️ Đã bước vào Chánh Điện Tam Thế • Thân tâm an tịnh");
            playWoodenFishSound();
        }

        function exitToCourtyard() {
            isInsideMainHall = false;
            isMeditating = false;
            document.getElementById("interior-dock").classList.remove("active");
            document.querySelector(".bottom-dock").style.display = "flex";

            // Bước ra ngoài sân chùa
            player.position.set(0, 0, 25);
            player.rotation.y = 0;
            cameraMode = 'third_person';

            camera.position.set(0, 8, 42);
            orbitControls.target.set(0, 3, 25);

            showBubble("🌿 Đã bước ra Sân Đại Triều • Dạo bước ngắm cảnh chùa");
            playWoodenBellSound();
        }

        // 1. NGHI THỨC GÕ MÕ TỤNG KINH
        function triggerMocCeremony() {
            playWoodenFishSound();
            showBubble("🪷 Cốc... Cốc... Cốc... Tiếng Mõ thanh tịnh khai tâm");
            // Rung nhẹ hai tay áo
            const sL = playerMesh.getObjectByName("sleeveLeft");
            const sR = playerMesh.getObjectByName("sleeveRight");
            if (sL && sR) {
                sL.rotation.z += 0.25; sR.rotation.z -= 0.25;
                setTimeout(() => { sL.rotation.z -= 0.25; sR.rotation.z += 0.25; }, 180);
            }
        }

        function playWoodenFishSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now); osc.stop(now + 0.09);
            } catch(e) {}
        }

        // 2. NGHI THỨC DÂNG HƯƠNG CẦU AN
        function triggerIncenseCeremony() {
            showBubble("🔥 Thành kính thắp một nén tâm hương dâng Phật Tam Thế");
            playWoodenFishSound();
            triggerPrayAction();
        }

        // 3. NGHI THỨC XIN QUẺ AI
        function triggerFortuneCeremony() {
            playBambooShakeSound();
            showBubble("🎋 Đang lắc ống xăm cầu quẻ linh thiêng...");

            setTimeout(() => {
                const modal = document.getElementById("fortune-modal");
                if (modal) modal.style.display = "flex";
                playTempleBellSound();
            }, 1200);
        }

        function closeFortuneModal() {
            const modal = document.getElementById("fortune-modal");
            if (modal) modal.style.display = "none";
        }

        function playBambooShakeSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = "triangle";
                        osc.frequency.setValueAtTime(320 + Math.random() * 120, ctx.currentTime);
                        gain.gain.setValueAtTime(0.2, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
                        osc.connect(gain); gain.connect(ctx.destination);
                        osc.start(); osc.stop(ctx.currentTime + 0.07);
                    }, i * 140);
                }
            } catch(e) {}
        }

        function playTempleBellSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const now = ctx.currentTime;
                [264, 528, 880].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.25 / (idx + 1), now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 2.5);
                });
            } catch(e) {}
        }

        // 4. DÂNG HOA SEN CÚNG DƯỜNG
        function triggerLotusGift() {
            showBubble("🌸 Thành kính dâng đóa sen vàng cúng dường Tam Bảo • +20 Công Đức");
            triggerRingBell();
        }

        // 5. AN TỌA TRÊN BỒ ĐOÀN THIỀN ĐỊNH
        function toggleMeditation() {
            isMeditating = !isMeditating;
            const aura = playerMesh.getObjectByName("aura");
            if (isMeditating) {
                showBubble("🧘 Chú tiểu an tọa kiết già trên bồ đoàn • Nhập định thanh tịnh");
                player.position.set(-3.2, 2.7, 9); // Ngồi lên bồ đoàn
                if (aura) aura.material.opacity = 0.85;
            } else {
                showBubble("🚶 Xả thiền • Thân tâm thơ thái nhẹ nhàng");
                player.position.y = 2.6;
                if (aura) aura.material.opacity = 0;
            }
        }
'''

# Chèn interior_js trước animate()
text = text.replace('function animate() {', interior_js + '\n        function animate() {')
print("2. Added Interior Ceremonies JS")

# 3. CẬP NHẬT teleportTo ĐỂ VÀO ĐIỆN TỰ ĐỘNG
old_teleport = "if (locKey === 'main_hall') {"
# Kiểm tra nếu người dùng chọn 'main_hall' thì tự động gọi enterMainHallInterior
text = text.replace("if (locKey === 'main_hall') {", "if (locKey === 'main_hall') { enterMainHallInterior(); return; } else if (false) {")
# Hoặc thay đổi hàm teleportTo
teleport_old = "function teleportTo(locKey) {"
teleport_new = '''function teleportTo(locKey) {
            if (locKey === 'main_hall') {
                enterMainHallInterior();
                return;
            } else if (isInsideMainHall) {
                exitToCourtyard();
            }'''
text = text.replace(teleport_old, teleport_new, 1)
print("3. Updated teleportTo for seamless Main Hall interior")

# 4. CẬP NHẬT animate ĐỂ TỰ ĐỘNG VÀO ĐIỆN KHI BƯỚC VÀO CỬA (z < -8)
dist_check_old = "orbitControls.update();"
dist_check_new = '''// Tự động chuyển vào Chánh Điện khi bước vào bậc thềm cửa
            if (!isInsideMainHall && player.position.z < -6 && Math.abs(player.position.x) < 22) {
                enterMainHallInterior();
            }

            orbitControls.update();'''
text = text.replace(dist_check_old, dist_check_new, 1)
print("4. Added auto-entry check on temple doorstep")

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("All Part 2 updates written successfully!")
