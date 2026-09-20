'use client';

import React, { useState } from 'react';
import { 
  Users, 
  MagnifyingGlass, 
  Funnel, 
  UserCircle, 
  ShieldCheck, 
  Briefcase,
  EnvelopeSimple,
  Phone,
  Bank,
  CheckCircle,
  Clock
} from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { formatGHS } from '@/lib/formatters';

export default function AdminClientsPage() {
  const { users } = useAuth();
  const { applications } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Combine registered users with approved onboarding applications
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
    advisor: u.advisor?.name || 'Aura Institutional Desk',
    // Realistic valuations for demo accounts
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Client & Scheme Registry</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-900 rounded-full">
              {registeredClients.length} Active Mandates
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Institutional pension schemes, Tier 3 trustees, corporate treasuries, and private high-net-worth individuals.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Client Holdings Supervised</span>
          <div className="text-xl font-bold text-navy-900 tabular-nums">
            {formatGHS(totalClientAuM)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={18} weight="bold" className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or account ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-700"
          >
            <option value="all">All Account Categories</option>
            <option value="individual">Individual HNWI</option>
            <option value="institutional">Institutional Schemes</option>
            <option value="corporate">Corporate Accounts</option>
            <option value="joint">Joint Mandates</option>
          </select>
        </div>
      </div>

      {/* Clients Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Account & Mandate Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Assigned Advisor</th>
                <th className="px-5 py-3.5 text-right">Portfolio AuM</th>
                <th className="px-5 py-3.5 text-center">KYC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No clients found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & ID */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm text-slate-900">{client.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {client.accountNumber} · Joined {client.joinDate}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        client.accountType === 'institutional'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : client.accountType === 'corporate'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {client.accountType}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1 capitalize">
                        {client.riskProfile} risk profile
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-5 py-4">
                      <div className="text-slate-800 font-medium">{client.email}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{client.phone}</div>
                    </td>

                    {/* Relationship Manager */}
                    <td className="px-5 py-4">
                      <div className="text-slate-800 font-medium">{client.advisor}</div>
                      <div className="text-[11px] text-slate-400">Relationship Manager</div>
                    </td>

                    {/* Portfolio Valuation */}
                    <td className="px-5 py-4 text-right font-mono font-bold text-sm text-navy-900">
                      {formatGHS(client.valuation)}
                    </td>

                    {/* KYC Status */}
                    <td className="px-5 py-4 text-center">
                      {client.kycStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle size={13} weight="bold" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <Clock size={13} weight="bold" /> Pending
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
