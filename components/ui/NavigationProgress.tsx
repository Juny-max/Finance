'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationState } from '@/lib/navigation';

export function NavigationProgress() {
  const { isNavigating } = useNavigationState();

  return (
    <AnimatePresence>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-hidden bg-slate-100">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="w-full h-full bg-gradient-to-r from-navy-900 via-gold-500 to-emerald-500 shadow-sm"
          />
        </div>
      )}
    </AnimatePresence>
  );
}

