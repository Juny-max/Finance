'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, Bell, UserCircle, SignOut, Question, ShieldCheck } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';

export function TopBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount, markAllNotificationsRead } = useStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <Image
            src="/logo-without text.png"
            alt="Aura Logo"
            width={26}
            height={26}
            className="w-6.5 h-6.5 object-contain"
          />
          <span className="text-sm font-semibold text-navy-900 tracking-wider">AURA</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button onClick={() => window.dispatchEvent(new Event('open-portal-tour'))} title="Replay portal guide" className="hidden text-slate-400 transition-colors hover:text-navy-900 sm:block">
          <Question size={20} weight="bold" />
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MagnifyingGlass size={20} weight="bold" />
        </button>

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors relative"
          >
            <Bell size={20} weight="bold" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="fixed sm:absolute top-14 sm:top-full left-3 sm:left-auto right-3 sm:right-0 mt-1 sm:mt-2 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  <button 
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-navy-900 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-4 text-sm text-slate-500 text-center">
                  You have {unreadCount} unread notifications.
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <UserCircle size={24} weight="fill" className="text-slate-400" />
            <span className="text-sm font-medium hidden sm:block">{user?.name || 'User'}</span>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="fixed sm:absolute top-14 sm:top-full left-auto right-3 sm:right-0 mt-1 sm:mt-2 w-60 max-w-[calc(100vw-1.5rem)] bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  {(user?.role === 'admin' || user?.id === 'usr_admin' || user?.email === 'admin@auraasset.com') && (
                    <Link 
                      href="/admin" 
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                    >
                      <ShieldCheck size={16} weight="bold" className="text-slate-600" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <Link 
                    href="/profile" 
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    href="/security" 
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Security
                  </Link>
                </div>
              
              <div className="border-t border-slate-100 py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <SignOut size={16} weight="bold" />
                  Sign out
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
