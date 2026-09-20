'use client';

import React, { useState } from 'react';
import { 
  Coins, 
  PencilSimple, 
  Check, 
  X, 
  TrendUp, 
  TrendDown, 
  FileText, 
  CalendarCheck,
  WarningCircle,
  Clock
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS } from '@/lib/formatters';

export default function AdminFundsPage() {
  const { funds, updateFundNav } = useStore();
  const [editingFundId, setEditingFundId] = useState<string | null>(null);
  const [newNavInput, setNewNavInput] = useState<string>('');
  const [newPercentInput, setNewPercentInput] = useState<string>('');

  const handleStartEdit = (fundId: string, currentNav: number) => {
    setEditingFundId(fundId);
    setNewNavInput(currentNav.toFixed(4));
    setNewPercentInput('');
  };

  const handleSaveNav = (fundId: string) => {
    const parsedNav = parseFloat(newNavInput);
    if (isNaN(parsedNav) || parsedNav <= 0) {
      alert('Please enter a valid NAV unit price.');
      return;
    }
    const parsedPercent = newPercentInput ? parseFloat(newPercentInput) : undefined;
    updateFundNav(fundId, parsedNav, parsedPercent);
    setEditingFundId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily NAV & Fund Valuation Desk</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-900 rounded-full">
              Valuation Desk Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish daily unit prices (Net Asset Value) across Collective Investment Schemes in compliance with SEC Ghana valuation rules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200/70 text-amber-900 px-3 py-2 rounded-lg">
          <Clock size={16} weight="bold" className="text-amber-700" />
          <span>Daily Pricing Cut-off: <strong>10:00 AM GMT</strong></span>
        </div>
      </div>

      {/* Funds Table */}
      <div className="grid grid-cols-1 gap-6">
        {funds.map((fund) => {
          const isEditing = editingFundId === fund.id;

          return (
            <div
              key={fund.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-5"
            >
              {/* Top Row: Fund Title & Quick Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fund.color }}></span>
                    <h2 className="text-lg font-bold text-slate-900">{fund.name}</h2>
                    <span className="text-xs font-mono font-medium text-slate-400">({fund.shortName})</span>
                  </div>
                  <p className="text-xs text-slate-500">{fund.objective}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded">
                    {fund.type}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-navy-50 text-navy-900 rounded">
                    Risk: {fund.riskLevel}
                  </span>
                </div>
              </div>

              {/* Middle Row: Valuation Metrics & NAV Editor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* NAV Box */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Prevailing Unit NAV</span>
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700">GH₵</span>
                        <input
                          type="number"
                          step="0.0001"
                          value={newNavInput}
                          onChange={(e) => setNewNavInput(e.target.value)}
                          className="h-8 w-28 px-2 text-sm font-mono font-bold border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNav(fund.id)}
                          className="px-2 py-1 text-xs font-semibold text-white bg-emerald-700 rounded hover:bg-emerald-800 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFundId(null)}
                          className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between mt-1">
                      <div className="text-2xl font-bold font-mono text-navy-900 tabular-nums">
                        GH₵ {fund.nav.toFixed(4)}
                      </div>
                      <button
                        onClick={() => handleStartEdit(fund.id, fund.nav)}
                        className="text-xs text-navy-900 hover:text-navy-700 font-medium inline-flex items-center gap-1 p-1 hover:bg-slate-200/60 rounded"
                        title="Edit NAV Price"
                      >
                        <PencilSimple size={14} weight="bold" />
                        <span>Update</span>
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">Valuation Date: {fund.navDate}</p>
                </div>

                {/* Day Change Box */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Daily Movement</span>
                  <div className={`text-2xl font-bold font-mono mt-1 tabular-nums flex items-center gap-1 ${
                    fund.dailyChangePercent >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {fund.dailyChangePercent >= 0 ? <TrendUp size={22} weight="bold" /> : <TrendDown size={22} weight="bold" />}
                    <span>{fund.dailyChangePercent >= 0 ? '+' : ''}{fund.dailyChangePercent.toFixed(2)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {fund.dailyChange >= 0 ? '+GH₵ ' : '-GH₵ '}{Math.abs(fund.dailyChange).toFixed(4)} / unit
                  </p>
                </div>

                {/* YTD Return */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">YTD Annualized Return</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {fund.ytdReturn.toFixed(1)}%
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Benchmark: {fund.benchmark}</p>
                </div>

                {/* Total Fund Size */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Scheme Assets (AuM)</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatGHS(fund.fundSize)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Fee: {fund.managementFee}% p.a.</p>
                </div>
              </div>

              {/* Bottom Row: Asset Composition Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Underlying Portfolio Composition</span>
                  <span>100% Allocated</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {fund.composition.map((comp, idx) => (
                    <div
                      key={comp.name}
                      style={{ width: `${comp.percentage}%` }}
                      className={`h-full ${
                        idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-amber-600' : idx === 2 ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      title={`${comp.name}: ${comp.percentage}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                  {fund.composition.map((comp, idx) => (
                    <div key={comp.name} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-amber-600' : idx === 2 ? 'bg-emerald-600' : 'bg-slate-400'
                      }`} />
                      <span>{comp.name}: <strong>{comp.percentage}%</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
