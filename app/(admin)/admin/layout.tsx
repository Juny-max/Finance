'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ToastContainer } from '@/components/ui/Toast';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { useAuth } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <NavigationProgress />

      {/* Sidebar (handles desktop static and mobile drawer) */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full lg:ml-60">
        <AdminTopBar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
