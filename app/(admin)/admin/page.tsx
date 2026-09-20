'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, ArrowsLeftRight, Users, Coins } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatDate } from '@/lib/formatters';

export default function AdminOverviewPage() {
  const { applications, allTransactions, funds } = useStore();

  const pendingApps = applications.filter((a) => a.status === 'pending_review');
  const pendingTxns = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  );

  const totalFundSize = funds.reduce((acc, f) => acc + f.fundSize, 0);
  const pendingSettlementVolume = pendingTxns.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Operations Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Good morning, Audrey. Here&apos;s what needs your attention.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total AuM */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              Assets under management
            </p>
            <Coins size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">
            {formatGHS(totalFundSize, { compact: true })}
          </p>
        </div>

        {/* KYC Queue */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              Pending applications
            </p>
            <ShieldCheck size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">
            {pendingApps.length} pending
          </p>
        </div>

        {/* Settlement Volume */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              Pending settlements
            </p>
            <ArrowsLeftRight size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">
            {pendingTxns.length > 0 ? formatGHS(pendingSettlementVolume, { compact: true }) : 'GH₵ 0.00'}
          </p>
        </div>

        {/* Active Clients */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              Active mandates
            </p>
            <Users size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">1,429</p>
        </div>
      </div>

      {/* Two-column detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KYC Queue — left 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">KYC Queue</span>
            <Link
              href="/admin/onboarding"
              className="text-xs text-navy-900 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="px-5">
            {pendingApps.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No pending applications</p>
            ) : (
              pendingApps.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="py-3 border-b border-slate-100 flex items-center justify-between last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-slate-900">
                        {app.applicantName}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{app.reference}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {app.accountCategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{app.email}</p>
                  </div>
                  <Link
                    href={`/admin/onboarding?select=${app.id}`}
                    className="ml-4 shrink-0 text-xs text-navy-900 hover:underline"
                  >
                    Inspect →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NAV Pricing — right 1 col */}
        <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Daily NAV</span>
            <Link
              href="/admin/funds"
              className="text-xs text-navy-900 hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>

          <div className="px-5">
            {funds.map((fund) => (
              <div
                key={fund.id}
                className="py-2.5 border-b border-slate-100 last:border-0 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-medium text-slate-900 truncate">{fund.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{fund.navDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono tabular-nums text-slate-900">
                    GH₵ {fund.nav.toFixed(4)}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      fund.dailyChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {fund.dailyChangePercent >= 0 ? '+' : ''}
                    {fund.dailyChangePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
