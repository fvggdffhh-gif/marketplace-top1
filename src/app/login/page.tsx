'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscountBanner from '@/components/DiscountBanner';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        const success = await login(email, password);
        if (!success) {
          console.error('Login failed');
          return;
        }
      }
      router.push('/account');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DiscountBanner />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegister ? 'Join AussieFarm Marketplace' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm text-primary-800">
            <strong>Demo Mode:</strong> Any email/password will work!
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
