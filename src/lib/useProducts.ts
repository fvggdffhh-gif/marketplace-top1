import { useState, useEffect } from 'react';
import { products as localProducts } from '@/data/products';

export interface DbProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  image: string | null;
  features: string[] | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  badge: string | null;
  created_at: string;
}

function toDbProduct(p: any): DbProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description || null,
    price: p.price,
    original_price: p.originalPrice || null,
    category: p.category,
    image: p.image,
    features: p.features || null,
    rating: p.rating,
    reviews: p.reviews || null,
    in_stock: p.inStock,
    badge: p.badge || null,
    created_at: new Date().toISOString(),
  };
}

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load directly from local products (products.ts)
    // This is instant — no network request needed
    try {
      const localData = localProducts.map(toDbProduct);
      setProducts(localData);
      console.log(`Loaded ${localData.length} products from local catalog`);
    } catch (e: any) {
      console.error('Failed to load local products:', e);
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error };
}
