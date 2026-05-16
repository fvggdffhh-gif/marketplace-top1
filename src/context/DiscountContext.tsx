'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface DiscountContextType {
  hasPurchased: boolean;
  discountApplied: boolean;
  discountPercentage: number;
  getDiscountedPrice: (originalPrice: number) => number;
  applyDiscountCode: (code: string) => Promise<boolean>;
  completePurchase: () => Promise<void>;
  loading: boolean;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const { supabaseUser } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has previous orders
  useEffect(() => {
    if (!supabaseUser) {
      setHasPurchased(false);
      setLoading(false);
      return;
    }

    checkPurchaseHistory();
  }, [supabaseUser]);

  const checkPurchaseHistory = async () => {
    if (!supabaseUser) return;

    try {
      const { count, error } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', supabaseUser.id);

      if (!error && count && count > 0) {
        setHasPurchased(true);
      }
    } catch (e) {
      console.error('Failed to check purchase history:', e);
    } finally {
      setLoading(false);
    }
  };

  const discountApplied = !hasPurchased || activeDiscount !== null;
  const discountPercentage = activeDiscount || (hasPurchased ? 0 : 20);

  const getDiscountedPrice = (originalPrice: number) => {
    if (discountApplied) {
      return Math.round(originalPrice * (1 - discountPercentage / 100) * 100) / 100;
    }
    return originalPrice;
  };

  const applyDiscountCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any)
        .from('discounts')
        .select('percentage, valid_until')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        return false;
      }

      // Check if discount is still valid
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        return false;
      }

      setActiveDiscount(data.percentage);
      return true;
    } catch (e) {
      console.error('Failed to apply discount:', e);
      return false;
    }
  };

  const completePurchase = async () => {
    if (!supabaseUser || items.length === 0) return;

    try {
      // Create order
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          user_id: supabaseUser.id,
          total: getTotal(),
          status: 'completed',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await (supabase as any)
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Mark user as having purchased
      setHasPurchased(true);
      clearCart();
    } catch (e) {
      console.error('Failed to complete purchase:', e);
      throw e;
    }
  };

  return (
    <DiscountContext.Provider value={{ hasPurchased, discountApplied, discountPercentage, getDiscountedPrice, applyDiscountCode, completePurchase, loading }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscount must be used within DiscountProvider');
  }
  return context;
}
