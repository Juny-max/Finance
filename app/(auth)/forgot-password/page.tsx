'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
        <h2 className="text-2xl font-semibold text-slate-900">Reset your password</h2>
        <p className="text-sm text-slate-500 mt-2">
          Enter your email address and we'll send you a reset link.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 mb-6">
          If an account exists with that email, we've sent a password reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 w-full px-3 text-sm border border-slate-200 rounded-md bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
          >
            Send reset link
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm font-medium text-navy-900 hover:text-navy-800">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
