'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Phone, MapPin, Package, ShoppingCart, LogOut, Edit2 } from 'lucide-react';

export default function Account() {
  const { user, logout } = useAuth();
  const { items, getTotal } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DiscountBanner />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                  <User size={18} />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                  <Package size={18} />
                  <span>Orders</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                  <ShoppingCart size={18} />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Details</h3>
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{user.address || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shopping Cart</h3>
              {items.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                      <p className="text-2xl font-bold text-primary-700">${getTotal().toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => router.push('/cart')}
                      className="btn-primary"
                    >
                      View Cart
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => router.push('/catalog')}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
