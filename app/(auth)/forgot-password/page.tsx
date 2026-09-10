'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CircleNotch } from '@phosphor-icons/react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <div className="w-full">
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
            disabled={isLoading}
            className="w-full h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-85 cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <CircleNotch size={18} weight="bold" className="animate-spin text-gold-400" />
                <span>Sending link...</span>
              </>
            ) : (
              <span>Send reset link</span>
            )}
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
