'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlass,
  CheckCircle,
  Clock,
} from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { formatGHS } from '@/lib/formatters';

export default function AdminClientsPage() {
  const { users } = useAuth();
  const { applications } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Merge registered users with their valuations
  const registeredClients = users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone,
    accountNumber: u.accountNumber,
    accountType: u.accountType,
    riskProfile: u.riskProfile,
    kycStatus: u.kycStatus,
    joinDate: u.joinDate,
    advisor: u.advisor?.name || 'Aura Advisory Team',
    valuation: u.id === 'usr_gcb' ? 14850000 : u.id === 'usr_kwame' ? 148650 : 25000,
  }));

  const filteredClients = registeredClients.filter((c) => {
    if (categoryFilter !== 'all' && c.accountType !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalClientAuM = registeredClients.reduce((acc, c) => acc + c.valuation, 0);

  const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'individual', label: 'Individual' },
    { value: 'institutional', label: 'Institutional' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'joint', label: 'Joint' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-slate-900">Client Registry</h1>
        <p className="text-sm text-slate-500 mt-1">
          {registeredClients.length} active mandates · Total AuM {formatGHS(totalClientAuM, { compact: true })}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-72">
          <MagnifyingGlass size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900"
          />
        </div>

        <div className="bg-slate-100 p-0.5 rounded-md inline-flex border border-slate-200/50">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                categoryFilter === opt.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide font-medium">
              <tr>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Relationship Manager</th>
                <th className="px-5 py-3 text-right">Portfolio AuM</th>
                <th className="px-5 py-3 text-center">KYC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No clients match your search.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & ID */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-slate-900">{client.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {client.accountNumber}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200 text-slate-700 bg-slate-50 capitalize">
                        {client.accountType}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1 capitalize">
                        {client.riskProfile} risk
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="text-slate-700 font-medium">{client.email}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{client.phone}</div>
                    </td>

                    {/* Advisor */}
                    <td className="px-5 py-4">
                      <div className="text-slate-700 font-medium">{client.advisor}</div>
                    </td>

                    {/* Valuation */}
                    <td className="px-5 py-4 text-right font-mono font-semibold text-sm text-slate-900 tabular-nums">
                      {formatGHS(client.valuation)}
                    </td>

                    {/* KYC Status */}
                    <td className="px-5 py-4 text-center">
                      {client.kycStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle size={11} weight="bold" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock size={11} weight="bold" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
