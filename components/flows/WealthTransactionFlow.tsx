'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, X } from '@phosphor-icons/react';
import { formatGHS } from '@/lib/formatters';
import { useStore } from '@/lib/store';

const ASSETS = [
  { id: 'fixed-income', name: 'Fixed Income', available: 498000 },
  { id: 'equities', name: 'Equities', available: 306000 },
  { id: 'alternatives', name: 'Alternative Investments', available: 142000 },
  { id: 'cis', name: 'Collective Investment Schemes', available: 184500 },
];

export default function WealthTransactionFlow({ type, isOpen, onClose }: { type: 'deposit' | 'withdrawal'; isOpen: boolean; onClose: () => void }) {
  const { showToast } = useStore();
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const total = useMemo(() => Object.values(amounts).reduce((sum, value) => sum + (Number(value) || 0), 0), [amounts]);
  const isWithdrawal = type === 'withdrawal';

  const updateAmount = (id: string, value: string) => setAmounts((previous) => ({ ...previous, [id]: value }));
  const submit = () => {
    if (total <= 0) return;
    setSubmitted(true);
    showToast(`${isWithdrawal ? 'Withdrawal' : 'Investment'} instruction for ${formatGHS(total)} submitted for review.`, 'info');
  };
  const close = () => { setAmounts({}); setSubmitted(false); onClose(); };

  if (!isOpen) return null;
  return <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.button aria-label="Close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 12 }} className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {submitted ? <div className="p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={32} weight="bold" /></div>
          <h2 className="text-xl font-semibold text-slate-900">Instruction submitted</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Your relationship manager will review the requested asset-class allocation and confirm execution.</p>
          <button onClick={close} className="mt-7 h-11 w-full rounded-md bg-navy-900 text-sm font-medium text-white">Done</button>
        </div> : <>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><h2 className="text-lg font-semibold text-slate-900">{isWithdrawal ? 'Request a withdrawal' : 'Deposit for investment'}</h2><p className="mt-0.5 text-xs text-slate-500">Private Wealth portfolio instruction</p></div><button onClick={close} className="rounded-full p-2 text-slate-400 hover:bg-slate-50"><X size={20} /></button></div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"><p className="mb-4 text-sm text-slate-600">{isWithdrawal ? 'Choose the asset classes to sell from and enter an amount for each.' : 'Enter your deposited amount against one or more intended asset classes.'}</p>
            <div className="space-y-3">{ASSETS.map((asset) => <div key={asset.id} className="rounded-lg border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-900">{asset.name}</p>{isWithdrawal && <p className="mt-0.5 text-xs text-slate-500">Available to withdraw: {formatGHS(asset.available)}</p>}</div><div className="relative sm:w-44"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">GH₵</span><input value={amounts[asset.id] || ''} onChange={(e) => updateAmount(asset.id, e.target.value)} type="number" min="0" max={isWithdrawal ? asset.available : undefined} placeholder="0.00" className="h-10 w-full rounded-md border border-slate-200 pl-11 pr-3 text-right text-sm tabular-nums outline-none focus:border-navy-900" /></div></div></div>)}</div>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4"><span className="text-sm font-medium text-slate-600">Total {isWithdrawal ? 'withdrawal' : 'to invest'}</span><span className="text-xl font-semibold tabular-nums text-slate-900">{formatGHS(total)}</span></div>
          </div><div className="flex gap-3 border-t border-slate-100 p-5"><button onClick={close} className="h-11 flex-1 rounded-md border border-slate-200 text-sm font-medium text-slate-700">Cancel</button><button disabled={total <= 0} onClick={submit} className="h-11 flex-1 rounded-md bg-navy-900 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Review & submit</button></div>
        </>}
      </motion.div>
    </div>
  </AnimatePresence>;
}
