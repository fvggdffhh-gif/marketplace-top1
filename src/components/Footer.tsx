import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* About */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 px-3 py-1.5 rounded-lg">
                <span className="text-lg font-bold text-white">AF</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AussieFarm</h3>
                <p className="text-xs text-gray-500">Marketplace</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted Australian marketplace for farming equipment, fishing gear, and construction tools.
            </p>
            <div className="flex gap-2">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/catalog?category=chainsaws" className="hover:text-white transition-colors">Chainsaws</Link></li>
              <li><Link href="/catalog?category=mowers" className="hover:text-white transition-colors">Lawn Mowers</Link></li>
              <li><Link href="/catalog?category=fishing" className="hover:text-white transition-colors">Fishing Gear</Link></li>
              <li><Link href="/catalog?category=construction" className="hover:text-white transition-colors">Construction</Link></li>
              <li><Link href="/catalog?category=electrical" className="hover:text-white transition-colors">Electrical</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors text-yellow-400">Top Deals</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Order Status</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Warranty</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Mail size={14} />
                support@aussiefarm.com.au
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} />
                1800 AUSSIE
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                Sydney, NSW Australia
              </span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AussieFarm Marketplace. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
