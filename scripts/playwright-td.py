from playwright.sync_api import sync_playwright
import json, time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport={"width": 1440, "height": 900},
    )
    page = context.new_page()
    
    # Intercept network requests to find API calls
    api_calls = []
    def handle_request(request):
        if 'api' in request.url.lower() or 'graphql' in request.url.lower():
            api_calls.append({
                'url': request.url,
                'method': request.method,
            })
    
    page.on('request', handle_request)
    
    url = 'https://www.tackledirect.com/saltwater-spinning-reels.html'
    print(f"Navigating to: {url}")
    page.goto(url, wait_until="networkidle", timeout=60000)
    time.sleep(5)
    
    print(f"\nAPI calls intercepted: {len(api_calls)}")
    for ac in api_calls[:20]:
        print(f"  {ac['method']} {ac['url'][:120]}")
    
    # Take screenshot
    page.screenshot(path='/tmp/td_screenshot.png')
    print("\nScreenshot saved to /tmp/td_screenshot.png")
    
    # Get page text content
    text = page.inner_text('body')
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    print(f"\nPage has {len(lines)} text lines")
    
    # Find lines with $ (prices)
    price_lines = [l for l in lines if '$' in l and len(l) < 200]
    print(f"Lines with prices: {len(price_lines)}")
    for l in price_lines[:10]:
        print(f"  {l[:100]}")
    
    # Try to get product cards via JS evaluation
    products = page.evaluate('''() => {
        // Try common BigCommerce selectors
        const cards = document.querySelectorAll('.product-card, .card, .product-grid-item, [data-product-id], .productView, .product-item');
        return Array.from(cards).map(card => {
            const nameEl = card.querySelector('h1, h2, h3, .card-title, .name, a');
            const priceEl = card.querySelector('.price, [data-product-price], .current-price');
            const imgEl = card.querySelector('img');
            const linkEl = card.querySelector('a');
            return {
                name: nameEl ? nameEl.innerText.trim() : '',
                price: priceEl ? priceEl.innerText.trim() : '',
                image: imgEl ? (imgEl.dataset.src || imgEl.src || imgEl.dataset.lazySrc) : '',
                url: linkEl ? (linkEl.href || '') : '',
            };
        }).filter(p => p.name && p.name.length > 3);
    }''')
    
    print(f"\nProducts via JS evaluation: {len(products)}")
    for p in products[:5]:
        print(f"  {p['name'][:60]}  {p['price']}")
        print(f"    URL: {p['url'][:80]}")
        print(f"    IMG: {p['image'][:80]}")
    
    # Save all products
    if products:
        with open('/tmp/td_products.json', 'w') as f:
            json.dump(products, f, indent=2)
        print(f"\nSaved {len(products)} products to /tmp/td_products.json")
    
    browser.close()
