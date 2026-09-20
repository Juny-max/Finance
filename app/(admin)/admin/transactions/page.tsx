'use client';

import React, { useState } from 'react';
import {
  ArrowsLeftRight,
  Check,
  X,
  MagnifyingGlass,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ArrowUp,
  FileText,
  Bank,
  DeviceMobile,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatDate } from '@/lib/formatters';
import type { Transaction } from '@/lib/types';

export default function AdminTransactionsPage() {
  const { allTransactions, approveTransaction, rejectTransaction } = useStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  const filteredTxns = allTransactions.filter((txn) => {
    if (filterType !== 'all' && txn.type !== filterType) return false;
    if (filterStatus !== 'all' && txn.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        txn.reference.toLowerCase().includes(q) ||
        txn.description.toLowerCase().includes(q) ||
        txn.fundName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingList = allTransactions.filter(
    (t) => t.status === 'processing' || t.status === 'pending'
  );

  const STATUS_TABS = [
    { value: 'all', label: 'All' },
    { value: 'processing', label: 'Pending' },
    { value: 'completed', label: 'Settled' },
    { value: 'failed', label: 'Declined' },
  ] as const;

  const handleOpenModal = (txn: Transaction) => {
    setSelectedTxn(txn);
    setShowDeclineInput(false);
    setDeclineReason('');
  };

  const handleCloseModal = () => {
    setSelectedTxn(null);
    setShowDeclineInput(false);
    setDeclineReason('');
  };

  const handleConfirmSettle = () => {
    if (!selectedTxn) return;
    approveTransaction(selectedTxn.id);
    handleCloseModal();
  };

  const handleConfirmDecline = () => {
    if (!selectedTxn) return;
    const reason = declineReason.trim() || 'Mandate verification discrepancy';
    rejectTransaction(selectedTxn.id, reason);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Settlement Queue</h1>
        <p className="text-sm text-slate-500 mt-1">
          {pendingList.length} transaction{pendingList.length !== 1 ? 's' : ''} awaiting clearance
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search reference, fund, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900"
          />
        </div>

        {/* Clean Neutral Segmented Tabs */}
        <div className="bg-slate-100 p-0.5 rounded-md inline-flex border border-slate-200/50">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all capitalize ${
                filterStatus === tab.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-2.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white text-slate-700"
        >
          <option value="all">All Types</option>
          <option value="investment">Investment (Deposit)</option>
          <option value="withdrawal">Withdrawal (Redemption)</option>
          <option value="switch_in">Switch In</option>
          <option value="switch_out">Switch Out</option>
        </select>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide font-medium">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Fund / Scheme</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => {
                  const isProcessing = txn.status === 'processing' || txn.status === 'pending';
                  const isInvestment = txn.type === 'investment' || txn.type === 'switch_in';

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => handleOpenModal(txn)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      {/* Reference */}
                      <td className="px-5 py-4">
                        <div className="font-mono text-slate-900 font-medium text-xs">
                          {txn.reference}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(txn.date)}</div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-900 capitalize text-xs">
                          {txn.type.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {txn.description}
                        </div>
                      </td>

                      {/* Fund */}
                      <td className="px-5 py-4 text-slate-700 font-medium">{txn.fundName}</td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`font-mono font-semibold text-sm tabular-nums ${
                            isInvestment ? 'text-emerald-700' : 'text-slate-900'
                          }`}
                        >
                          {isInvestment ? '+' : '-'}
                          {formatGHS(txn.amount)}
                        </span>
                        {txn.units && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            {txn.units.toLocaleString()} units
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {txn.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle size={11} weight="bold" /> Settled
                          </span>
                        )}
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <Clock size={11} weight="bold" /> Clearing
                          </span>
                        )}
                        {txn.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-100">
                            <XCircle size={11} weight="bold" /> Declined
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {isProcessing ? (
                          <button
                            onClick={() => handleOpenModal(txn)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-navy-900 bg-white border border-slate-200 hover:border-slate-300 rounded-md transition-all shadow-xs"
                          >
                            <span>Review & Settle</span>
                            <span className="text-slate-400">→</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenModal(txn)}
                            className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                          >
                            View details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Review & Authorization Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            className="bg-white rounded-lg border border-slate-200/80 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Settlement Authorization</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedTxn.reference}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                title="Close"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-sm">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  {selectedTxn.status === 'completed' ? (
                    <CheckCircle size={18} weight="bold" className="text-emerald-600" />
                  ) : selectedTxn.status === 'failed' ? (
                    <XCircle size={18} weight="bold" className="text-red-600" />
                  ) : (
                    <Clock size={18} weight="bold" className="text-amber-600" />
                  )}
                  <span className="text-xs font-medium text-slate-700">
                    {selectedTxn.status === 'completed'
                      ? 'Settled & Cleared'
                      : selectedTxn.status === 'failed'
                      ? 'Settlement Declined'
                      : 'Pending Clearing (Mandatory SEC T+2 Cycle)'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {formatDate(selectedTxn.date)}
                </span>
              </div>

              {/* Settlement Key Figures */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-md border border-slate-200/60 bg-white">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">
                    Settlement Amount
                  </span>
                  <div className="text-xl font-semibold font-mono text-slate-900 mt-1 tabular-nums">
                    {formatGHS(selectedTxn.amount)}
                  </div>
                </div>

                <div className="p-3.5 rounded-md border border-slate-200/60 bg-white">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">
                    Transaction Type
                  </span>
                  <div className="text-sm font-medium text-slate-900 mt-1 capitalize flex items-center gap-1.5">
                    {selectedTxn.type === 'investment' ? (
                      <Plus size={14} weight="bold" className="text-emerald-600" />
                    ) : (
                      <ArrowUp size={14} weight="bold" className="text-slate-600" />
                    )}
                    <span>{selectedTxn.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="border border-slate-200/60 rounded-md divide-y divide-slate-100">
                <div className="px-4 py-2.5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Fund / CIS Scheme</span>
                  <span className="font-medium text-slate-800">{selectedTxn.fundName}</span>
                </div>
                {selectedTxn.units && (
                  <div className="px-4 py-2.5 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Calculated Units</span>
                    <span className="font-mono font-medium text-slate-800">
                      {selectedTxn.units.toLocaleString()} units
                    </span>
                  </div>
                )}
                <div className="px-4 py-2.5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Narration</span>
                  <span className="font-medium text-slate-700">{selectedTxn.description}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Custodian Bank</span>
                  <span className="font-medium text-slate-700">GCB Bank PLC (CIS Custody)</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Clearing Mandate</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck size={14} weight="bold" /> SEC Ghana Compliant
                  </span>
                </div>
              </div>

              {/* Decline Input if triggered */}
              {showDeclineInput && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Reason for declining settlement
                  </label>
                  <textarea
                    rows={2}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="e.g., Bank mandate discrepancy, insufficient funds proof..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy-900"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors"
              >
                Close
              </button>

              {(selectedTxn.status === 'processing' || selectedTxn.status === 'pending') && (
                <div className="flex items-center gap-2">
                  {!showDeclineInput ? (
                    <button
                      type="button"
                      onClick={() => setShowDeclineInput(true)}
                      className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                    >
                      Decline...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmDecline}
                      className="px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                      Confirm Decline
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirmSettle}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors shadow-xs"
                  >
                    <Check size={14} weight="bold" />
                    <span>Authorize &amp; Settle</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
