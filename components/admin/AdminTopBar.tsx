'use client';

import React from 'react';
import Link from 'next/link';
import { MagnifyingGlass, Bell, ArrowSquareOut } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';

export function AdminTopBar() {
  const { applications, allTransactions } = useStore();

  const pendingApps = applications.filter((a) => a.status === 'pending_review').length;
  const pendingTxns = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  ).length;
  const totalActionItems = pendingApps + pendingTxns;

  return (
    <header className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left: Section Label */}
      <span className="text-sm text-slate-500">Operations Desk</span>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <MagnifyingGlass
            size={14}
            weight="bold"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search clients, refs..."
            className="h-8 w-48 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 transition-colors"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-1 text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={18} weight="bold" />
          {totalActionItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold rounded-full px-1 leading-none">
              {totalActionItems}
            </span>
          )}
        </button>

        {/* Client Portal Link */}
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-navy-900 hover:text-navy-800 transition-colors"
        >
          <ArrowSquareOut size={14} weight="bold" />
          <span>Client Portal</span>
        </Link>
      </div>
    </header>
  );
}
