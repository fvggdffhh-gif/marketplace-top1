from curl_cffi import requests
from bs4 import BeautifulSoup
import json, re

session = requests.Session(impersonate='chrome')
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

url = 'https://www.tackledirect.com/saltwater-spinning-reels.html'
resp = session.get(url, headers=headers, timeout=15)
print(f'Status: {resp.status_code}')
print(f'Length: {len(resp.text)}')

if 'product' in resp.text.lower():
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    # Check selectors
    for sel in ['.card-body', '.card-title', '.productCard-name', '.name', 'h2.card-title', '.card-text', '.product-info']:
        found = soup.select(sel)
        if found:
            print(f'Selector "{sel}": {len(found)}')
            for f in found[:2]:
                print(f'  -> {f.get_text(strip=True)[:80]}')
    
    # Prices
    for sel in ['.price', '.card-price', '[data-product-price]', '.product-price', '.current-price']:
        found = soup.select(sel)
        if found:
            print(f'Price selector "{sel}": {len(found)}')
            for f in found[:2]:
                print(f'  -> {f.get_text(strip=True)}')
    
    # JSON-LD structured data
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            data = json.loads(script.string)
            print(f'JSON-LD type: {data.get("@type", "unknown")}')
            if isinstance(data, dict):
                print(f'  Keys: {list(data.keys())[:10]}')
            if isinstance(data, list):
                print(f'  {len(data)} items')
                if data:
                    print(f'  First item keys: {list(data[0].keys())[:10]}')
        except:
            pass
    
    # Check for embedded product data in JS
    product_data_patterns = [
        r'"products"\s*:\s*\[',
        r'"items"\s*:\s*\[',
        r'window\.PRODUCTS\s*=',
        r'product_data\s*=',
    ]
    for pattern in product_data_patterns:
        matches = re.findall(pattern, resp.text)
        if matches:
            print(f'Found embedded data pattern: {pattern}')
    
    # Find image URLs
    imgs = soup.select('img[src*="cdn"], img[data-src*="cdn"]')
    if imgs:
        print(f'CDN images: {len(imgs)}')
        for img in imgs[:3]:
            src = img.get('data-src') or img.get('src') or img.get('data-lazy-src')
            print(f'  {src[:100] if src else "no src"}')
    
    # Find all links with prices nearby
    all_links = soup.select('a[href*=".html"]')
    products_in_links = []
    for link in all_links:
        text = link.get_text(strip=True)
        if '$' in text:
            prices = re.findall(r'\$?([\d,]+\.?\d*)', text)
            if prices:
                href = link.get('href', '')
                name = text[:100]
                products_in_links.append({'name': name, 'price': prices[0], 'url': href})
    
    print(f'\nFound {len(products_in_links)} links with prices')
    for p in products_in_links[:10]:
        print(f'  {p["name"][:60]}  ${p["price"]}  {p["url"][:60]}')
else:
    print('No product content')
    print(resp.text[:3000])
