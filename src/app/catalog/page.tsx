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

  // Sync selectedCategory with URL changes
  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    setSelectedCategory(cat || 'all');
  }, [searchParams]);

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-gray-600">Browse our complete range of equipment and gear</p>
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
                  placeholder="Search products..."
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
                <span>Sort</span>
              </button>
            </div>

            {/* Sort Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => { setSortBy('name'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'name' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Name A-Z
                </button>
                <button
                  onClick={() => { setSortBy('price-asc'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-asc' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Price: Low-High
                </button>
                <button
                  onClick={() => { setSortBy('price-desc'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-desc' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Price: High-Low
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setShowFilters(false); }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'rating' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Top Rated
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
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
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="btn-primary"
              >
                Clear Filters
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
