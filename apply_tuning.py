with open(r'D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro\static\world3d.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update woodLimMat to deep antique ironwood lacquer
text = text.replace(
    'const woodLimMat = new THREE.MeshStandardMaterial({ color: 0x4a2211, roughness: 0.7, metalness: 0.1 });',
    'const woodLimMat = new THREE.MeshStandardMaterial({ color: 0x30150a, roughness: 0.72, metalness: 0.08 });'
)

# 2. Update Cau Doi background to authentic black lacquer with gold calligraphy
text = text.replace(
    'createCauDoiTexture(txt, "#581c87", "#eab308", "#fef08a")',
    'createCauDoiTexture(txt, "#111111", "#f59e0b", "#fde047")'
)

# 3. Fine-tune camera in setInteriorView('altar') to see all 3 Tam Thế Phật statues
old_altar_view = """            if (viewName === 'altar') {
                // Góc 1: Chiêm bái Tam Thế Phật & Án Hương chính diện (Ảnh 1 & 5)
                cameraMode = 'interior_preset';
                player.position.set(0, 2.6, -26);
                player.rotation.y = Math.PI;
                camera.position.set(0, 5.5, -16);
                orbitControls.target.set(0, 6.8, -48);
                showBubble("🙏 Chiêm bái Tam Thế Phật • Trang nghiêm thanh tịnh");"""

new_altar_view = """            if (viewName === 'altar') {
                // Góc 1: Chiêm bái Tam Thế Phật & Án Hương chính diện (Ảnh 1 & 5)
                cameraMode = 'interior_preset';
                player.position.set(0, 2.6, -20);
                player.rotation.y = Math.PI;
                camera.position.set(0, 5.2, -12);
                orbitControls.target.set(0, 6.2, -42);
                showBubble("🙏 Chiêm bái Tam Thế Phật • Trang nghiêm thanh tịnh");"""

assert old_altar_view in text, "old_altar_view not found"
text = text.replace(old_altar_view, new_altar_view)

with open(r'D:\AI_FACTORY\AI_DAO_TAO\chanh-dien-ai-pro\static\world3d.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Tuning applied successfully!')
