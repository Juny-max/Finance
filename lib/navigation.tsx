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
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // When pathname changes, navigation has finished
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPendingHref(null);
  }, [pathname]);

  const startNavigation = (href: string) => {
    // Discard empty, hash/anchor, or identical route clicks
    if (!href || href === '#' || href.startsWith('#') || href === pathname) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPendingHref(href);

    // Safety timeout: dismiss after 1.2s max if no pathname change occurs
    timerRef.current = setTimeout(() => {
      setPendingHref(null);
      timerRef.current = null;
    }, 1200);
  };

  const isNavigating = Boolean(pendingHref && pendingHref !== pathname);

  return (
    <NavigationContext.Provider
      value={{
        pendingHref: isNavigating ? pendingHref : null,
        startNavigation,
        isNavigating,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationState() {
  return useContext(NavigationContext);
}

