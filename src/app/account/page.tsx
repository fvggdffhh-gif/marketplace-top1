'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Package, ShoppingCart, LogOut, Edit2, CheckCircle, Truck, Clock } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  deliveryPoint: string;
}

export default function Account() {
  const { user, logout } = useAuth();
  const { items, getTotal } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const saved = localStorage.getItem('orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch {}
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={18} className="text-green-600" />;
      case 'processing': return <Clock size={18} className="text-yellow-600" />;
      case 'shipped': return <Truck size={18} className="text-blue-600" />;
      default: return <Package size={18} className="text-gray-400" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Заказ оформлен';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
          <p className="text-gray-600">Управляйте профилем и заказами</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
                  <User size={18} />
                  <span>Профиль</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                  <Package size={18} />
                  <span>Заказы {orders.length > 0 && `(${orders.length})`}</span>
                </button>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Выйти</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Orders Notification */}
            {orders.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="text-blue-600" size={24} />
                  Мои заказы
                </h3>
                
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      {/* Status banner */}
                      {order.status === 'confirmed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                          <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-green-800 font-bold text-sm">
                              Ваш заказ оформлен! ✅
                            </p>
                            <p className="text-green-700 text-xs mt-0.5">
                              Ждите письмо на ваш email с подтверждением и трек-номером
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {statusIcon(order.status)}
                          <span className="text-sm font-medium text-gray-700">{statusLabel(order.status)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex flex-wrap justify-between gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Товары: </span>
                          <span className="font-medium">{order.items} шт.</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Сумма: </span>
                          <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin size={14} />
                          <span>{order.deliveryPoint}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Профиль</h3>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  <Edit2 size={18} />
                  <span>Изменить</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Имя</p>
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
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium text-gray-900">{user.phone || 'Не указан'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p className="font-medium text-gray-900">{user.address || 'Не указан'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Корзина</h3>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="text-gray-600">{items.length} товар(ов)</p>
                    <p className="text-2xl font-bold text-blue-700">${getTotal().toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => router.push('/cart')}
                    className="btn-primary"
                  >
                    Перейти в корзину
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
