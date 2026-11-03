from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://127.0.0.1:8000/world3d', wait_until='networkidle')
    page.wait_for_timeout(2500)
    
    # 1. Capture Initial View (At Bridge / Lotus Pond)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/world3d_bridge.png')
    print('1. Bridge captured')
    
    # 2. Teleport to Main Hall
    page.evaluate("teleportTo('main_hall')")
    page.wait_for_timeout(1500)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/world3d_main_hall.png')
    print('2. Main hall captured')
    
    # 3. Teleport to Overview (Aerial View)
    page.evaluate("teleportTo('overview')")
    page.wait_for_timeout(1500)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/world3d_overview.png')
    print('3. Overview captured')

    # 4. Teleport to Stupa
    page.evaluate("teleportTo('stupa')")
    page.wait_for_timeout(1500)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/world3d_stupa.png')
    print('4. Stupa captured')

    browser.close()
print('All world3d tests completed successfully!')
