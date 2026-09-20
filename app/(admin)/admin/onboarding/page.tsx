'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Funnel,
  MagnifyingGlass,
  Check,
  X,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  DeviceMobile,
  Bank,
  Buildings,
  User,
  Users,
  CaretRight,
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import type { OnboardingApplication } from '@/lib/types';
import { formatDate } from '@/lib/formatters';

// ── helpers ────────────────────────────────────────────────────────────────

function formatGHS(amount: number) {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
}

function StatusBadge({ status }: { status: OnboardingApplication['status'] }) {
  if (status === 'pending_review') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border bg-amber-50 text-amber-700 border-amber-200">
        <Clock size={11} weight="bold" />
        Pending
      </span>
    );
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle size={11} weight="bold" />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border bg-red-50 text-red-700 border-red-200">
      <XCircle size={11} weight="bold" />
      Rejected
    </span>
  );
}

// ── main component ──────────────────────────────────────────────────────────

export default function AdminOnboardingPage() {
  const searchParams = useSearchParams();
  const selectParam = searchParams.get('select');

  const { applications, approveApplication, rejectApplication } = useStore();
  const [selectedApp, setSelectedApp] = useState<OnboardingApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  // Auto-select app from query parameter if present
  useEffect(() => {
    if (selectParam) {
      const match = applications.find((a) => a.id === selectParam);
      if (match) setSelectedApp(match);
    } else if (applications.length > 0 && !selectedApp) {
      setSelectedApp(applications[0]);
    }
  }, [selectParam, applications, selectedApp]);

  const filteredApps = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (categoryFilter !== 'all' && app.accountCategory !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.applicantName.toLowerCase().includes(q) ||
        app.reference.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (appId: string) => {
    approveApplication(appId, reviewNote || undefined);
    setReviewNote('');
    // Keep inspected modal updated
    setSelectedApp((prev) =>
      prev && prev.id === appId
        ? { ...prev, status: 'approved', reviewedBy: 'Audrey Mensah (Compliance Officer)' }
        : prev,
    );
  };

  const handleReject = (appId: string) => {
    rejectApplication(appId, reviewNote || 'Documentation incomplete.');
    setReviewNote('');
    setSelectedApp((prev) =>
      prev && prev.id === appId
        ? { ...prev, status: 'rejected', reviewedBy: 'Audrey Mensah (Compliance Officer)' }
        : prev,
    );
  };

  // ── status filter tabs config ─────────────────────────────────────────
  const statusTabs: { value: 'all' | 'pending_review' | 'approved' | 'rejected'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending_review', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">KYC &amp; Onboarding</h1>
        <p className="text-sm text-slate-500 mt-0.5">Review and approve client applications</p>
      </div>

      {/* ── Two-panel layout ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── LEFT PANEL — application list (40%) ─────────────────────── */}
        <div className="w-full lg:w-[40%] bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Search + filters */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant, reference or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 placeholder:text-slate-400"
              />
            </div>

            {/* Status tabs + category select */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-100 p-0.5 rounded-md inline-flex border border-slate-200/50">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setFilterStatus(tab.value)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                      filterStatus === tab.value
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 px-2.5 text-xs border border-slate-200 rounded-md bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-navy-900 ml-auto"
              >
                <option value="all">All Categories</option>
                <option value="Individual">Individual</option>
                <option value="Joint Account">Joint Account</option>
                <option value="Institution">Institution</option>
                <option value="Collective Investment Scheme">CIS</option>
              </select>
            </div>
          </div>

          {/* List header count */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
            <span className="text-xs text-slate-500">
              {filteredApps.length} application{filteredApps.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-400">Click to inspect</span>
          </div>

          {/* App rows */}
          <div className="max-h-[620px] overflow-y-auto divide-y divide-slate-100">
            {filteredApps.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No applications match your filters.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`py-3 px-4 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-slate-100'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-sm font-medium text-slate-900 truncate">{app.applicantName}</p>
                      <p className="text-xs font-mono text-slate-400">{app.reference}</p>
                      <p className="text-xs text-slate-500">{app.accountCategory}</p>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL — inspector (60%) ───────────────────────────── */}
        <div className="w-full lg:w-[60%]">
          {!selectedApp ? (
            <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm flex items-center justify-center h-64">
              <p className="text-sm text-slate-400">Select an application to view details</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm p-6 space-y-6">
              {/* ── App header ──────────────────────────────────────────── */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selectedApp.applicantName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-slate-400">{selectedApp.reference}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        Submitted{' '}
                        {new Date(selectedApp.submittedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* ── Detail fields grid ──────────────────────────────────── */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Application Details</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Account Type</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">{selectedApp.accountCategory}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Risk Profile</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5 capitalize">{selectedApp.riskProfile}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Investment Goal</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">{selectedApp.managementStyle}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Source of Funds</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">
                      {selectedApp.sourceOfFunds || 'Personal remuneration'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Email</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">{selectedApp.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Phone</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">{selectedApp.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">Statement Delivery</dt>
                    <dd className="text-sm text-slate-900 font-medium mt-0.5">
                      {selectedApp.statementDelivery || 'Email'} ({selectedApp.statementFrequency || 'Monthly'})
                    </dd>
                  </div>
                </dl>
              </div>

              <hr className="border-slate-100" />

              {/* ── Funding channel ─────────────────────────────────────── */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Funding Channel</p>
                <div className="flex items-center gap-2 mb-3">
                  {selectedApp.fundingMethod === 'Mobile Money' ? (
                    <DeviceMobile size={16} className="text-slate-600" />
                  ) : (
                    <Bank size={16} className="text-slate-600" />
                  )}
                  <span className="text-sm font-medium text-slate-900">{selectedApp.fundingMethod}</span>
                </div>

                {selectedApp.fundingMethod === 'Mobile Money' ? (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Network</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.momoNetwork || 'MTN Mobile Money'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">MoMo Number</dt>
                      <dd className="text-sm text-slate-900 font-medium font-mono mt-0.5">
                        {selectedApp.momoNumber || selectedApp.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Subscriber Name</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.momoAccountName || selectedApp.applicantName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Wallet Type</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.momoWalletType || 'Subscriber / Personal'}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Bank</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.bankName || 'Stanbic Bank Ghana'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Account Number</dt>
                      <dd className="text-sm text-slate-900 font-medium font-mono mt-0.5">
                        {selectedApp.bankAccountNumber || '9040001234567'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Account Name</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.bankAccountName || selectedApp.applicantName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500 uppercase tracking-wide">Branch</dt>
                      <dd className="text-sm text-slate-900 font-medium mt-0.5">
                        {selectedApp.bankBranch || 'Airport City'}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>

              <hr className="border-slate-100" />

              {/* ── KYC documents ───────────────────────────────────────── */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">KYC Documents</p>
                <div className="grid grid-cols-3 gap-3">
                  {['National ID (Ghana Card)', 'Proof of Address', 'Passport / Mandate'].map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 p-3 rounded-lg border border-slate-200/60 bg-slate-50"
                    >
                      <FileText size={14} className="text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-700 leading-tight">{doc}</span>
                      <CheckCircle size={13} className="text-emerald-600 ml-auto shrink-0" weight="fill" />
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* ── Review note + actions ────────────────────────────────── */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1.5">
                    Review note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter compliance remarks or document checklist notes…"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 resize-none placeholder:text-slate-400"
                  />
                  {selectedApp.complianceNotes && (
                    <p className="mt-1.5 text-xs text-slate-500 italic">
                      Audit note: {selectedApp.complianceNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  {selectedApp.reviewedBy ? (
                    <p className="text-xs text-slate-400">
                      Reviewed by <span className="text-slate-600">{selectedApp.reviewedBy}</span>
                    </p>
                  ) : (
                    <span />
                  )}

                  {selectedApp.status === 'pending_review' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(selectedApp.id)}
                        className="h-9 px-4 text-sm rounded-md bg-white border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedApp.id)}
                        className="h-9 px-4 text-sm rounded-md bg-navy-900 text-white hover:bg-navy-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Check size={14} weight="bold" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
