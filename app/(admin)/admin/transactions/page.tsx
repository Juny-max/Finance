'use client';

import React, { useState } from 'react';
import { 
  ArrowsLeftRight, 
  Check, 
  X, 
  MagnifyingGlass, 
  Funnel, 
  CheckCircle, 
  Clock, 
  XCircle,
  Plus,
  ArrowUp,
  Coins,
  ShieldCheck,
  CalendarCheck
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
  const completedList = allTransactions.filter((t) => t.status === 'completed');
  const pendingVolume = pendingList.reduce((acc, t) => acc + t.amount, 0);
  const settledVolume = completedList.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settlement & Reconciliations Queue</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-900 rounded-full">
              {pendingList.length} Pending Settlement
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Authorize client deposits, fund switches, and statutory T+2 redemption payouts in accordance with SEC Ghana guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-slate-600">
          <CalendarCheck size={18} weight="bold" className="text-navy-900" />
          <span>Settlement Cycle: <strong>T+2 Business Days</strong></span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pending Settlement Volume</span>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {formatGHS(pendingVolume)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{pendingList.length} transactions awaiting release</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Settled & Reconciled Volume</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {formatGHS(settledVolume)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{completedList.length} transactions finalized</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Clearing Mandate Status</span>
          <div className="text-2xl font-bold text-navy-900 mt-1">
            100% Compliant
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Stanbic & GCB Custodian links operational</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={18} weight="bold" className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, description, or fund..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status buttons */}
          {(['all', 'processing', 'completed', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Type dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="investment">Investments (Deposits)</option>
            <option value="withdrawal">Withdrawals (Redemptions)</option>
            <option value="switch_in">Switch In</option>
            <option value="switch_out">Switch Out</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Reference & Date</th>
                <th className="px-5 py-3.5">Type & Channel</th>
                <th className="px-5 py-3.5">Scheme / Fund</th>
                <th className="px-5 py-3.5 text-right">Settlement Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Operations Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No transactions found matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => {
                  const isProcessing = txn.status === 'processing' || txn.status === 'pending';
                  const isInvestment = txn.type === 'investment' || txn.type === 'switch_in';
                  
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Reference & Date */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-semibold text-slate-900">{txn.reference}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {formatDate(txn.date)}
                        </div>
                      </td>

                      {/* Type & Channel */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isInvestment ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isInvestment ? <Plus size={12} weight="bold" /> : <ArrowUp size={12} weight="bold" />}
                          </span>
                          <div>
                            <span className="font-medium text-slate-900 capitalize">
                              {txn.type.replace('_', ' ')}
                            </span>
                            <div className="text-[11px] text-slate-400">{txn.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Fund */}
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {txn.fundName}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right">
                        <span className={`font-mono font-bold text-sm ${
                          isInvestment ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {isInvestment ? '+' : '-'}{formatGHS(txn.amount)}
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle size={13} weight="bold" /> Settled
                          </span>
                        )}
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <Clock size={13} weight="bold" /> Clearing
                          </span>
                        )}
                        {txn.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
                            <XCircle size={13} weight="bold" /> Declined
                          </span>
                        )}
                      </td>

                      {/* Operations Action */}
                      <td className="px-5 py-4 text-right">
                        {isProcessing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => rejectTransaction(txn.id, 'Discrepancy in mandate details')}
                              className="px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
                              title="Reject settlement"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => approveTransaction(txn.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors shadow-sm"
                              title="Confirm settlement and issue units"
                            >
                              <Check size={14} weight="bold" />
                              <span>Settle Order</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Audit Logged</span>
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
