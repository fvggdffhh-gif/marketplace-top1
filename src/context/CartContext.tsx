'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  loading: boolean;
  comboDiscount: number;
  comboEligible: boolean;
  showComboPopup: boolean;
  setShowComboPopup: (show: boolean) => void;
}

const COMBO_THRESHOLD = 3000;
const COMBO_DISCOUNT = 0.15;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComboPopup, setShowComboPopup] = useState(false);
  const { supabaseUser } = useAuth();

  // Load cart from Supabase when user is authenticated
  useEffect(() => {
    if (!supabaseUser) {
      // Fall back to localStorage for unauthenticated users
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load cart:', e);
        }
      }
      setLoading(false);
      return;
    }

    loadCartFromSupabase();
  }, [supabaseUser]);

  const loadCartFromSupabase = async () => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await (supabase as any)
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', supabaseUser.id);

      if (data && !error) {
        const cartItems: CartItem[] = data.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          quantity: item.quantity,
          image: item.products.image,
        }));
        setItems(cartItems);
      }
    } catch (e) {
      console.error('Failed to load cart from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart to Supabase when items change and user is authenticated
  useEffect(() => {
    if (!supabaseUser || items.length === 0) return;

    syncCartToSupabase();
  }, [items, supabaseUser]);

  const syncCartToSupabase = async () => {
    if (!supabaseUser) return;

    try {
      // Clear existing cart
      await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', supabaseUser.id);

      // Insert current items
      if (items.length > 0) {
        const cartData = items.map(item => ({
          user_id: supabaseUser.id,
          product_id: item.id,
          quantity: item.quantity,
        }));

        await (supabase as any)
          .from('cart_items')
          .insert(cartData);
      }
    } catch (e) {
      console.error('Failed to sync cart to Supabase:', e);
    }
  };

  // Save to localStorage for unauthenticated users
  useEffect(() => {
    if (!supabaseUser) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, supabaseUser]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const total = getTotal();
  const comboDiscount = total >= COMBO_THRESHOLD ? COMBO_DISCOUNT : 0;
  const comboEligible = total >= COMBO_THRESHOLD;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount, loading, comboDiscount, comboEligible, showComboPopup, setShowComboPopup }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
