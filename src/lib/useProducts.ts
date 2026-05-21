import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { products as fallbackProducts } from '@/data/products';

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

/** Map local Product interface to DbProduct */
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
    let cancelled = false;

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');

        if (cancelled) return;

        if (error) throw error;

        if (data && data.length > 0) {
          // Supabase has data — use it
          setProducts(data);
        } else {
          // Supabase is empty — fallback to local data
          console.warn('Supabase products table is empty, using local fallback');
          setProducts(fallbackProducts.map(toDbProduct));
        }
      } catch (e: any) {
        if (cancelled) return;
        console.error('Failed to fetch products from Supabase:', e);
        setError(e?.message || 'Unknown error');
        // Fallback to local data
        setProducts(fallbackProducts.map(toDbProduct));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}
