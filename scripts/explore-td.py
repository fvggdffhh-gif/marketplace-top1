from curl_cffi import requests
import re
from bs4 import BeautifulSoup

session = requests.Session(impersonate='chrome')
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

# Get homepage
resp = session.get('https://www.tackledirect.com/', headers=headers, timeout=15)
html = resp.text

soup = BeautifulSoup(html, 'html.parser')

# Find all links with "fishing" in href
print("=== FISHING NAV LINKS ===")
for a in soup.find_all('a', href=True):
    href = a['href']
    if 'fishing' in href.lower() or 'rod' in href.lower() or 'reel' in href.lower():
        text = a.get_text(strip=True)[:60]
        if text:
            print(f"  {text} -> {href}")

# Check all URLs on page for category patterns
print("\n=== ALL CATEGORY-LIKE URLS ===")
urls = set()
for a in soup.find_all('a', href=True):
    href = a['href']
    if href.startswith('/') and not href.startswith('/api') and len(href.split('/')) <= 4:
        urls.add(href)
for url in sorted(urls):
    print(f"  {url}")

# Try to find actual product data
print("\n=== CHECKING /fishing/ page ===")
r = session.get('https://www.tackledirect.com/fishing/', headers=headers, timeout=15)
print(f"  Status: {r.status_code}")
print(f"  Content length: {len(r.text)}")

soup2 = BeautifulSoup(r.text, 'html.parser')

# Look for common BigCommerce product selectors
for selector in [
    '[data-product-id]',
    '.product-card',
    '.product-grid-item',
    '.card-body',
    '.product-item',
    '.products-grid-item',
    'article',
]:
    found = soup2.select(selector)
    if found:
        print(f"  Selector '{selector}': {len(found)} found")
        for item in found[:3]:
            name_el = item.select_one('h1, h2, h3, .card-title, .name, a')
            if name_el:
                print(f"    {name_el.get_text(strip=True)[:60]}")
