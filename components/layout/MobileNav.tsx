'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Briefcase, Coins, ArrowsLeftRight, DotsThree, CircleNotch } from '@phosphor-icons/react';
import { useNavigationState } from '@/lib/navigation';

const MOBILE_NAV_ITEMS = [
  { name: 'Overview', href: '/', icon: House },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Funds', href: '/funds', icon: Coins },
  { name: 'Transactions', href: '/transactions', icon: ArrowsLeftRight },
  { name: 'More', href: '#', icon: DotsThree }, // in a real app this opens a drawer
];

export function MobileNav() {
  const pathname = usePathname();
  const { pendingHref, startNavigation } = useNavigationState();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200/60 z-20 flex items-center justify-around px-2">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const isPending = pendingHref === item.href && !isActive;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => startNavigation(item.href)}
            className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all active:scale-95 ${
              isActive 
                ? 'text-navy-900' 
                : isPending 
                  ? 'text-gold-600 font-medium' 
                  : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isPending ? (
              <CircleNotch size={22} weight="bold" className="animate-spin text-gold-500" />
            ) : (
              <Icon size={22} weight={isActive ? 'fill' : 'bold'} />
            )}
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
