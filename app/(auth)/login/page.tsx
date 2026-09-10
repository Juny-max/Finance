'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      login(email, password);
      router.push('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    try {
      login(email, pass);
      router.push('/');
    } catch (err) {
      setError('Demo login failed.');
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Branding Header */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <Image
          src="/logo-without text.png"
          alt="Aura Asset Management"
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
        <div>
          <div className="text-sm font-semibold text-navy-900 tracking-wider">AURA ASSET MANAGEMENT</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Private Wealth Portal</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">Sign in to your account</h2>
        <p className="text-sm text-slate-500 mt-2">Access your Aura wealth portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full pl-3 pr-10 text-sm border border-slate-200 rounded-md bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-slate-300 text-navy-900 focus:ring-navy-900" />
            <span className="ml-2 text-sm text-slate-600">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-navy-900 hover:text-navy-800">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-slate-500">Don't have an account? </span>
        <Link href="/signup" className="text-sm font-medium text-navy-900 hover:text-navy-800">
          Create one
        </Link>
      </div>

      <div className="mt-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Demo accounts</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleQuickLogin('kwame@example.com', 'demo1234')}
            className="w-full flex justify-between items-center px-4 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900">Kwame Mensah</span>
            <span className="text-slate-500">Individual</span>
          </button>
          <button
            onClick={() => handleQuickLogin('trustees@gcbprovident.com', 'demo1234')}
            className="w-full flex justify-between items-center px-4 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900">GCB Staff Provident</span>
            <span className="text-slate-500">Institutional</span>
          </button>
        </div>
      </div>
    </div>
  );
}
