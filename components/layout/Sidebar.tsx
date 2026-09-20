'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  House, 
  Briefcase, 
  Vault,
  Coins, 
  ArrowsLeftRight, 
  FileText, 
  Calculator, 
  ChartLine, 
  Question, 
  Gear, 
  UserCircle,
  CircleNotch
} from '@phosphor-icons/react';
import { useNavigationState } from '@/lib/navigation';

const NAV_ITEMS = [
  { name: 'Overview', href: '/', icon: House },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Private Wealth', href: '/private-wealth', icon: Vault },
  { name: 'Funds', href: '/funds', icon: Coins },
  { name: 'Transactions', href: '/transactions', icon: ArrowsLeftRight },
  { name: 'Statements', href: '/statements', icon: FileText },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Insights', href: '/insights', icon: ChartLine },
];

const BOTTOM_NAV_ITEMS = [
  { name: 'Support', href: '/support', icon: Question },
  { name: 'Settings', href: '/security', icon: Gear },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { pendingHref, startNavigation } = useNavigationState();

  return (
    <aside className="w-60 h-screen fixed top-0 left-0 bg-white border-r border-slate-200/60 flex flex-col z-20">
      {/* Branding */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-without text.png"
            alt="Aura Asset Management"
            width={32}
            height={32}
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <div className="text-navy-900 font-semibold tracking-wide text-sm flex items-center gap-1">
              AURA <span className="bg-navy-900 text-white text-[9px] px-1 py-0.5 rounded-sm font-medium">ASSET</span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Wealth Portal</span>
          </div>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isPending = pendingHref === item.href && !isActive;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => startNavigation(item.href)}
                  className={`flex items-center px-6 py-2.5 text-sm transition-all duration-150 active:scale-[0.98] ${
                    isActive 
                      ? 'bg-slate-50 text-navy-900 font-medium border-l-2 border-gold-500' 
                      : isPending
                        ? 'bg-slate-100 text-navy-900 font-medium border-l-2 border-gold-400'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  <Icon 
                    size={20} 
                    weight={isActive ? 'fill' : 'bold'} 
                    className={`mr-3 transition-transform ${isPending ? 'scale-110 text-navy-900' : ''}`} 
                  />
                  <span className="flex-1">{item.name}</span>
                  {isPending && (
                    <CircleNotch size={16} weight="bold" className="animate-spin text-gold-500 shrink-0 ml-2" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 mb-4 px-6">
          <div className="h-px bg-slate-100" />
        </div>

        <ul className="space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isPending = pendingHref === item.href && !isActive;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => startNavigation(item.href)}
                  className={`flex items-center px-6 py-2.5 text-sm transition-all duration-150 active:scale-[0.98] ${
                    isActive 
                      ? 'bg-slate-50 text-navy-900 font-medium border-l-2 border-gold-500' 
                      : isPending
                        ? 'bg-slate-100 text-navy-900 font-medium border-l-2 border-gold-400'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  <Icon 
                    size={20} 
                    weight={isActive ? 'fill' : 'bold'} 
                    className={`mr-3 transition-transform ${isPending ? 'scale-110 text-navy-900' : ''}`} 
                  />
                  <span className="flex-1">{item.name}</span>
                  {isPending && (
                    <CircleNotch size={16} weight="bold" className="animate-spin text-gold-500 shrink-0 ml-2" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
