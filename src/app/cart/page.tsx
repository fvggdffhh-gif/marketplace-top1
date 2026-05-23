'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import { useCart } from '@/context/CartContext';
import { useDiscount } from '@/context/DiscountContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  
  const subtotal = getTotal();
  const shipping = 0; // Бесплатная доставка!
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <DiscountBanner />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <Link href="/catalog" className="inline-flex items-center gap-2 btn-primary">
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DiscountBanner />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-primary-700 font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={18} className="text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Subtotal</p>
                  <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Подытог</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Доставка</span>
                  <span>БЕСПЛАТНО 🎉</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
                  <span>Итого</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
              >
                Оформить заказ
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
