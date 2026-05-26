'use client';

import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useDiscount } from '@/context/DiscountContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingCart, Star, CheckCircle, XCircle, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product & { images?: string[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { discountApplied, getDiscountedPrice } = useDiscount();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Get images array: use product.images or fallback to single image
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  const discountedPrice = discountApplied ? getDiscountedPrice(product.price) : product.price;
  const savings = product.originalPrice ? Math.round((product.originalPrice - product.price) * 100) / 100 : 0;
  const discountPercent = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  const categoryIcons: Record<string, string> = {
    chainsaws: '🪚',
    mowers: '🌿',
    fishing: '🎣',
    construction: '🔨',
    aircon: '❄️',
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-card group flex flex-col h-full">
      {/* Image Gallery */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {/* Main Image */}
        {!imageError && images[currentImage] ? (
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-6xl">{categoryIcons[product.category] || '📦'}</span>
          </div>
        )}

        {/* Navigation Arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {/* Thumbnail dots - show if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentImage ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {t.save} {discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
          {discountApplied && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Tag size={10} />
              Extra 20% off
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews})
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price */}
        <div className="mb-3">
          {savings > 0 && (
            <span className="text-red-600 text-xs font-semibold mb-0.5 block">
              {t.save} ${savings.toFixed(2)}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.originalPrice && product.price < product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock & Add to Cart */}
        {product.inStock ? (
          <>
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium mb-2">
              <CheckCircle size={12} />
              {t.available}
            </span>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: discountedPrice, image: product.image })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              {t.addToCart}
            </button>
          </>
        ) : (
          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
            <XCircle size={12} />
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
}
