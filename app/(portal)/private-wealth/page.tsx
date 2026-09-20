'use client';

import { useState } from 'react';
import { ArrowDown, Plus, Wallet } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { formatGHS } from '@/lib/formatters';
import WealthTransactionFlow from '@/components/flows/WealthTransactionFlow';
import { useAuth } from '@/lib/auth';

const positions = [
  ['Fixed Income', 'Government securities, corporate notes & deposits', 498000, '39.0%', '#0B192C'],
  ['Equities', 'Ghana and international listed equities', 306000, '23.9%', '#059669'],
  ['Alternative Investments', 'Private credit & real assets', 142000, '11.1%', '#C4960A'],
  ['Collective Investment Schemes', 'Managed funds and unit trusts', 184500, '14.4%', '#64748B'],
];
const deductions = [['Cash balance', 82450, 'Available'], ['Accrued management fees', -4850, 'Payable'], ['Other accrued expenses', -1600, 'Payable']];

export default function PrivateWealthPage() {
  const { user } = useAuth();
  const [flow, setFlow] = useState<'deposit' | 'withdrawal' | null>(null);
  const hasExistingPortfolio = user?.id === 'usr_kwame' || user?.id === 'usr_gcb';
  const grossAssets = positions.reduce((sum, row) => sum + Number(row[2]), 0) + 82450;
  const totalValue = hasExistingPortfolio ? grossAssets - 4850 - 1600 : 0;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-7 pb-12">
    <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2"><span className="rounded bg-gold-50 px-2 py-1 text-[10px] font-bold tracking-wider text-gold-700">PRIVATE WEALTH</span><span className="text-xs text-slate-500">Discretionary portfolio</span></div><h1 className="text-3xl font-light tracking-tight text-slate-900">Portfolio overview</h1><p className="mt-2 text-sm text-slate-500">Consolidated view across managed asset classes.</p></div><div data-tour="wealth-actions" className="flex gap-3"><button onClick={() => setFlow('withdrawal')} className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700"><ArrowDown size={16} weight="bold" /> Withdraw</button><button onClick={() => setFlow('deposit')} className="flex h-10 items-center gap-2 rounded-md bg-navy-900 px-4 text-sm font-medium text-white"><Plus size={16} weight="bold" /> Deposit & allocate</button></div></div>
    <div data-tour="wealth-summary" className="rounded-xl bg-navy-900 p-7 text-white"><p className="text-xs font-medium uppercase tracking-wider text-slate-300">Total portfolio value</p><p className="mt-2 text-4xl font-light tabular-nums">{formatGHS(totalValue)}</p><div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-4 text-sm">{hasExistingPortfolio ? <><span className="text-slate-300">As at 09 Sep 2026</span><span><strong className="font-medium">+12.8%</strong> <span className="text-slate-300">portfolio return, YTD</span></span></> : <span className="text-slate-300">Your application is pending approval. Deposit funds once your mandate is active.</span>}</div></div>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Invested assets" value={formatGHS(hasExistingPortfolio ? 1130500 : 0)} /><Metric label="Cash balance" value={formatGHS(hasExistingPortfolio ? 82450 : 0)} detail="Available for deployment" /><Metric label="Fees & expenses payable" value={formatGHS(hasExistingPortfolio ? 6450 : 0)} detail="Accrued to date" /></div>
    <section className="overflow-hidden rounded-lg border border-slate-200/60 bg-white"><div className="flex items-center gap-2 border-b border-slate-100 p-6"><Wallet size={20} className="text-gold-600" weight="duotone" /><div><h2 className="font-semibold text-slate-900">Asset-class allocation</h2><p className="mt-0.5 text-sm text-slate-500">Market value of managed investments</p></div></div><div className="divide-y divide-slate-100">{positions.map(([name, detail, value, allocation, color]) => <div key={String(name)} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: String(color) }} /><div className="flex-1"><p className="font-medium text-slate-900">{name}</p><p className="text-sm text-slate-500">{detail}</p></div><span className="text-sm font-medium text-slate-500">{hasExistingPortfolio ? allocation : '—'}</span><span className="min-w-32 text-right font-medium tabular-nums text-slate-900">{formatGHS(hasExistingPortfolio ? Number(value) : 0)}</span></div>)}</div></section>
    <section className="rounded-lg border border-slate-200/60 bg-white p-6"><h2 className="font-semibold text-slate-900">Cash, fees & payables</h2><div className="mt-4 divide-y divide-slate-100">{deductions.map(([label, value, status]) => <div key={String(label)} className="flex items-center justify-between py-3 text-sm"><span className="text-slate-600">{label} <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">{status}</span></span><span className="font-medium tabular-nums text-slate-900">{formatGHS(hasExistingPortfolio ? Math.abs(Number(value)) : 0)}</span></div>)}</div></section>
    <WealthTransactionFlow type={flow || 'deposit'} isOpen={!!flow} onClose={() => setFlow(null)} />
  </motion.div>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) { return <div className="rounded-lg border border-slate-200/60 bg-white p-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xl font-light tabular-nums text-slate-900">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>; }
