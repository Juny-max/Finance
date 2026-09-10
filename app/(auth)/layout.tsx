'use client';

import React from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 flex-col justify-center px-16 relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <div className="mb-12">
            <div className="text-white font-semibold tracking-wider text-base">
              AURA ASSET MANAGEMENT
            </div>
            <div className="text-[10px] text-gold-400 uppercase tracking-widest font-medium mt-1">
              Private Wealth & Advisory
            </div>
          </div>
          <h1 className="text-4xl text-white font-light leading-tight mb-6">
            Your portfolio. Your investments. Your financial future.
          </h1>
          <p className="text-slate-400 text-sm mt-12">
            Licensed by the Securities & Exchange Commission, Ghana
          </p>
        </div>
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <Image
              src="/logo-without text.png"
              alt="Aura Asset Management"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
