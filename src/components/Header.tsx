'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

const navCategories = [
  { label: 'Chainsaws', href: '/catalog?category=chainsaws' },
  { label: 'Lawn Mowers', href: '/catalog?category=mowers' },
  { label: 'Fishing Gear', href: '/catalog?category=fishing' },
  { label: 'Construction', href: '/catalog?category=construction' },
];

export default function Header() {
  const { getItemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top promotional banner */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center text-sm font-medium">
          🎉 Memorial Day Sale — Up to 40% off select equipment &nbsp;
          <Link href="/catalog" className="underline font-semibold hover:text-yellow-300">
            Shop now
          </Link>
        </div>
      </div>

      {/* Main header bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-blue-600 px-3 py-1.5 rounded-lg">
              <span className="text-xl font-bold text-white">AF</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">AussieFarm</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything at AussieFarm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 border-2 border-gray-300 rounded-full text-sm focus:border-blue-600 focus:outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/account" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 text-sm font-medium">
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/login" className="btn-primary">
                  Create Account
                </Link>
              </div>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={24} className="text-gray-700" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Category navigation bar */}
      <div className="border-t border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <div className="w-px h-5 bg-gray-200"></div>
            <Link href="/catalog" className="nav-link">
              All Products
            </Link>
            <div className="w-px h-5 bg-gray-200"></div>
            {navCategories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="nav-link">
                {cat.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-gray-200"></div>
            <Link href="/catalog" className="nav-link text-yellow-600 hover:text-yellow-700 font-semibold">
              🔥 Top Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          {/* Mobile search */}
          <div className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full text-sm focus:border-blue-600 focus:outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full">
                <Search size={18} />
              </button>
            </div>
          </div>
          <nav className="px-4 pb-4 space-y-1">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/catalog" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              All Products
            </Link>
            {navCategories.map((cat) => (
              <Link key={cat.label} href={cat.href} className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-3">
              {!user && (
                <>
                  <Link href="/login" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/login" className="block mt-2 btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                    Create Account
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/account" className="block py-2 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-600 font-medium">
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
