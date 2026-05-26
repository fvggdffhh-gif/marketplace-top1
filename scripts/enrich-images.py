"""
Download product images from TackleDirect and generate image galleries (3-5 photos per product)
Updates catal.json with image arrays
"""

from playwright.sync_api import sync_playwright
from curl_cffi import requests
import json, time, os, hashlib

BASE_URL = "https://www.tackledirect.com"

# Load existing catalog
with open('src/data/catal.json', 'r') as f:
    catalog = json.load(f)

print(f"Loaded {len(catalog)} products from catal.json")

# Create directories for downloaded images
os.makedirs('public/td-products', exist_ok=True)

def download_image(session, url, product_id, img_idx):
    """Download image and save locally"""
    try:
        resp = session.get(url, timeout=10)
        if resp.status_code == 200 and len(resp.content) > 500:
            filename = f"{product_id}_{img_idx}.jpg"
            filepath = f"public/td-products/{filename}"
            with open(filepath, 'wb') as f:
                f.write(resp.content)
            return f"/td-products/{filename}"
    except:
        pass
    return None


def get_product_images(session, product_url, product_name):
    """Visit product page and extract all gallery images"""
    try:
        # Use curl_cffi to get page HTML
        resp = session.get(product_url, timeout=15, impersonate='chrome')
        html = resp.text
        
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')
        
        # BigCommerce: look for product image gallery
        # Strategy 1: Look for image links on product page
        img_urls = set()
        
        # Find all images that look like product photos
        for img in soup.select('img[src*="tackledirect"], img[data-src*="tackledirect"], img[src*="bigcommerce"]'):
            src = img.get('data-src') or img.get('src') or img.get('data-lazy-src') or ''
            if src and 'img200' in src or 'img400' in src or 'img800' in src:
                # Get higher res version
                src = src.replace('img200', 'img800').replace('img400', 'img800')
                if not src.startswith('http'):
                    src = f"https:{src}" if src.startswith('//') else f"{BASE_URL}{src}"
                img_urls.add(src)
        
        # Strategy 2: Look for data-zoom-image or similar
        for el in soup.select('[data-zoom-image], [data-image-gallery-item]'):
            src = el.get('data-zoom-image') or el.get('href') or ''
            if src and ('tackledirect' in src or 'bigcommerce' in src):
                if not src.startswith('http'):
                    src = f"https:{src}" if src.startswith('//') else f"{BASE_URL}{src}"
                img_urls.add(src)
        
        # Strategy 3: Check JSON-LD for images
        for script in soup.select('script[type="application/ld+json"]'):
            try:
                data = json.loads(script.string)
                if isinstance(data, dict):
                    images = data.get('image', [])
                    if isinstance(images, list):
                        for img in images:
                            if isinstance(img, str):
                                img_urls.add(img)
                            elif isinstance(img, dict) and 'url' in img:
                                img_urls.add(img['url'])
                    elif isinstance(images, str):
                        img_urls.add(images)
            except:
                pass
        
        return list(img_urls)[:5]  # Max 5 images
        
    except Exception as e:
        print(f"  ✗ Error getting images for {product_name[:40]}: {e}")
        return []


def main():
    session = requests.Session(impersonate='chrome')
    
    products_updated = 0
    
    for i, product in enumerate(catalog):
        print(f"\n[{i+1}/{len(catalog)}] {product['name'][:60]}")
        
        current_images = product.get('images', [])
        if current_images and len(current_images) >= 3:
            print(f"  Already has {len(current_images)} images, skipping")
            continue
        
        # Visit product page
        product_url = product.get('url')
        if not product_url:
            print(f"  No URL, using single image")
            product['images'] = [product.get('image', '')]
            products_updated += 1
            continue
        
        print(f"  URL: {product_url[:70]}")
        
        # Get all images from product page
        gallery_images = get_product_images(session, product_url, product['name'])
        
        if len(gallery_images) >= 3:
            print(f"  ✓ Found {len(gallery_images)} images")
            product['images'] = gallery_images[:5]
            products_updated += 1
        else:
            # Fallback: generate multiple resolution versions of the single image
            base_img = product.get('image', '')
            if base_img:
                variations = []
                # img200 (thumbnail), img400 (medium), img800 (large)
                for size in ['img200', 'img400', 'img800']:
                    var = base_img.replace('/img200/', f'/{size}/').replace('/img400/', f'/{size}/').replace('/img800/', f'/{size}/')
                    if var not in variations:
                        variations.append(var)
                
                # Also try the original full-res version
                full_res = base_img.replace('/img200/', '/images/').replace('/img400/', '/images/')
                if full_res != base_img:
                    variations.append(full_res)
                
                product['images'] = variations[:5]
                print(f"  Generated {len(variations)} image variants from single source")
                products_updated += 1
            else:
                product['images'] = []
                print(f"  No images available")
        
        # Also update the single 'image' field to the best quality version
        if product.get('images'):
            # Prefer img800 version
            best = [img for img in product['images'] if 'img800' in img]
            if best:
                product['image'] = best[0]
            else:
                product['image'] = product['images'][0]
        
        time.sleep(0.3)
    
    print(f"\n{'='*60}")
    print(f"Updated {products_updated}/{len(catalog)} products with image galleries")
    
    # Save updated catalog
    with open('src/data/catal.json', 'w') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    
    # Stats
    with_galleries = sum(1 for p in catalog if len(p.get('images', [])) >= 3)
    print(f"Products with 3+ images: {with_galleries}/{len(catalog)}")
    
    # Show samples
    print("\nSample products with galleries:")
    for p in catalog[:3]:
        imgs = p.get('images', [])
        print(f"  {p['name'][:50]}: {len(imgs)} images")
        for img in imgs[:2]:
            print(f"    {img[:90]}")


if __name__ == "__main__":
    main()
