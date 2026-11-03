with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update buildMainSanctuary
old_walls = """            // Thân Chánh Điện (Gian thờ rộng lớn)
            const walls = new THREE.Mesh(new THREE.BoxGeometry(54, 12, 34), woodLimMat);
            walls.position.y = 8.5;
            walls.castShadow = true;
            hall.add(walls);"""

new_walls = """            // Vách Chánh Điện thông thoáng mở cửa (Back, Left, Right & Front Open Doorway)
            const backWall = new THREE.Mesh(new THREE.BoxGeometry(54, 14, 1.5), woodLimMat);
            backWall.position.set(0, 8.5, -16.5); backWall.castShadow = true; hall.add(backWall);

            const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 14, 34), woodLimMat);
            leftWall.position.set(-26.5, 8.5, 0); leftWall.castShadow = true; hall.add(leftWall);

            const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 14, 34), woodLimMat);
            rightWall.position.set(26.5, 8.5, 0); rightWall.castShadow = true; hall.add(rightWall);

            // Cửa mặt tiền hai bên (Để ngỏ lối đi chính điện ở giữa)
            const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 1.5), woodLimMat);
            frontWallL.position.set(-18.5, 8.5, 16.5); frontWallL.castShadow = true; hall.add(frontWallL);

            const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(16, 14, 1.5), woodLimMat);
            frontWallR.position.set(18.5, 8.5, 16.5); frontWallR.castShadow = true; hall.add(frontWallR);

            // Sàn gỗ bóng & Chiếu cói đỏ trong điện
            const innerFloor = new THREE.Mesh(new THREE.BoxGeometry(52, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0x3d1a0a, roughness: 0.5 }));
            innerFloor.position.set(0, 2.5, 0); innerFloor.receiveShadow = true; hall.add(innerFloor);

            // Ánh sáng vàng nến ấm cúng tỏa sáng tượng Phật
            const innerLight = new THREE.PointLight(0xffea9f, 2.8, 55);
            innerLight.position.set(0, 10, -2);
            innerLight.castShadow = true;
            hall.add(innerLight);"""

assert old_walls in text
text = text.replace(old_walls, new_walls)
print("1. Replaced solid box walls with open interior sanctuary architecture")

# 2. Update enterMainHallInterior coordinates
old_interior_fn = """        function enterMainHallInterior() {
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
        }"""

new_interior_fn = """        function enterMainHallInterior() {
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

assert old_interior_fn in text
text = text.replace(old_interior_fn, new_interior_fn)
print("2. Updated interior coordinates")

with open('D:/AI_FACTORY/AI_DAO_TAO/chanh-dien-ai-pro/static/world3d.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved world3d.html successfully!")
