'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import ProductCard from '@/components/ProductCard';
import CategorySelector from '@/components/CategorySelector';
import { products, categories, Category } from '@/data/products';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

function CatalogSearch() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'rating'>('rating');
  const [showDealsOnly, setShowDealsOnly] = useState(false);

  // Sync selectedCategory with URL changes
  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    setSelectedCategory(cat || 'all');
  }, [searchParams]);

  const dealProducts = products.filter(p => p.original_price);

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => !showDealsOnly || p.original_price)
    .filter(p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог товаров</h1>
        <p className="text-gray-600">Весь ассортимент оборудования и инструментов</p>
      </div>

      {/* Deals Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white p-6 shadow-xl">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl animate-bounce">🏷️</span>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide">Товары по акции</h2>
              <p className="text-white/80 text-sm">{dealProducts.length} товаров со скидкой</p>
            </div>
          </div>
          <button
            onClick={() => setShowDealsOnly(!showDealsOnly)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
              showDealsOnly
                ? 'bg-white text-red-600 shadow-lg'
                : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/50'
            }`}
          >
            {showDealsOnly ? '✓ Показать все товары' : '🔥 Только акции'}
          </button>
        </div>

        {/* Deals preview row */}
        <div className="relative z-10 mt-4 flex gap-3 overflow-x-auto pb-2">
          {dealProducts.slice(0, 6).map((p) => {
            const savings = Math.round(((p.original_price! - p.price) / p.original_price!) * 100);
            return (
              <div key={p.id} className="flex-shrink-0 w-28 bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                <div className="text-2xl mb-1">-{savings}%</div>
                <div className="text-xs font-medium truncate">${p.price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0">
          <CategorySelector selectedCategory={selectedCategory} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal size={18} />
                <span>Сортировка</span>
              </button>
            </div>

            {/* Sort Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => { setSortBy('name'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  A-Я
                </button>
                <button
                  onClick={() => { setSortBy('price-asc'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-asc' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Дешевле
                </button>
                <button
                  onClick={() => { setSortBy('price-desc'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-desc' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Дороже
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'rating' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Рейтинг
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">Товары не найдены</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setShowDealsOnly(false); }}
                className="btn-primary"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Catalog() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DiscountBanner />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <CatalogSearch />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
