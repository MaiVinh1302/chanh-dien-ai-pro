from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://127.0.0.1:8000/world3d', wait_until='networkidle')
    page.wait_for_timeout(2000)
    
    # 1. Close-up screenshot of the new 3D Chibi Monk
    page.evaluate('''() => {
        camera.position.set(0, 3.2, 79);
        orbitControls.target.set(0, 2.5, 75);
    }''')
    page.wait_for_timeout(800)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/chibi_monk_close_up.png')
    print('1. Chibi monk captured')
    
    # 2. Enter Main Hall Interior (Chánh Điện 3D)
    page.evaluate('enterMainHallInterior()')
    page.wait_for_timeout(1500)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/main_hall_interior_3d.png')
    print('2. Interior captured')

    # 3. Trigger Fortune Ceremony Modal
    page.evaluate('triggerFortuneCeremony()')
    page.wait_for_timeout(1800)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/fortune_modal_3d.png')
    print('3. Fortune modal captured')

    browser.close()
print('All tests completed successfully!')
