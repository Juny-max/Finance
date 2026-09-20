'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, CircleNotch, CheckCircle } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      login(email, password);
      setTimeout(() => {
        router.push('/');
      }, 350);
    } catch (err) {
      setIsLoading(false);
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleFillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setSelectedDemo(demoEmail);
  };

  return (
    <div className="w-full">
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
            onChange={(e) => {
              setEmail(e.target.value);
              setSelectedDemo(null);
            }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setSelectedDemo(null);
              }}
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
          disabled={isLoading}
          className="w-full h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-85 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <>
              <CircleNotch size={18} weight="bold" className="animate-spin text-gold-400" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-slate-500">Don't have an account? </span>
        <Link href="/signup" className="text-sm font-medium text-navy-900 hover:text-navy-800">
          Create one
        </Link>
      </div>

      <div className="mt-10">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500 text-xs font-medium uppercase tracking-wider">Demo accounts</span>
          </div>
        </div>
        
        <p className="text-xs text-slate-400 text-center mt-2 mb-4">Tap an account to autofill credentials into the form:</p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleFillDemo('kwame@example.com', 'demo1234')}
            className={`w-full flex justify-between items-center px-4 py-2.5 text-sm border rounded-md transition-all active:scale-[0.99] text-left ${
              selectedDemo === 'kwame@example.com'
                ? 'border-gold-500 bg-gold-50/40 text-navy-900 ring-1 ring-gold-400'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div>
              <span className="font-medium text-slate-900 block">Kwame Mensah</span>
              <span className="text-xs text-slate-500">kwame@example.com</span>
            </div>
            {selectedDemo === 'kwame@example.com' ? (
              <span className="text-xs font-semibold text-gold-700 flex items-center gap-1 bg-gold-100/60 px-2 py-0.5 rounded">
                <CheckCircle size={14} weight="fill" className="text-gold-600" />
                Filled
              </span>
            ) : (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Individual</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo('trustees@gcbprovident.com', 'demo1234')}
            className={`w-full flex justify-between items-center px-4 py-2.5 text-sm border rounded-md transition-all active:scale-[0.99] text-left ${
              selectedDemo === 'trustees@gcbprovident.com'
                ? 'border-gold-500 bg-gold-50/40 text-navy-900 ring-1 ring-gold-400'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div>
              <span className="font-medium text-slate-900 block">GCB Staff Provident</span>
              <span className="text-xs text-slate-500">trustees@gcbprovident.com</span>
            </div>
            {selectedDemo === 'trustees@gcbprovident.com' ? (
              <span className="text-xs font-semibold text-gold-700 flex items-center gap-1 bg-gold-100/60 px-2 py-0.5 rounded">
                <CheckCircle size={14} weight="fill" className="text-gold-600" />
                Filled
              </span>
            ) : (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Institutional</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo('admin@auraasset.com', 'demo1234')}
            className={`w-full flex justify-between items-center px-4 py-2.5 text-sm border rounded-md transition-all active:scale-[0.99] text-left ${
              selectedDemo === 'admin@auraasset.com'
                ? 'border-amber-500 bg-amber-50/50 text-navy-900 ring-1 ring-amber-400'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div>
              <span className="font-medium text-slate-900 block">Audrey Mensah</span>
              <span className="text-xs text-slate-500">admin@auraasset.com</span>
            </div>
            {selectedDemo === 'admin@auraasset.com' ? (
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 bg-amber-100/60 px-2 py-0.5 rounded">
                <CheckCircle size={14} weight="fill" className="text-amber-600" />
                Filled
              </span>
            ) : (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">Operations / Admin</span>
            )}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <Link
            href="/admin"
            className="text-xs font-semibold text-navy-900 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>Open Back-Office Operations Desk directly</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
