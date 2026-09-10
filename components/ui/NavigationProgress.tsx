'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationState } from '@/lib/navigation';

export function NavigationProgress() {
  const { isNavigating } = useNavigationState();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let trickleTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;
    let resetTimer: NodeJS.Timeout;

    if (isNavigating) {
      setVisible(true);
      setProgress(25);
      trickleTimer = setTimeout(() => {
        setProgress(75);
      }, 150);
    } else if (visible) {
      // Page loaded: complete bar to 100% then fade out and unmount
      setProgress(100);
      finishTimer = setTimeout(() => {
        setVisible(false);
        resetTimer = setTimeout(() => {
          setProgress(0);
        }, 200);
      }, 250);
    }

    return () => {
      clearTimeout(trickleTimer);
      clearTimeout(finishTimer);
      clearTimeout(resetTimer);
    };
  }, [isNavigating, visible]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-hidden bg-slate-100/60">
      <motion.div
        className="h-full bg-gradient-to-r from-navy-900 via-gold-500 to-emerald-500 shadow-sm"
        initial={{ width: '0%', opacity: 1 }}
        animate={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
        transition={{
          width: { 
            duration: progress === 100 ? 0.15 : 0.35, 
            ease: 'easeOut' 
          },
          opacity: { 
            duration: 0.2, 
            ease: 'easeIn', 
            delay: progress === 100 ? 0.12 : 0 
          },
        }}
      />
    </div>
  );
}

