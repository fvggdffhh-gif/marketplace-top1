'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import { useCart } from '@/context/CartContext';
import { useDiscount } from '@/context/DiscountContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { discountApplied, discountPercentage, getDiscountedPrice, completePurchase, hasPurchased } = useDiscount();
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const subtotal = getTotal();
  const discountAmount = discountApplied ? items.reduce((sum, item) => {
    const originalPrice = item.price / 0.8;
    return sum + ((originalPrice - item.price) * item.quantity);
  }, 0) : 0;
  const finalTotal = discountApplied ? subtotal : subtotal;

  const handleCheckout = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      completePurchase();
      clearCart();
      setProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6">Thank you for your first purchase! Your 20% discount has been applied.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Note: Future orders will be at regular prices.</p>
            </div>
            <Link href="/catalog" className="inline-flex items-center gap-2 btn-primary">
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      First Purchase Discount ({discountPercentage}%)
                    </span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={finalTotal >= 500 ? 'text-green-600' : ''}>
                    {finalTotal >= 500 ? 'FREE' : '$29.99'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(finalTotal + (finalTotal >= 500 ? 0 : 29.99)).toFixed(2)}</span>
                </div>
              </div>

              {finalTotal < 500 && (
                <p className="text-sm text-primary-600 bg-primary-50 p-2 rounded-lg mb-4">
                  Add ${(500 - finalTotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <button 
                onClick={handleCheckout}
                disabled={processing}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              <Link href="/catalog" className="block text-center mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
