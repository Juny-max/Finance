'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  pendingHref: string | null;
  startNavigation: (href: string) => void;
  isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType>({
  pendingHref: null,
  startNavigation: () => {},
  isNavigating: false,
});

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Pathname changed, transition completed
    setPendingHref(null);
  }, [pathname]);

  const startNavigation = (href: string) => {
    if (href !== pathname) {
      setPendingHref(href);
      // Safety timeout after 6 seconds
      const timer = setTimeout(() => {
        setPendingHref((current) => (current === href ? null : current));
      }, 6000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        pendingHref,
        startNavigation,
        isNavigating: Boolean(pendingHref),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationState() {
  return useContext(NavigationContext);
}

