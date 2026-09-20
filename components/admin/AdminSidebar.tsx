'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  House,
  ShieldCheck,
  ArrowsLeftRight,
  Users,
  Coins,
  UserCircle,
  SignOut,
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

const ADMIN_NAV_ITEMS = [
  { name: 'Overview', href: '/admin', icon: House },
  { name: 'KYC & Onboarding', href: '/admin/onboarding', icon: ShieldCheck, hasAppBadge: true },
  { name: 'Settlement Queue', href: '/admin/transactions', icon: ArrowsLeftRight, hasTxnBadge: true },
  { name: 'Client Registry', href: '/admin/clients', icon: Users },
  { name: 'Fund Pricing', href: '/admin/funds', icon: Coins },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { applications, allTransactions } = useStore();
  const { logout, user } = useAuth();

  const pendingAppsCount = applications.filter((a) => a.status === 'pending_review').length;
  const pendingTxnsCount = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  ).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-60 h-screen fixed top-0 left-0 bg-white border-r border-slate-200/60 flex flex-col z-20 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200/60">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-without text.png"
            alt="Aura Asset Management"
            width={32}
            height={32}
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <div className="text-navy-900 font-semibold tracking-wide text-sm flex items-center gap-1.5">
              AURA{' '}
              <span className="bg-slate-100 text-slate-800 text-[9px] px-1.5 py-0.5 rounded font-medium">
                ADMIN
              </span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">
              Management
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-2">
          Navigation
        </div>
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const badgeCount = item.hasAppBadge
              ? pendingAppsCount
              : item.hasTxnBadge
              ? pendingTxnsCount
              : 0;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      weight={isActive ? 'fill' : 'regular'}
                      className={isActive ? 'text-slate-900' : 'text-slate-400'}
                    />
                    <span>{item.name}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span className="text-slate-600 bg-slate-200/80 rounded-full text-[11px] font-medium px-2 py-0.5">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile & Standard Logout */}
      <div className="p-3 border-t border-slate-200/60 space-y-2.5">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <UserCircle size={28} weight="fill" className="text-slate-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-slate-800 text-xs truncate">
              {user?.name || 'Audrey Mensah'}
            </span>
            <span className="text-[11px] text-slate-400 truncate">Compliance</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 rounded-md transition-colors"
        >
          <SignOut size={15} weight="bold" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
