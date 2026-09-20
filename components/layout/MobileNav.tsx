'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  House, 
  Briefcase, 
  Coins, 
  ArrowsLeftRight, 
  DotsThree, 
  CircleNotch,
  FileText,
  Calculator,
  ChartLine,
  Vault,
  Question,
  Gear,
  UserCircle,
  SignOut,
  X,
  ShieldCheck
} from '@phosphor-icons/react';
import { useNavigationState } from '@/lib/navigation';
import { useAuth } from '@/lib/auth';

const PRIMARY_NAV_ITEMS = [
  { name: 'Overview', href: '/', icon: House },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Funds', href: '/funds', icon: Coins },
  { name: 'Transactions', href: '/transactions', icon: ArrowsLeftRight },
];

const MORE_NAV_ITEMS = [
  { name: 'Private Wealth', href: '/private-wealth', icon: Vault, description: 'Bespoke mandates & high-yield paper' },
  { name: 'Statements & Tax', href: '/statements', icon: FileText, description: 'Quarterly valuations & tax certificates' },
  { name: 'Performance Insights', href: '/insights', icon: ChartLine, description: 'Alpha analytics vs Ghana T-Bill' },
  { name: 'Growth Calculator', href: '/calculator', icon: Calculator, description: 'Compound interest projection' },
  { name: 'Help & RM Support', href: '/support', icon: Question, description: 'Connect with your relationship manager' },
  { name: 'Investor Profile', href: '/profile', icon: UserCircle, description: 'Mandates, KYC & beneficiaries' },
  { name: 'Security & Access', href: '/security', icon: Gear, description: '2FA, audit logs & credentials' },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { pendingHref, startNavigation } = useNavigationState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMoreActive = MORE_NAV_ITEMS.some(item => pathname === item.href) || pathname === '/admin';

  const handleNavClick = (href: string) => {
    setIsDrawerOpen(false);
    startNavigation(href);
  };

  const handleLogout = () => {
    setIsDrawerOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200/60 z-30 flex items-center justify-around px-2">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isPending = pendingHref === item.href && !isActive;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all active:scale-95 ${
                isActive 
                  ? 'text-navy-900 font-semibold' 
                  : isPending 
                    ? 'text-gold-600 font-medium' 
                    : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isPending ? (
                <CircleNotch size={20} weight="bold" className="animate-spin text-gold-500" />
              ) : (
                <Icon size={20} weight={isActive ? 'fill' : 'bold'} />
              )}
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all active:scale-95 ${
            isMoreActive 
              ? 'text-navy-900 font-semibold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <DotsThree size={22} weight={isMoreActive ? 'bold' : 'regular'} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Slide-up Drawer for More */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-xl max-h-[82vh] flex flex-col overflow-hidden animate-slide-up z-10">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">All Portal Services</p>
                <p className="text-xs text-slate-500">Wealth management navigation</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="overflow-y-auto p-3 space-y-1 divide-y divide-slate-50">
              <div className="space-y-1">
                {MORE_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-slate-100 text-navy-900 font-medium' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon size={18} weight="bold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Admin & Logout Section */}
              <div className="pt-2 mt-2 space-y-1">
                {(user?.role === 'admin' || user?.id === 'usr_admin' || user?.email === 'admin@auraasset.com') && (
                  <Link
                    href="/admin"
                    onClick={() => handleNavClick('/admin')}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-navy-50/50 text-navy-900 hover:bg-navy-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-md bg-navy-900 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} weight="bold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-navy-900">Admin Operations</p>
                      <p className="text-[10px] text-slate-500">Back-office mandates & KYC queue</p>
                    </div>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <SignOut size={18} weight="bold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">Sign out</p>
                    <p className="text-[10px] text-slate-400">End active session securely</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
