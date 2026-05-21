import { useState, useEffect } from 'react';
import { supabase } from './supabase';

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

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');

        if (error) throw error;
        setProducts(data || []);
      } catch (e: any) {
        console.error('Failed to fetch products from Supabase:', e);
        setError(e?.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
