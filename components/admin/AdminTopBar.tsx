'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MagnifyingGlass, 
  Bell, 
  ArrowSquareOut,
  CalendarCheck,
  ShieldCheck
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';

export function AdminTopBar() {
  const { applications, allTransactions } = useStore();

  const pendingApps = applications.filter((a) => a.status === 'pending_review').length;
  const pendingTxns = allTransactions.filter((t) => t.status === 'processing' || t.status === 'pending').length;
  const totalActionItems = pendingApps + pendingTxns;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Mobile Brand / Left Details */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="lg:hidden flex items-center gap-2">
          <Image
            src="/logo-without text.png"
            alt="Aura Logo"
            width={26}
            height={26}
            className="w-6.5 h-6.5 object-contain"
          />
          <span className="text-sm font-semibold text-navy-900 tracking-wider">AURA OPS</span>
        </Link>

        {/* Settlement Cycle Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
          <CalendarCheck size={16} weight="bold" className="text-navy-900" />
          <span>Settlement Date: <strong className="text-slate-800 font-semibold">20 Sep 2026</strong></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            T+2 Mandatory SEC Clearing
          </span>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="hidden md:flex items-center relative">
          <MagnifyingGlass size={16} weight="bold" className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, ID, or ref..."
            className="h-9 pl-9 pr-3 text-xs border border-slate-200 rounded-md w-60 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900"
          />
        </div>

        {/* Pending Alerts Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/70 rounded-md text-xs font-medium">
          <Bell size={16} weight="bold" className="text-amber-600" />
          <span>{totalActionItems} Action Items</span>
        </div>

        {/* Switch to Investor Portal Link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-navy-900 bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-md border border-navy-200/60 transition-colors"
        >
          <span>Investor Portal</span>
          <ArrowSquareOut size={14} weight="bold" />
        </Link>
      </div>
    </header>
  );
}
