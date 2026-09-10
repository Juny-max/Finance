'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto rounded-lg border p-4 shadow-sm flex items-start gap-3 ${
              toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
              toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-900' :
              'border-blue-200 bg-blue-50 text-blue-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle size={20} weight="fill" className="text-emerald-500" />}
              {toast.type === 'error' && <WarningCircle size={20} weight="fill" className="text-red-500" />}
              {toast.type === 'info' && <Info size={20} weight="fill" className="text-blue-500" />}
            </div>
            <div className="flex-1">
              {toast.title ? (
                <>
                  <p className="text-sm font-medium">{toast.title}</p>
                  {toast.message && <p className="text-xs mt-1 opacity-90">{toast.message}</p>}
                </>
              ) : (
                <p className="text-sm font-medium">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={16} weight="bold" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
