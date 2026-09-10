'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Printer, X, Info } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { formatGHS, formatDate, formatNAV, formatNumber } from '@/lib/formatters';

export default function StatementsPage() {
  const { user } = useAuth();
  const { statements, funds, portfolio } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const tabs = ['All', 'Monthly', 'Quarterly', 'Annual', 'Confirmations'];

  const filteredDocs = statements.filter(doc => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Confirmations') return doc.period === 'confirmation' || doc.type === 'confirmation';
    return doc.period === activeTab.toLowerCase() || doc.type === activeTab.toLowerCase();
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Statements & Documents</h1>
        <p className="text-sm text-slate-500 mt-1">Access your financial documents</p>
      </div>

      <div className="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No documents available yet</h3>
            <p className="text-sm text-slate-500 mt-1">Statements and confirmations will appear here once generated.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-600 shrink-0">
                  <FileText size={24} weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 capitalize">{doc.type} Statement</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{doc.period}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">Generated {formatDate(doc.generatedDate || doc.date || '')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded hidden sm:block">PDF</span>
                  <button 
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-center"
                  >
                    View
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-slate-100 rounded-lg shadow-xl overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{previewDoc.name}</h2>
                  <p className="text-sm text-slate-500">Generated {formatDate(previewDoc.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                    <Printer size={16} /> Print
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                    <Download size={16} /> Download
                  </button>
                  <button onClick={() => setPreviewDoc(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="bg-white w-full max-w-3xl mx-auto min-h-full shadow-sm rounded border border-slate-200 p-8 sm:p-12">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-navy-900">Bora Capital Advisors</h1>
                      <p className="text-xs text-slate-500 mt-1">Wealth Management & Investment Advisory</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p className="font-semibold text-slate-900 capitalize">{previewDoc.type} Statement</p>
                      <p className="mt-1">Period: {previewDoc.period}</p>
                      <p>Date: {formatDate(previewDoc.date)}</p>
                    </div>
                  </div>

                  <div className="mb-10 text-sm">
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-slate-600 mt-1">Account Number: {user?.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-slate-600 mt-1">{user?.email}</p>
                  </div>

                  <div className="mb-10">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4">Portfolio Summary</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-slate-500">Opening Balance</p>
                        <p className="text-lg text-slate-900 font-medium tabular-nums mt-1">{formatGHS(portfolio.summary.totalValue * 0.9)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Net Contributions</p>
                        <p className="text-lg text-slate-900 font-medium tabular-nums mt-1">{formatGHS(portfolio.summary.totalInvested * 0.1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Growth</p>
                        <p className="text-lg text-emerald-600 font-medium tabular-nums mt-1">+{formatGHS(portfolio.summary.totalGain * 0.1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Closing Balance</p>
                        <p className="text-lg text-slate-900 font-medium tabular-nums mt-1">{formatGHS(portfolio.summary.totalValue)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4">Current Holdings</h2>
                    <table className="w-full text-left text-sm">
                      <thead className="text-slate-500 bg-slate-50">
                        <tr>
                          <th className="py-2 px-3 font-medium">Fund</th>
                          <th className="py-2 px-3 font-medium text-right">Units</th>
                          <th className="py-2 px-3 font-medium text-right">NAV (GH₵)</th>
                          <th className="py-2 px-3 font-medium text-right">Value (GH₵)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {portfolio.holdings.map((h, i) => {
                          const fund = funds.find(f => f.id === h.fundId);
                          return (
                            <tr key={i}>
                              <td className="py-3 px-3 text-slate-900">{fund?.name}</td>
                              <td className="py-3 px-3 text-right tabular-nums">{formatNumber(h.units, 4)}</td>
                              <td className="py-3 px-3 text-right tabular-nums">{formatNAV(fund?.nav || 0)}</td>
                              <td className="py-3 px-3 text-right tabular-nums font-medium">{formatGHS(h.currentValue).replace('GH₵ ', '')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="border-t-2 border-slate-200 font-semibold text-slate-900">
                        <tr>
                          <td colSpan={3} className="py-3 px-3 text-right">Total Portfolio Value</td>
                          <td className="py-3 px-3 text-right tabular-nums">{formatGHS(portfolio.summary.totalValue).replace('GH₵ ', '')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded mb-4">
                      <Info size={16} /> Prototype document — illustrative data only.
                    </div>
                    <p>Bora Capital Advisors Limited is licensed and regulated by the Securities and Exchange Commission (SEC) of Ghana.</p>
                    <p>No. 14 Senchi Street, Airport Residential Area, Accra | +233 30 277 4839 | info@boracapital.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
