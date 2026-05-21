'use client';

import { categories, Category } from '@/data/products';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CategorySelectorProps {
  selectedCategory: Category | 'all';
}

const categoryIcons: Record<string, string> = {
  chainsaws: '🪚',
  mowers: '🌿',
  construction: '🔨',
  electrical: '⚡',
  plumbing: '🚿',
  bicycles: '🚲',
  fishing: '🎣',
  aircon: '❄️',
};

function CategorySelectorInner({ selectedCategory }: CategorySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const handleCategoryChange = (categoryId: Category | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-base font-bold text-gray-900 mb-3">{t.shopByCategory || 'Категории'}</h3>
      <nav className="space-y-1">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center gap-3 text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-xl">🏪</span>
          <span>{t.allProductsLink || 'Все товары'}</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id as Category)}
            className={`w-full text-left px-3 py-2.5 rounded-md transition-colors flex items-center gap-3 text-sm font-medium ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-xl">{categoryIcons[category.id] || '📦'}</span>
            <span>{t[category.id as keyof typeof t] || category.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function CategorySelector(props: CategorySelectorProps) {
  return (
    <Suspense fallback={<div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-24 mb-3"></div><div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded"></div>)}</div></div>}>
      <CategorySelectorInner {...props} />
    </Suspense>
  );
}
