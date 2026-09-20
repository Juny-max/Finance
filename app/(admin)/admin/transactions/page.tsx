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
} from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatDate } from '@/lib/formatters';

export default function AdminTransactionsPage() {
  const { allTransactions, approveTransaction, rejectTransaction } = useStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const pendingList = allTransactions.filter((t) => t.status === 'processing' || t.status === 'pending');

  const STATUS_TABS = ['all', 'processing', 'completed', 'failed'] as const;

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
          <MagnifyingGlass size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, fund..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-navy-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-8 px-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="investment">Investment</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="switch_in">Switch In</option>
            <option value="switch_out">Switch Out</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide font-medium">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Fund</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
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
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Reference */}
                      <td className="px-5 py-4">
                        <div className="font-mono text-slate-900 font-medium text-xs">{txn.reference}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{formatDate(txn.date)}</div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-900 capitalize text-xs">
                          {txn.type.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{txn.description}</div>
                      </td>

                      {/* Fund */}
                      <td className="px-5 py-4 text-slate-700 font-medium">{txn.fundName}</td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right">
                        <span className={`font-mono font-semibold text-sm tabular-nums ${
                          isInvestment ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {isInvestment ? '+' : '-'}{formatGHS(txn.amount)}
                        </span>
                        {txn.units && (
                          <div className="text-[11px] text-slate-400 font-mono">{txn.units.toLocaleString()} units</div>
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
                            <XCircle size={11} weight="bold" /> Failed
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        {isProcessing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => rejectTransaction(txn.id, 'Discrepancy in mandate details')}
                              className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => approveTransaction(txn.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors"
                            >
                              <Check size={12} weight="bold" />
                              Settle
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Logged</span>
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
    </div>
  );
}
