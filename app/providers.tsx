'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth';
import { StoreProvider } from '@/lib/store';
import { NavigationProvider } from '@/lib/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
