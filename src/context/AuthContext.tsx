'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: UserProfile & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('name, phone, address')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const profileData = data as { name: string; phone: string | null; address: string | null };
        setUser({
          name: profileData.name,
          email: supabaseUser?.email || '',
          phone: profileData.phone || undefined,
          address: profileData.address || undefined,
        });
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return false;
    }

    return !!data.session;
  };

  const register = async (userData: UserProfile & { password: string }): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (error) {
      console.error('Register error:', error.message);
      throw error;
    }

    // Update profile with additional info
    if (data.user) {
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          phone: userData.phone,
          address: userData.address,
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError.message);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabaseUser) return;

    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
      })
      .eq('id', supabaseUser.id);

    if (error) {
      console.error('Update profile error:', error.message);
      throw error;
    }

    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, session, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
