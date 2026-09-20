'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowsLeftRight, 
  Users, 
  Coins, 
  ArrowRight,
  Clock,
  CheckCircle,
  WarningCircle,
  Bank,
  DeviceMobile
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS } from '@/lib/formatters';

export default function AdminOverviewPage() {
  const { applications, allTransactions, funds } = useStore();

  const pendingApps = applications.filter((a) => a.status === 'pending_review');
  const approvedApps = applications.filter((a) => a.status === 'approved');
  const pendingTxns = allTransactions.filter((t) => t.status === 'processing' || t.status === 'pending');

  const totalFundSize = funds.reduce((acc, f) => acc + f.fundSize, 0);
  const pendingSettlementVolume = pendingTxns.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations & Compliance Desk</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              System Normal
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Supervising client onboarding KYC, statutory T+2 transaction settlements, and daily NAV valuations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
          >
            <ShieldCheck size={16} weight="bold" />
            <span>Review KYC ({pendingApps.length})</span>
          </Link>
          <Link
            href="/admin/transactions"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ArrowsLeftRight size={16} weight="bold" />
            <span>Settlement Queue ({pendingTxns.length})</span>
          </Link>
        </div>
      </div>

      {/* Key Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Total AuM Supervised</span>
            <Coins size={20} weight="bold" className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {formatGHS(totalFundSize)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 3 Collective Investment Schemes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Pending KYC Queue</span>
            <ShieldCheck size={20} weight="bold" className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {pendingApps.length} <span className="text-sm font-normal text-slate-500">applications</span>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {pendingApps.filter(a => a.fundingMethod === 'Mobile Money').length} MoMo · {pendingApps.filter(a => a.fundingMethod === 'Bank Transfer').length} Bank
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Pending Settlements</span>
            <ArrowsLeftRight size={20} weight="bold" className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            {pendingTxns.length > 0 ? formatGHS(pendingSettlementVolume) : 'GH₵ 0.00'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingTxns.length} orders awaiting clearance
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>Active Mandates</span>
            <Users size={20} weight="bold" className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
            1,429 <span className="text-sm font-normal text-slate-500">accounts</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {approvedApps.length} newly admitted this cycle
          </p>
        </div>
      </div>

      {/* Action Items Grid: Left = Priority Queue, Right = Fund Pricing Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority KYC Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Pending Onboarding & KYC Queue</h2>
              <p className="text-xs text-slate-500">Applications submitted via portal requiring compliance sign-off.</p>
            </div>
            <Link
              href="/admin/onboarding"
              className="text-xs font-medium text-navy-900 hover:text-navy-700 flex items-center gap-1"
            >
              <span>View all ({applications.length})</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {pendingApps.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <CheckCircle size={32} weight="duotone" className="mx-auto text-emerald-500 mb-2" />
              All onboarding applications have been verified and processed.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApps.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-lg border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{app.applicantName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-navy-100 text-navy-900 rounded">
                        {app.accountCategory}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{app.reference}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{app.email}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {app.fundingMethod === 'Mobile Money' ? (
                          <DeviceMobile size={14} weight="bold" className="text-amber-600" />
                        ) : (
                          <Bank size={14} weight="bold" className="text-blue-600" />
                        )}
                        {app.fundingMethod} {app.momoNetwork ? `(${app.momoNetwork})` : app.bankName ? `(${app.bankName})` : ''}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{app.riskProfile} risk</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/onboarding?select=${app.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-navy-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors self-start sm:self-center"
                  >
                    Inspect & Verify
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Fund Pricing & NAV Desk Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Daily NAV Pricing</h2>
              <p className="text-xs text-slate-500">Official fund unit valuations</p>
            </div>
            <Link
              href="/admin/funds"
              className="text-xs font-medium text-navy-900 hover:text-navy-700 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="space-y-3">
            {funds.map((fund) => (
              <div key={fund.id} className="p-3.5 rounded-lg border border-slate-200/70 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">{fund.name}</span>
                  <span className="text-xs font-mono font-bold text-navy-900">
                    GH₵ {fund.nav.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>As of {fund.navDate}</span>
                  <span className={fund.dailyChangePercent >= 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {fund.dailyChangePercent >= 0 ? '+' : ''}{fund.dailyChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200/60 rounded-lg text-xs text-blue-900 leading-relaxed">
            <strong>SEC Compliance Rule:</strong> All CIS schemes must publish prevailing NAV per unit before 10:00 AM daily.
          </div>
        </div>
      </div>
    </div>
  );
}
