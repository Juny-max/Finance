'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, Bell, SignOut, List } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

interface AdminTopBarProps {
  onMenuToggle?: () => void;
}

export function AdminTopBar({ onMenuToggle }: AdminTopBarProps) {
  const router = useRouter();
  const { applications, allTransactions } = useStore();
  const { logout } = useAuth();

  const pendingApps = applications.filter((a) => a.status === 'pending_review').length;
  const pendingTxns = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  ).length;
  const totalActionItems = pendingApps + pendingTxns;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      {/* Left: Mobile Toggle & Section Label */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <List size={22} weight="bold" />
        </button>
        <span className="text-sm font-medium text-slate-700">Admin Console</span>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3.5">
        {/* Search */}
        <div className="relative hidden md:block">
          <MagnifyingGlass
            size={14}
            weight="bold"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-44 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 transition-colors"
          />
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
          title="Pending actions"
        >
          <Bell size={18} weight="bold" />
          {totalActionItems > 0 && (
            <span className="absolute 0.5 top-0.5 right-0.5 min-w-[15px] h-3.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-semibold rounded-full px-1 leading-none">
              {totalActionItems}
            </span>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Standard Sign Out Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
          title="Sign out of admin session"
        >
          <SignOut size={15} weight="bold" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
