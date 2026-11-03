from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 850})
    page.goto('http://127.0.0.1:8000/world3d', wait_until='networkidle')
    page.wait_for_timeout(2000)

    # 1. Enter Chánh Điện
    page.evaluate("enterMainHallInterior()")
    page.wait_for_timeout(1000)

    # 2. View 2: Outward (Photo 3)
    page.evaluate("setInteriorView('outward')")
    page.wait_for_timeout(1200)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/chanh_dien_view2_outward.png')
    print('View 2 captured!')

    # 3. View 3: Side angle (Photo 4)
    page.evaluate("setInteriorView('side')")
    page.wait_for_timeout(1200)
    page.screenshot(path='C:/Users/vinhmv/.gemini/antigravity/brain/d26c8f2d-10d2-4ad8-9d27-538d213511bd/chanh_dien_view3_side.png')
    print('View 3 captured!')

    browser.close()
