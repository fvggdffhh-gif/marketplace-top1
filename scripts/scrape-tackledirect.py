"""
TackleDirect Fishing Products Scraper via SearchSpring API
Scrapes all fishing categories, saves catalog.json
"""

from curl_cffi import requests
import json, time

BASE_URL = "https://www.tackledirect.com"
SEARCHSPRING_URL = "https://96dulv.a.searchspring.io/api/search/search.json"

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

def scrape_category(path, session, page=1):
    """Fetch a category page via SearchSpring API"""
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
    
    resp = session.get(SEARCHSPRING_URL, params=params, headers=headers, timeout=15)
    if resp.status_code != 200:
        return []
    
    data = resp.json()
    results = data.get('results', [])
    return results


def transform_product(p, cat_path):
    """Convert SearchSpring product to our format"""
    # Get price
    price = p.get('saleprice') or p.get('price') or p.get('retailprice')
    if isinstance(price, str):
        price = float(price.replace('$', '').replace(',', ''))
    
    original_price = p.get('retailprice') if p.get('retailprice') != price else None
    if isinstance(original_price, str):
        original_price = float(original_price.replace('$', '').replace(',', ''))
    
    if original_price and original_price <= price:
        original_price = None
    
    # Image URL
    img = p.get('imageUrl') or p.get('thumbnailUrl') or ''
    if img and not img.startswith('http'):
        img = f"{BASE_URL}{img}"
    
    # Get high-res image from CDN
    if 'cdn11.bigcommerce.com' in img:
        # Upgrade to higher resolution
        img = img.replace('/stencil/250x48/', '/stencil/500x659/')
        img = img.replace('/stencil/320w/', '/stencil/800w/')
    
    bc_id = p.get('bcid') or p.get('bc_ids', [None])[0] if p.get('bc_ids') else None
    product_url = f"{BASE_URL}/product/{bc_id}/" if bc_id else f"{BASE_URL}/{cat_path}"
    
    return {
        "id": bc_id,
        "name": p.get('name', ''),
        "price": round(price, 2) if price else None,
        "originalPrice": round(original_price, 2) if original_price else None,
        "brand": p.get('brand', ''),
        "description": p.get('description', '')[:500],
        "features": p.get('customfields', []),
        "image": img,
        "url": product_url,
        "category": "fishing",
        "inStock": True,
        "freeShipping": p.get('freeshipping', False),
    }


def main():
    session = requests.Session(impersonate="chrome")
    all_products = []
    seen_ids = set()
    
    print(f"Scraping {len(CATEGORY_PATHS)} categories from TackleDirect...")
    print("=" * 70)
    
    for i, path in enumerate(CATEGORY_PATHS):
        print(f"\n[{i+1}/{len(CATEGORY_PATHS)}] {path}")
        
        # Get first page
        products = scrape_category(path, session, page=1)
        if products:
            print(f"  Page 1: {len(products)} products")
        
        for p in products:
            bc_id = p.get('bcid')
            if bc_id and bc_id in seen_ids:
                continue
            if bc_id:
                seen_ids.add(bc_id)
            
            transformed = transform_product(p, path)
            if transformed['name'] and transformed['price']:
                all_products.append(transformed)
        
        # Try page 2 if there are 60 results
        if len(products) >= 60:
            time.sleep(1)
            products_p2 = scrape_category(path, session, page=2)
            if products_p2:
                print(f"  Page 2: {len(products_p2)} products")
                for p in products_p2:
                    bc_id = p.get('bcid')
                    if bc_id and bc_id in seen_ids:
                        continue
                    if bc_id:
                        seen_ids.add(bc_id)
                    transformed = transform_product(p, path)
                    if transformed['name'] and transformed['price']:
                        all_products.append(transformed)
        
        time.sleep(0.5)  # Be polite
    
    print(f"\n{'=' * 70}")
    print(f"Total unique products: {len(all_products)}")
    
    if all_products:
        # Save catalog
        output_path = 'src/data/tackledirect-catalog.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(all_products, f, indent=2, ensure_ascii=False)
        
        print(f"Saved to {output_path}")
        
        # Stats
        brands = {}
        prices = []
        for p in all_products:
            if p.get('brand'):
                brands[p['brand']] = brands.get(p['brand'], 0) + 1
            if p.get('price'):
                prices.append(p['price'])
        
        print(f"\n📊 Top Brands:")
        for brand, count in sorted(brands.items(), key=lambda x: -x[1])[:20]:
            print(f"   {brand}: {count}")
        
        if prices:
            print(f"\n💰 Price range: ${min(prices):.2f} - ${max(prices):.2f}")
            print(f"   Average: ${sum(prices)/len(prices):.2f}")
        
        # Show samples
        print(f"\n🎣 Sample products:")
        for p in all_products[:5]:
            note = f" (was ${p['originalPrice']})" if p.get('originalPrice') else ""
            brand_note = f" [{p['brand']}]" if p.get('brand') else ""
            print(f"   {p['name'][:70]}  ${p['price']}{note}{brand_note}")
    else:
        print("No products found!")


if __name__ == "__main__":
    main()
