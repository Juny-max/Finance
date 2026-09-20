'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, CheckCircle, X } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';

const TOUR_STEPS = [
  { title: 'Welcome to your wealth portal', text: 'Use the quick actions to add funds, request a withdrawal, switch funds, or access statements.', path: '/', target: '[data-tour="quick-actions"]' },
  { title: 'Track unit trust investments', text: 'Portfolio provides performance, holdings, NAV-based valuation and the standard invest or withdrawal journey.', path: '/portfolio', target: '[data-tour="portfolio-actions"]' },
  { title: 'Explore Private Wealth', text: 'Private Wealth consolidates Fixed Income, Equities, Alternatives, Collective Investment Schemes, cash, fees and expenses.', path: '/private-wealth', target: '[data-tour="wealth-summary"]' },
  { title: 'Submit allocation instructions', text: 'Private Wealth clients can split a deposit or withdrawal across one or more asset classes before submitting.', path: '/private-wealth', target: '[data-tour="wealth-actions"]' },
];

export function PortalTour() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);
  const storageKey = `aura_tour_complete_${user?.id || 'visitor'}`;

  useEffect(() => {
    if (localStorage.getItem(storageKey) !== 'true') { setStep(0); setOpen(true); router.push(TOUR_STEPS[0].path); }
    const start = () => { setStep(0); setOpen(true); router.push(TOUR_STEPS[0].path); };
    window.addEventListener('open-portal-tour', start);
    return () => window.removeEventListener('open-portal-tour', start);
  }, [router, storageKey]);

  useEffect(() => {
    if (!open) return;
    const updateSpotlight = () => {
      const element = document.querySelector(TOUR_STEPS[step].target);
      if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); setSpotlight(element.getBoundingClientRect()); }
      else setSpotlight(null);
    };
    const timeout = window.setTimeout(updateSpotlight, 250);
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, true);
    return () => { window.clearTimeout(timeout); window.removeEventListener('resize', updateSpotlight); window.removeEventListener('scroll', updateSpotlight, true); };
  }, [open, pathname, step]);

  const close = () => { localStorage.setItem(storageKey, 'true'); setOpen(false); };
  const next = () => {
    if (step === TOUR_STEPS.length - 1) close();
    else { const nextStep = step + 1; setStep(nextStep); router.push(TOUR_STEPS[nextStep].path); }
  };
  if (!open) return null;
  const current = TOUR_STEPS[step];
  return <AnimatePresence>
    {spotlight && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden className="pointer-events-none fixed z-50 rounded-lg border-2 border-gold-400" style={{ top: spotlight.top - 6, left: spotlight.left - 6, width: spotlight.width + 12, height: spotlight.height + 12, boxShadow: '0 0 0 9999px rgba(11, 25, 44, 0.62)' }} />}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-5 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:right-6">
      <div className="flex items-start justify-between bg-navy-900 px-5 py-4 text-white"><div className="flex gap-3"><Image src="/logo-without text.png" alt="Aura Asset Management" width={26} height={26} className="mt-0.5 h-[26px] w-[26px] object-contain" /><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-300">Portal guide</p><h2 className="mt-1 text-base font-semibold">{current.title}</h2></div></div><button onClick={close} aria-label="Close guide" className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"><X size={18} /></button></div>
      <div className="p-5"><p className="text-sm leading-6 text-slate-600">{current.text}</p><div className="mt-5 flex items-center gap-1.5">{TOUR_STEPS.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === step ? 'w-6 bg-gold-500' : 'w-1.5 bg-slate-200'}`} />)}<span className="ml-auto text-xs text-slate-400">{step + 1} of {TOUR_STEPS.length}</span></div></div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3"><button onClick={close} className="text-sm font-medium text-slate-500 hover:text-slate-900">Skip tour</button><button onClick={next} className="inline-flex h-10 items-center gap-2 rounded-md bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800">{step === TOUR_STEPS.length - 1 ? <><CheckCircle size={17} weight="fill" /> Finish</> : <>Next <ArrowRight size={17} weight="bold" /></>}</button></div>
    </motion.div>
  </AnimatePresence>;
}
