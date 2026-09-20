'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { ToastContainer } from '@/components/ui/Toast';
import { NavigationProgress } from '@/components/ui/NavigationProgress';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <NavigationProgress />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <AdminTopBar />

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
