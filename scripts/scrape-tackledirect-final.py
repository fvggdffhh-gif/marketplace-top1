"""
TackleDirect Complete Product Scraper
Scrapes ALL fishing products via SearchSpring API with high-quality images
Saves to catal.json
"""

from curl_cffi import requests
import json, time

SEARCHSPRING_URL = "https://96dulv.a.searchspring.io/api/search/search.json"
BASE_URL = "https://www.tackledirect.com"

# All fishing categories
CATEGORY_PATHS = [
    "saltwater-spinning-reels.html",
    "saltwater-conventional-reels.html",
    "saltwater-trolling-reels.html",
    "saltwater-spinning-rods.html",
    "saltwater-conventional-rods.html",
    "saltwater-baitcasting-rods.html",
    "saltwater-jigging-rods.html",
    "saltwater-surf-rods.html",
    "saltwater-braided-fishing-line.html",
    "saltwater-monofilament-fishing-line.html",
    "saltwater-fluorocarbon-fishing-line.html",
    "saltwater-fishing-hooks.html",
    "saltwater-fishing-swivels.html",
    "saltwater-fishing-rigs.html",
    "saltwater-fishing-weights.html",
    "fishing-plugs.html",
    "saltwater-soft-baits.html",
    "saltwater-hard-baits.html",
    "saltwater-jigs.html",
    "saltwater-fishing-accessories.html",
    "saltwater-rod-holders.html",
    "saltwater-coolers-and-fish-bags.html",
    "saltwater-nets-gaffs-and-harpoons.html",
    "saltwater-tools.html",
    "saltwater-fishing-crimps.html",
    "saltwater-solid-and-split-rings.html",
    "saltwater-boxes-storage.html",
    "saltwater-fishing-reel-accessories.html",
    "rod-reel.html",
    "saltwater-spinning-combos.html",
    "saltwater-conventional-combos.html",
    "saltwater-electric-combos.html",
    "electric-saltwater-fishing-reels.html",
    "saltwater-baitcasting-reels.html",
    "all-fishing-reels.html",
    "all-fishing-rods.html",
    "all-fishing-line-leader.html",
    "fish-finders.html",
    "trolling-motors.html",
]

def fix_image_url(url):
    """Fix protocol-relative URLs"""
    if not url:
        return ""
    if url.startswith('//'):
        return 'https:' + url
    if url.startswith('http'):
        return url
    # Upgrade to higher resolution
    url = url.replace('/img200/', '/img800/')
    url = url.replace('/stencil/250x48/', '/stencil/800x800/')
    url = url.replace('/stencil/320w/', '/stencil/800w/')
    return url


def scrape_category(path, session, page=1):
    """Fetch category via SearchSpring API"""
    url = f"{BASE_URL}/{path}"
    params = {
        'ajaxCatalog': 'v3',
        'resultsFormat': 'native',
        'siteId': '96dulv',
        'domain': BASE_URL,
        'url': url,
        'resultsPerPage': '60',
        'page': str(page),
    }
    headers = {
        'Referer': BASE_URL + '/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    }
    
    try:
        resp = session.get(SEARCHSPRING_URL, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            return data.get('results', [])
    except:
        pass
    return []


def transform_product(p):
    """Convert SearchSpring product to catalog format"""
    # Image URL - fix protocol-relative
    raw_img = p.get('imageUrl') or ''
    image = fix_image_url(raw_img)
    
    # High-res version
    image_hd = image.replace('/img200/', '/img800/')
    
    # Price handling
    price = p.get('saleprice') or p.get('price')
    if isinstance(price, str):
        price = float(price.replace('$', '').replace(',', ''))
    
    retail = p.get('retailprice')
    if isinstance(retail, str):
        retail = float(retail.replace('$', '').replace(',', ''))
    
    original_price = None
    if retail and isinstance(retail, (int, float)) and isinstance(price, (int, float)):
        if retail > price:
            original_price = retail
    
    bc_id = p.get('bcid') or (p.get('bc_ids', [None])[0] if p.get('bc_ids') else None)
    
    return {
        "id": bc_id,
        "name": p.get('name', '').replace('&amp;', '&').replace('&quot;', '"'),
        "price": round(float(price), 2) if price else None,
        "originalPrice": round(float(original_price), 2) if original_price else None,
        "brand": p.get('brand', ''),
        "description": p.get('description', '')[:500],
        "image": image,
        "imageHd": image_hd,
        "url": f"{BASE_URL}/product/{bc_id}/" if bc_id else "",
        "category": "fishing",
        "inStock": True,
        "freeShipping": p.get('freeshipping', False),
    }


def main():
    session = requests.Session(impersonate="chrome")
    all_products = []
    seen_ids = set()
    
    print(f"Scraping {len(CATEGORY_PATHS)} categories...")
    print("=" * 70)
    
    for i, path in enumerate(CATEGORY_PATHS):
        print(f"\n[{i+1}/{len(CATEGORY_PATHS)}] {path}")
        
        # Page 1
        products = scrape_category(path, session, page=1)
        count_p1 = len(products)
        if products:
            print(f"  Page 1: {count_p1} products")
        
        for p in products:
            bc_id = p.get('bcid')
            if bc_id and bc_id in seen_ids:
                continue
            if bc_id:
                seen_ids.add(bc_id)
            
            transformed = transform_product(p)
            if transformed['name'] and transformed['price']:
                all_products.append(transformed)
        
        # Page 2 if 60 results
        if count_p1 >= 60:
            time.sleep(0.5)
            products_p2 = scrape_category(path, session, page=2)
            if products_p2:
                print(f"  Page 2: {len(products_p2)} products")
                for p in products_p2:
                    bc_id = p.get('bcid')
                    if bc_id and bc_id in seen_ids:
                        continue
                    if bc_id:
                        seen_ids.add(bc_id)
                    transformed = transform_product(p)
                    if transformed['name'] and transformed['price']:
                        all_products.append(transformed)
        
        time.sleep(0.3)
    
    print(f"\n{'=' * 70}")
    print(f"Total unique products: {len(all_products)}")
    
    if all_products:
        # Save catal.json
        output = 'src/data/catal.json'
        with open(output, 'w', encoding='utf-8') as f:
            json.dump(all_products, f, indent=2, ensure_ascii=False)
        print(f"Saved to {output}")
        
        # Stats
        brands = {}
        prices = []
        for p in all_products:
            if p.get('brand'):
                brands[p['brand']] = brands.get(p['brand'], 0) + 1
            if p.get('price'):
                prices.append(p['price'])
        
        print(f"\n📊 Brands ({len(brands)}):")
        for brand, count in sorted(brands.items(), key=lambda x: -x[1])[:20]:
            print(f"   {brand}: {count}")
        
        if prices:
            print(f"\n💰 Price: ${min(prices):.2f} - ${max(prices):.2f} (avg: ${sum(prices)/len(prices):.2f})")
        
        # Samples
        print(f"\n🎣 Sample products:")
        for p in all_products[:5]:
            note = f" (was ${p['originalPrice']})" if p.get('originalPrice') else ""
            brand = f" [{p['brand']}]" if p.get('brand') else ""
            print(f"   {p['name'][:70]}")
            print(f"     ${p['price']}{note}{brand}")
            print(f"     Image: {p['image'][:90]}")
    else:
        print("No products found!")


if __name__ == "__main__":
    main()
