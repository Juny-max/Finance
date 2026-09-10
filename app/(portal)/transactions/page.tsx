'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Funnel, X, ArrowUp, ArrowDown, ArrowsLeftRight, Check, Clock, Warning, Info } from '@phosphor-icons/react';
import { useStore } from '@/lib/store';
import { formatGHS, formatDate, formatNumber, formatNAV } from '@/lib/formatters';

export default function TransactionsPage() {
  const { transactions, funds } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const tabs = ['All', 'Investments', 'Withdrawals', 'Switches', 'Dividends', 'Fees'];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const isSwitch = tx.type === 'switch' || tx.type === 'switch_in' || tx.type === 'switch_out';
      const matchesTab = activeTab === 'All' || 
        (activeTab === 'Investments' && tx.type === 'investment') || 
        (activeTab === 'Withdrawals' && tx.type === 'withdrawal') || 
        (activeTab === 'Switches' && isSwitch) || 
        (activeTab === 'Dividends' && tx.type === 'dividend') || 
        (activeTab === 'Fees' && tx.type === 'fee');
      const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (funds.find(f => f.id === tx.fundId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [transactions, activeTab, searchQuery, funds]);

  const getTxIcon = (type: string) => {
    switch(type) {
      case 'investment': return <div className="p-2 rounded-full bg-emerald-100 text-emerald-600"><ArrowDown size={16} weight="bold" /></div>;
      case 'withdrawal': return <div className="p-2 rounded-full bg-slate-100 text-slate-600"><ArrowUp size={16} weight="bold" /></div>;
      case 'switch':
      case 'switch_in':
      case 'switch_out':
        return <div className="p-2 rounded-full bg-blue-100 text-blue-600"><ArrowsLeftRight size={16} weight="bold" /></div>;
      case 'dividend': return <div className="p-2 rounded-full bg-gold-100 text-gold-600"><ArrowDown size={16} weight="bold" /></div>;
      case 'fee': return <div className="p-2 rounded-full bg-red-100 text-red-600"><ArrowUp size={16} weight="bold" /></div>;
      default: return <div className="p-2 rounded-full bg-slate-100 text-slate-600"><Info size={16} weight="bold" /></div>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <div className="flex items-center gap-1.5 text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div><span className="text-xs font-medium capitalize">{status}</span></div>;
      case 'processing': return <div className="flex items-center gap-1.5 text-amber-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><span className="text-xs font-medium capitalize">{status}</span></div>;
      case 'pending': return <div className="flex items-center gap-1.5 text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div><span className="text-xs font-medium capitalize">{status}</span></div>;
      case 'failed': return <div className="flex items-center gap-1.5 text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-xs font-medium capitalize">{status}</span></div>;
      default: return <span className="text-xs font-medium capitalize">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'investment': return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 uppercase tracking-wider">Investment</span>;
      case 'withdrawal': return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 uppercase tracking-wider">Withdrawal</span>;
      case 'switch':
      case 'switch_in':
      case 'switch_out':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 uppercase tracking-wider">Switch</span>;
      case 'dividend': return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gold-100 text-gold-700 uppercase tracking-wider">Dividend</span>;
      case 'fee': return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 uppercase tracking-wider">Fee</span>;
      default: return null;
    }
  };

  const formatTxAmount = (tx: any) => {
    const isCredit = ['investment', 'dividend'].includes(tx.type);
    const sign = isCredit ? '+' : '-';
    return (
      <span className={`tabular-nums ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
        {sign} {formatGHS(tx.amount)}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500 mt-1">Your complete transaction history</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar gap-2">
          {tabs.map(tab => {
            const count = tab === 'All' ? transactions.length : transactions.filter(t => t.type.toLowerCase() + 's' === tab.toLowerCase() || (tab === 'Investments' && t.type === 'investment') || (tab === 'Withdrawals' && t.type === 'withdrawal') || (tab === 'Switches' && t.type === 'switch') || (tab === 'Dividends' && t.type === 'dividend') || (tab === 'Fees' && t.type === 'fee')).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab} <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by reference or fund..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full pl-9 pr-3 text-sm border border-slate-200 rounded-md bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4">
              <MagnifyingGlass size={24} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No transactions found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Reference</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Fund</th>
                    <th className="px-6 py-4 font-medium text-right">Amount (GH₵)</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map(tx => (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-600">{formatDate(tx.date)}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                      <td className="px-6 py-4">{getTypeBadge(tx.type)}</td>
                      <td className="px-6 py-4 text-slate-900">{funds.find(f => f.id === tx.fundId)?.name || 'Unknown Fund'}</td>
                      <td className="px-6 py-4 text-right">{formatTxAmount(tx)}</td>
                      <td className="px-6 py-4">{getStatusIcon(tx.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {getTxIcon(tx.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {funds.find(f => f.id === tx.fundId)?.name || 'Unknown Fund'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatTxAmount(tx)}</p>
                    <div className="mt-1 flex justify-end">{getStatusIcon(tx.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Transaction Details</h2>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500 capitalize mb-2">{selectedTx.type}</p>
                    <p className="text-3xl font-light text-slate-900 tabular-nums">
                      {['investment', 'dividend'].includes(selectedTx.type) ? '+' : '-'} {formatGHS(selectedTx.amount)}
                    </p>
                    <div className="flex justify-center mt-3">{getStatusIcon(selectedTx.status)}</div>
                  </div>
                </div>

                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Summary</h3>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date & Time</span>
                        <span className="text-slate-900 font-medium">{formatDate(selectedTx.date)} 10:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference</span>
                        <span className="text-slate-900 font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">{selectedTx.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fund</span>
                        <span className="text-slate-900 font-medium">{funds.find(f => f.id === selectedTx.fundId)?.name}</span>
                      </div>
                      {selectedTx.units && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Units</span>
                          <span className="text-slate-900 font-medium tabular-nums">{formatNumber(selectedTx.units, 4)}</span>
                        </div>
                      )}
                      {selectedTx.nav && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">NAV Applied</span>
                          <span className="text-slate-900 font-medium tabular-nums">{formatNAV(selectedTx.nav)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payment Method</span>
                        <span className="text-slate-900 font-medium">Bank Transfer</span>
                      </div>
                      {selectedTx.type === 'switch' && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Related Transaction</span>
                          <span className="text-blue-600 font-medium cursor-pointer hover:underline">View</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Timeline</h3>
                    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-slate-200">
                      <div className="relative flex gap-4">
                        <div className="absolute left-[-11px] w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white">
                          <Check size={12} weight="bold" className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Request submitted</p>
                          <p className="text-xs text-slate-500 mt-0.5">{formatDate(selectedTx.date)} 09:55 AM</p>
                        </div>
                      </div>
                      <div className="relative flex gap-4">
                        <div className={`absolute left-[-11px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${selectedTx.status === 'completed' ? 'bg-emerald-100' : selectedTx.status === 'processing' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                          {selectedTx.status === 'completed' ? (
                            <Check size={12} weight="bold" className="text-emerald-600" />
                          ) : (
                            <Clock size={12} weight="bold" className={selectedTx.status === 'processing' ? 'text-amber-600' : 'text-slate-400'} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Processing</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedTx.status === 'completed' ? `${formatDate(selectedTx.date)} 10:00 AM` : 'In progress'}</p>
                        </div>
                      </div>
                      <div className="relative flex gap-4">
                        <div className={`absolute left-[-11px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${selectedTx.status === 'completed' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          {selectedTx.status === 'completed' ? (
                            <Check size={12} weight="bold" className="text-emerald-600" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Completed</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedTx.status === 'completed' ? `${formatDate(selectedTx.date)} 10:00 AM` : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
