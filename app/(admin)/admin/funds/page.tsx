'use client';

import React, { useState } from 'react';
import {
  Coins,
  PencilSimple,
  Check,
  X,
  TrendUp,
  TrendDown,
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS } from '@/lib/formatters';

export default function AdminFundsPage() {
  const { funds, updateFundNav } = useStore();
  const [editingFundId, setEditingFundId] = useState<string | null>(null);
  const [newNavInput, setNewNavInput] = useState<string>('');

  const handleStartEdit = (fundId: string, currentNav: number) => {
    setEditingFundId(fundId);
    setNewNavInput(currentNav.toFixed(4));
  };

  const handleSaveNav = (fundId: string) => {
    const parsedNav = parseFloat(newNavInput);
    if (isNaN(parsedNav) || parsedNav <= 0) {
      alert('Please enter a valid NAV unit price.');
      return;
    }
    updateFundNav(fundId, parsedNav, undefined);
    setEditingFundId(null);
  };

  const totalAuM = funds.reduce((acc, f) => acc + f.fundSize, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Daily NAV Pricing</h1>
        <p className="text-sm text-slate-500 mt-1">
          Publish official unit prices for each scheme · Cut-off 10:00 AM GMT
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Total AuM</p>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">{formatGHS(totalAuM, { compact: true })}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Active Schemes</p>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">{funds.length}</p>
        </div>
        {funds.slice(0, 2).map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium truncate">{f.shortName} NAV</p>
            <p className="text-2xl font-light text-slate-900 tabular-nums font-mono mt-1">
              GH₵&nbsp;{f.nav.toFixed(4)}
            </p>
          </div>
        ))}
      </div>

      {/* Fund Cards */}
      <div className="space-y-4">
        {funds.map((fund) => {
          const isEditing = editingFundId === fund.id;

          return (
            <div
              key={fund.id}
              className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden"
            >
              {/* Color strip */}
              <div className="h-0.5 w-full" style={{ backgroundColor: fund.color }} />

              <div className="p-6 space-y-5">
                {/* Fund header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fund.color }} />
                      <h2 className="text-base font-semibold text-slate-900">{fund.name}</h2>
                      <span className="text-xs font-mono text-slate-400">({fund.shortName})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-4">{fund.objective}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 text-xs border border-slate-200 text-slate-600 rounded-md">
                      {fund.type}
                    </span>
                    <span className="px-2 py-0.5 text-xs border border-slate-200 text-slate-600 rounded-md">
                      Risk: {fund.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* NAV Box */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Unit NAV</span>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-600">GH₵</span>
                          <input
                            type="number"
                            step="0.0001"
                            value={newNavInput}
                            onChange={(e) => setNewNavInput(e.target.value)}
                            className="h-8 w-28 px-2 text-sm font-mono border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                            autoFocus
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveNav(fund.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors"
                          >
                            <Check size={12} weight="bold" /> Save
                          </button>
                          <button
                            onClick={() => setEditingFundId(null)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between mt-1">
                        <div className="text-xl font-light font-mono text-slate-900 tabular-nums">
                          GH₵&nbsp;{fund.nav.toFixed(4)}
                        </div>
                        <button
                          onClick={() => handleStartEdit(fund.id, fund.nav)}
                          className="text-xs text-navy-900 hover:text-navy-700 inline-flex items-center gap-1 p-1 hover:bg-slate-100 rounded transition-colors"
                        >
                          <PencilSimple size={13} weight="bold" />
                          Edit
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">{fund.navDate}</p>
                  </div>

                  {/* Day Change */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Daily</span>
                    <div className={`text-xl font-light font-mono mt-1 tabular-nums flex items-center gap-1 ${
                      fund.dailyChangePercent >= 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {fund.dailyChangePercent >= 0
                        ? <TrendUp size={16} weight="bold" />
                        : <TrendDown size={16} weight="bold" />}
                      {fund.dailyChangePercent >= 0 ? '+' : ''}{fund.dailyChangePercent.toFixed(2)}%
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {fund.dailyChange >= 0 ? '+' : ''}GH₵&nbsp;{Math.abs(fund.dailyChange).toFixed(4)}/unit
                    </p>
                  </div>

                  {/* YTD */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">YTD Return</span>
                    <div className="text-xl font-light font-mono text-slate-900 mt-1 tabular-nums">
                      {fund.ytdReturn.toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">vs {fund.benchmark}</p>
                  </div>

                  {/* AuM */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Scheme AuM</span>
                    <div className="text-xl font-light font-mono text-slate-900 mt-1 tabular-nums">
                      {formatGHS(fund.fundSize, { compact: true })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Fee: {fund.managementFee}% p.a.</p>
                  </div>
                </div>

                {/* Composition bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Portfolio Composition</span>
                    <span>100% Allocated</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    {fund.composition.map((comp, idx) => (
                      <div
                        key={comp.name}
                        style={{ width: `${comp.percentage}%` }}
                        className={`h-full ${
                          idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-amber-500' : idx === 2 ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        title={`${comp.name}: ${comp.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                    {fund.composition.map((comp, idx) => (
                      <div key={comp.name} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-amber-500' : idx === 2 ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        <span>{comp.name}: <strong>{comp.percentage}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
