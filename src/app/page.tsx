'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import Link from 'next/link';
import { categories, products } from '@/data/products';
import { ArrowRight, Truck, ShieldCheck, Headphones, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const categoryIcons: Record<string, string> = {
  chainsaws: '🪚',
  mowers: '🌿',
  fishing: '🎣',
  construction: '🔨',
};

export default function Home() {
  const featuredProducts = products.filter(p => p.rating >= 4.7).slice(0, 6);
  const dealProducts = products.filter(p => p.original_price).slice(0, 6);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <DiscountBanner />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=500&fit=crop&q=80"
              alt="Aussie landscape"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-xl">
              <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                MEMORIAL DAY SALE
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Australia&apos;s Trusted<br />Equipment Marketplace
              </h1>
              <p className="text-gray-200 mb-6 text-lg">
                Quality chainsaws, mowers, fishing gear &amp; construction tools delivered to your door.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/catalog" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <Link href="/catalog" className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className="category-pill"
              >
                <span>{categoryIcons[cat.id] || '📦'}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deal of the Day Banner */}
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <span className="text-red-600 font-bold text-sm uppercase tracking-wide">Deal of the Day</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                {dealProducts[0]?.name}
              </h2>
              <p className="text-gray-600 mb-4">{dealProducts[0]?.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">${dealProducts[0]?.price.toFixed(2)}</span>
                {dealProducts[0]?.original_price && (
                  <span className="text-lg text-gray-500 line-through">${dealProducts[0]?.original_price.toFixed(2)}</span>
                )}
                {dealProducts[0]?.original_price && (
                  <span className="bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded">
                    Save ${(dealProducts[0].original_price - dealProducts[0].price).toFixed(2)}
                  </span>
                )}
              </div>
              <Link href={`/catalog?category=${dealProducts[0]?.category}`} className="btn-yellow mt-4 inline-block">
                Shop This Deal
              </Link>
            </div>
            <div className="w-full md:w-72 h-48 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={dealProducts[0]?.image}
                alt={dealProducts[0]?.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 200%22><rect fill=%22%23f3f4f6%22 width=%22300%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2248%22>🪚</text></svg>'; }}
              />
            </div>
          </div>
        </section>

        {/* Top Deals Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title">Top Deals</h2>
              <p className="text-gray-500 text-sm mt-1">Best prices on select equipment</p>
            </div>
            <Link href="/catalog" className="link-chevron">
              View all deals <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="section-title">Featured Products</h2>
                <p className="text-gray-500 text-sm mt-1">Hand-picked by our team</p>
              </div>
              <Link href="/catalog" className="link-chevron">
                Shop all products <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="section-title">Top Rated</h2>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-gray-500 text-sm">Highest customer ratings</span>
              </div>
            </div>
            <Link href="/catalog" className="link-chevron">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Services / Trust Bar */}
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Truck className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                  <p className="text-gray-500 text-sm mt-1">Free shipping on orders over $500 across Australia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <ShieldCheck className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
                  <p className="text-gray-500 text-sm mt-1">All products backed by manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Headphones className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Support</h3>
                  <p className="text-gray-500 text-sm mt-1">Our team is here to help 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Join Thousands of Happy Customers</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Sign up today and get 10% off your first order
            </p>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-blue-100 italic text-sm">&quot;Best selection of equipment I&apos;ve found online. Fast delivery and great prices!&quot;</p>
            <p className="text-white font-semibold text-sm mt-1">— John M., Queensland</p>
            <Link href="/login" className="btn-yellow mt-6 inline-block px-8 py-3">
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
