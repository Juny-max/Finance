'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  House,
  ShieldCheck,
  ArrowsLeftRight,
  Users,
  Coins,
  ArrowSquareOut,
  UserCircle,
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';

const ADMIN_NAV_ITEMS = [
  { name: 'Ops Overview', href: '/admin', icon: House },
  { name: 'KYC & Onboarding', href: '/admin/onboarding', icon: ShieldCheck, hasAppBadge: true },
  { name: 'Settlement Queue', href: '/admin/transactions', icon: ArrowsLeftRight, hasTxnBadge: true },
  { name: 'Client Registry', href: '/admin/clients', icon: Users },
  { name: 'Daily NAV Desk', href: '/admin/funds', icon: Coins },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { applications, allTransactions } = useStore();

  const pendingAppsCount = applications.filter((a) => a.status === 'pending_review').length;
  const pendingTxnsCount = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  ).length;

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-[#0B192C] border-r border-slate-800 flex flex-col z-30 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80">
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
            <div className="text-white font-semibold tracking-wide text-sm flex items-center gap-1.5">
              AURA{' '}
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-1 py-0.5 rounded font-medium tracking-wider">
                OPS DESK
              </span>
            </div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider">
              Compliance &amp; Admin
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-3 mb-2">
          Operations &amp; Control
        </div>
        <ul className="space-y-0.5">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-800/70 text-white font-medium border-l-2 border-amber-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      weight={isActive ? 'fill' : 'bold'}
                      className={isActive ? 'text-white' : 'text-slate-400'}
                    />
                    <span>{item.name}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span className="text-slate-900 bg-white/90 rounded text-[11px] font-semibold px-1.5">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Switcher & Profile */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <ArrowSquareOut size={15} weight="bold" />
          <span>Switch to Investor Portal</span>
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-2 text-xs">
          <UserCircle size={26} weight="fill" className="text-slate-500 shrink-0" />
          <div className="flex flex-col truncate">
            <span className="font-medium text-slate-300 truncate">Audrey Mensah</span>
            <span className="text-[10px] text-slate-500 truncate">Head of Compliance</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
