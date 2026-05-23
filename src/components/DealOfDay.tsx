'use client';

import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const DEAL_PRODUCT = {
  name: 'Ray-Ban Meta Smart Glasses',
  description: 'Умные очки Ray-Ban Meta со встроенной камерой, динамиками и AI-ассистентом. Стильный дизайн, кристально чистый звук и возможность снимать фото и видео прямо с очков.',
  price: 390.15,
  originalPrice: 459,
  images: [
    'https://image.qwenlm.ai/public_source/9fc2e797-58df-4824-8691-32a78e2cc09b/2435a031b-c1f1-4db2-aec7-080525e753d55816.png',
    'https://image.qwenlm.ai/public_source/9fc2e797-58df-4824-8691-32a78e2cc09b/3435a031b-c1f1-4db2-aec7-080525e753d53363.png',
    'https://image.qwenlm.ai/public_source/9fc2e797-58df-4824-8691-32a78e2cc09b/0435a031b-c1f1-4db2-aec7-080525e753d51803.png',
    'https://image.qwenlm.ai/public_source/9fc2e797-58df-4824-8691-32a78e2cc09b/2435a031b-c1f1-4db2-aec7-080525e753d51400.png',
    '/ray-ban-5.webp',
  ],
};

export default function DealOfDay() {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentImage, setCurrentImage] = useState(0);
  const savings = Math.round(((DEAL_PRODUCT.originalPrice - DEAL_PRODUCT.price) / DEAL_PRODUCT.originalPrice) * 100);
  const stockPercent = 73;
  const stockLeft = 8;

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % DEAL_PRODUCT.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevImage = () => setCurrentImage(prev => (prev === 0 ? DEAL_PRODUCT.images.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage(prev => (prev === DEAL_PRODUCT.images.length - 1 ? 0 : prev + 1));

  const countdownLabels = language === 'ru'
    ? { hours: 'часов', minutes: 'минут', seconds: 'секунд' }
    : { hours: 'hours', minutes: 'minutes', seconds: 'seconds' };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ animation: 'dealSlideIn 0.8s ease-out' }}>
      {/* Fire background glow */}
      <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-radial opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,100,0,0.1) 0%, transparent 70%)',
          animation: 'firePulse 3s ease-in-out infinite',
        }}
      ></div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: ['#ff6b6b', '#ff8e53', '#f093fb'][i % 3],
              animation: `particleFloat ${2 + Math.random() * 2}s ${Math.random() * 3}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl inline-block" style={{ animation: 'fireBounce 1s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(255,100,0,0.6))' }}>
            🔥
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textGlow 2s ease-in-out infinite',
            }}
          >
            {t.dealOfTheDay}
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Image Gallery */}
          <div className="lg:col-span-2 relative">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-50 relative group" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <img
                src={DEAL_PRODUCT.images[currentImage]}
                alt={DEAL_PRODUCT.name}
                className="w-full h-64 md:h-80 object-contain group-hover:scale-105 transition-transform duration-500"
              />
              {/* Nav arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 justify-center">
              {DEAL_PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImage ? 'border-blue-600 scale-110 shadow-lg' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                </button>
              ))}
            </div>

            {/* Discount badge */}
            <div className="absolute -top-2 -left-2 px-5 py-3 rounded-full font-black text-2xl text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                animation: 'badgePulse 1.5s ease-in-out infinite',
              }}
            >
              -{savings}%
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {DEAL_PRODUCT.name}
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {DEAL_PRODUCT.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-5 mb-8">
              <span className="text-3xl text-gray-400 line-through font-semibold">
                ${DEAL_PRODUCT.originalPrice.toFixed(2)}
              </span>
              <span className="text-5xl md:text-6xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ${DEAL_PRODUCT.price.toFixed(2)}
              </span>
            </div>

            {/* Countdown */}
            <div className="flex gap-4 mb-8">
              {[
                { value: pad(timeLeft.hours), label: countdownLabels.hours },
                { value: pad(timeLeft.minutes), label: countdownLabels.minutes },
                { value: pad(timeLeft.seconds), label: countdownLabels.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center min-w-[70px] px-4 py-3 rounded-xl text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    animation: `countdownPulse 1s ease-in-out ${i * 0.3}s infinite`,
                  }}
                >
                  <span className="text-3xl font-black block">{item.value}</span>
                  <span className="text-xs uppercase opacity-90">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                className="flex-1 min-w-[200px] py-5 px-8 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 10px 30px rgba(245,87,108,0.4)',
                  animation: 'btnGlow 2s ease-in-out infinite',
                }}
              >
                <span className="text-2xl" style={{ animation: 'cartShake 0.5s ease-in-out infinite' }}>🛒</span>
                {t.shopThisDeal}
              </button>
              <Link
                href="/catalog"
                className="py-5 px-6 rounded-xl font-bold text-base inline-flex items-center gap-2 border-[3px] border-[#667eea] text-[#667eea] hover:bg-[#667eea] hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                {t.viewAll}
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Stock progress */}
            <div>
              <div className="flex justify-between mb-2 text-sm text-gray-500">
                <span>⚡ {language === 'ru' ? 'Уже купили' : 'Sold'}: {stockPercent}%</span>
                <span>{language === 'ru' ? 'Осталось' : 'Left'}: {stockLeft} шт.</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: `${stockPercent}%`,
                    background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                    animation: 'progressAnim 1.5s ease-out',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
