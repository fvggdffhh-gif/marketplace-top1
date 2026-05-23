'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Truck, CreditCard, CheckCircle, ArrowLeft, Package, Mail } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  items: number;
  deliveryPoint: string;
}

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user, supabaseUser } = useAuth();
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<'form' | 'map' | 'confirm' | 'done'>(user ? 'form' : 'form');
  const [processing, setProcessing] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  // Load orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Redirect if cart empty
  if (items.length === 0 && step !== 'done') {
    router.push('/cart');
    return null;
  }

  const subtotal = getTotal();
  const deliveryFee = 0; // Free shipping!
  const total = subtotal + deliveryFee;

  const handleOrder = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));

    const newOrder: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toLocaleDateString('ru-RU'),
      total,
      status: 'confirmed',
      items: items.reduce((s, i) => s + i.quantity, 0),
      deliveryPoint: selectedPoint || address || 'Не выбрано',
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrderId(newOrder.id);
    setStep('done');
    clearCart();
    setProcessing(false);
  };

  const handleMapSelect = (lat: number, lng: number, placeName: string) => {
    setSelectedPoint(placeName);
    setAddress(placeName);
  };

  // Order confirmation screen
  if (step === 'done') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success animation */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Заказ оформлен! 🎉
            </h2>
            
            <p className="text-gray-600 text-lg mb-2">
              Спасибо за покупку, {name}!
            </p>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-blue-600" size={24} />
                <p className="text-blue-900 font-bold text-lg">
                  Ждите письмо на ваш email
                </p>
              </div>
              <p className="text-blue-700 text-sm">
                Подтверждение заказа и трек-номер отправлены на <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Номер заказа</span>
                <span className="font-bold text-gray-900">{orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Дата</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Товары</span>
                <span className="font-medium text-gray-900">{items.reduce((s, i) => s + i.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Доставка</span>
                <span className="font-medium text-green-600">Бесплатно</span>
              </div>
              {selectedPoint && (
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span className="text-gray-500">Пункт выдачи</span>
                  <span className="font-medium text-gray-900 text-right max-w-[200px]">{selectedPoint}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalog" className="flex-1 btn-primary inline-flex items-center justify-center gap-2">
                Продолжить покупки
              </Link>
              <Link href="/account" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                <Package size={18} />
                Мои заказы
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { key: 'form', label: 'Данные', icon: Truck },
            { key: 'map', label: 'Доставка', icon: MapPin },
            { key: 'confirm', label: 'Оплата', icon: CreditCard },
          ].map((s, i) => {
            const currentIdx = ['form', 'map', 'confirm'].indexOf(step);
            const isActive = i <= currentIdx;
            const isCurrent = s.key === step;
            return (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${
                  isCurrent ? 'bg-blue-600 text-white' : isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  <s.icon size={16} />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isActive ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main form */}
          <div className="flex-1">
            {step === 'form' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="text-blue-600" size={24} />
                  Данные получателя
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="+61 XXX XXX XXX"
                    />
                  </div>
                  <button
                    onClick={() => setStep('map')}
                    disabled={!name || !email || !phone}
                    className="w-full btn-primary py-3 disabled:opacity-50"
                  >
                    Выбрать пункт доставки →
                  </button>
                </div>
              </div>
            )}

            {step === 'map' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={24} />
                  Выберите пункт доставки
                </h3>
                <p className="text-gray-500 text-sm mb-4">Кликните на карту или выберите из списка</p>
                
                {/* Interactive map */}
                <div 
                  ref={mapRef}
                  className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border-2 border-gray-200 overflow-hidden mb-4 cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const lat = (-33.8688 + (y / rect.height) * 0.5).toFixed(4);
                    const lng = (151.2093 + (x / rect.width) * 0.5).toFixed(4);
                    handleMapSelect(parseFloat(lat), parseFloat(lng), `Пункт выдачи (${lat}, ${lng})`);
                  }}
                >
                  {/* Map background */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234364F7' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                  
                  {/* Map markers */}
                  {[
                    { name: 'Сидней — CBD', x: 45, y: 55 },
                    { name: 'Мельбурн — Centre', x: 35, y: 75 },
                    { name: 'Брисбен — North', x: 65, y: 30 },
                    { name: 'Перт — West', x: 10, y: 60 },
                    { name: 'Аделаида — Central', x: 30, y: 65 },
                  ].map((m, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPoint(m.name);
                        setAddress(m.name);
                      }}
                      className={`absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-125 ${
                        selectedPoint === m.name ? 'scale-125 z-10' : ''
                      }`}
                      style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    >
                      <MapPin size={32} className={selectedPoint === m.name ? 'text-blue-600 drop-shadow-lg' : 'text-red-500 drop-shadow'} />
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap ${
                        selectedPoint === m.name ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {selectedPoint === m.name ? '✓ ' : ''}{m.name}
                      </span>
                    </button>
                  ))}

                  {/* Australia outline hint */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-gray-300 text-sm font-medium">Нажмите на карту для выбора точки</span>
                  </div>
                </div>

                {/* Quick select */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {[
                    'Сидней — CBD',
                    'Мельбурн — Centre',
                    'Брисбен — North',
                    'Перт — West',
                    'Аделаида — Central',
                  ].map((name) => (
                    <button
                      key={name}
                      onClick={() => { setSelectedPoint(name); setAddress(name); }}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedPoint === name
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {selectedPoint === name && '✓ '}{name}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('form')} className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50">
                    ← Назад
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!selectedPoint}
                    className="flex-1 btn-primary py-3 disabled:opacity-50"
                  >
                    Перейти к оплате →
                  </button>
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={24} />
                  Подтверждение заказа
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Получатель</p>
                      <p className="font-medium">{name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Контакты</p>
                      <p className="font-medium text-sm">{email}</p>
                      <p className="font-medium text-sm">{phone}</p>
                    </div>
                  </div>

                  <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Пункт выдачи</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin size={16} className="text-blue-600" />
                        {selectedPoint}
                      </p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</p>
                    {items.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700 truncate max-w-[60%]">{item.name}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-gray-400 mt-1">+ ещё {items.length - 3} товаров</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('map')} className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50">
                    ← Назад
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={processing}
                    className="flex-1 btn-primary py-3 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Обработка...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Оплатить ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ваш заказ</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Подытог</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Доставка</span>
                  <span>БЕСПЛАТНО 🎉</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>Итого</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
