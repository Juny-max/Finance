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
  CaretRight
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import type { OnboardingApplication } from '@/lib/types';
import { formatDate } from '@/lib/formatters';

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
    setSelectedApp((prev) => prev && prev.id === appId ? { ...prev, status: 'approved', reviewedBy: 'Audrey Mensah (Compliance Officer)' } : prev);
  };

  const handleReject = (appId: string) => {
    rejectApplication(appId, reviewNote || 'Documentation incomplete.');
    setReviewNote('');
    setSelectedApp((prev) => prev && prev.id === appId ? { ...prev, status: 'rejected', reviewedBy: 'Audrey Mensah (Compliance Officer)' } : prev);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">KYC & Digital Onboarding Desk</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-navy-100 text-navy-900 rounded-full">
              {applications.filter((a) => a.status === 'pending_review').length} Pending Review
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review identity documents, verify Mobile Money & Bank mandates, and issue investor accounts under SEC Ghana guidelines.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={18} weight="bold" className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicant, reference, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status Pills */}
          {(['all', 'pending_review', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' && 'All Applications'}
              {status === 'pending_review' && 'Pending Review'}
              {status === 'approved' && 'Approved'}
              {status === 'rejected' && 'Rejected'}
            </button>
          ))}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Individual">Individual</option>
            <option value="Joint Account">Joint Account</option>
            <option value="Institution">Institution</option>
            <option value="Collective Investment Scheme">Collective Investment Scheme</option>
          </select>
        </div>
      </div>

      {/* Main Content Split: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applications List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applications ({filteredApps.length})
            </span>
            <span className="text-[11px] text-slate-400">Click to inspect</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No onboarding applications match your current filters.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left p-4 transition-colors flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-navy-50/70 border-l-4 border-navy-900'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {app.applicantName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {app.reference}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{app.accountCategory}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          {app.fundingMethod === 'Mobile Money' ? (
                            <DeviceMobile size={13} weight="bold" className="text-amber-600" />
                          ) : (
                            <Bank size={13} weight="bold" className="text-blue-600" />
                          )}
                          {app.fundingMethod}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {app.status === 'pending_review' && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                          <Clock size={12} weight="bold" /> Pending
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                          <CheckCircle size={12} weight="bold" /> Approved
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                          <XCircle size={12} weight="bold" /> Rejected
                        </span>
                      )}
                      <CaretRight size={14} className="text-slate-400 mt-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Application Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          {selectedApp ? (
            <>
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedApp.applicantName}</h2>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedApp.reference}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: <strong className="text-slate-800">{selectedApp.accountCategory}</strong> · Submitted {new Date(selectedApp.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  {selectedApp.status === 'pending_review' && (
                    <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                      Pending Compliance Sign-Off
                    </span>
                  )}
                  {selectedApp.status === 'approved' && (
                    <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                      Account Verified & Active
                    </span>
                  )}
                  {selectedApp.status === 'rejected' && (
                    <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      Application Declined
                    </span>
                  )}
                </div>
              </div>

              {/* Section 1: Applicant & Mandate Profile */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicant Details & Mandate</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400">Email Address:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Primary Phone:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk Profile:</span>
                    <p className="font-semibold text-slate-800 mt-0.5 capitalize">{selectedApp.riskProfile}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Portfolio Style:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.managementStyle}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Source of Funds:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.sourceOfFunds || 'Personal remuneration'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Statement Dispatch:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.statementDelivery || 'Email'} ({selectedApp.statementFrequency || 'Monthly'})</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Funding Route Verification */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Funding Channel & Settlement Mandate
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    {selectedApp.fundingMethod === 'Mobile Money' ? (
                      <>
                        <DeviceMobile size={18} weight="bold" className="text-amber-600" />
                        <span>Mobile Money — {selectedApp.momoNetwork || 'MTN Mobile Money'}</span>
                      </>
                    ) : (
                      <>
                        <Bank size={18} weight="bold" className="text-blue-600" />
                        <span>Direct Bank Wire — {selectedApp.bankName || 'Stanbic Bank Ghana'}</span>
                      </>
                    )}
                  </div>

                  {selectedApp.fundingMethod === 'Mobile Money' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <span className="text-slate-400">Subscriber Name:</span>
                        <p className="font-semibold text-slate-900 font-mono mt-0.5">{selectedApp.momoAccountName || selectedApp.applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">MoMo Phone Number:</span>
                        <p className="font-semibold text-slate-900 font-mono mt-0.5">{selectedApp.momoNumber || selectedApp.phone}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Wallet Type:</span>
                        <p className="font-semibold text-slate-900 mt-0.5">{selectedApp.momoWalletType || 'Subscriber / Personal'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <span className="text-slate-400">Account Name:</span>
                        <p className="font-semibold text-slate-900 font-mono mt-0.5">{selectedApp.bankAccountName || selectedApp.applicantName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Account Number:</span>
                        <p className="font-semibold text-slate-900 font-mono mt-0.5">{selectedApp.bankAccountNumber || '9040001234567'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Branch:</span>
                        <p className="font-semibold text-slate-900 mt-0.5">{selectedApp.bankBranch || 'Airport City'}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium">
                    <CheckCircle size={14} weight="bold" />
                    <span>Registered name confirmed against Ghana Card identification match.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Statutory KYC Documents Attached */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Statutory Documents (SEC Compliant)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={18} weight="bold" className="text-navy-900" />
                      <span>National ID (Ghana Card)</span>
                    </div>
                    <span className="text-emerald-600 font-bold">✓ Attached</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={18} weight="bold" className="text-navy-900" />
                      <span>Proof of Address</span>
                    </div>
                    <span className="text-emerald-600 font-bold">✓ Attached</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText size={18} weight="bold" className="text-navy-900" />
                      <span>Passport Photo / Mandate</span>
                    </div>
                    <span className="text-emerald-600 font-bold">✓ Attached</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Compliance Officer Sign-Off & Audit */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Compliance Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter compliance remarks, NIA validation code, or document checklist notes..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                  {selectedApp.complianceNotes && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2 rounded border border-amber-200/50">
                      Audit Note: {selectedApp.complianceNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    {selectedApp.reviewedBy && (
                      <span>Reviewed by: <strong className="text-slate-600">{selectedApp.reviewedBy}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      disabled={selectedApp.status === 'rejected'}
                      className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={selectedApp.status === 'approved'}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Check size={16} weight="bold" />
                      <span>Approve & Issue Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 text-sm">
              Select an application from the queue to view full applicant and compliance data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
