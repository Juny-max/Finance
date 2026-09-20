"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatGHS, formatPercent } from "@/lib/formatters";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import InvestFlow from "@/components/flows/InvestFlow";

export default function FundsPage() {
  const { funds } = useStore();
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [isInvestOpen, setIsInvestOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <div className="mt-4">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">Aura Funds</h1>
        <p className="text-slate-500 mt-2">Explore our range of collective investment schemes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funds.map((fund) => (
          <div key={fund.id} className="bg-white border border-slate-200/60 rounded-lg overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
            <div className="h-[3px] w-full" style={{ backgroundColor: fund.color || "#0B192C" }} />
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{fund.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{fund.type}</p>
                </div>
                <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} weight="fill" />
                  {fund.riskLevel}
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current NAV</p>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-2xl font-light text-slate-900 tabular-nums">GH₵ {fund.nav.toFixed(4)}</p>
                    <span className={`text-sm font-medium mb-1 ${fund.dailyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {formatPercent(fund.dailyChange)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">YTD Return</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{formatPercent(fund.ytdReturn)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Since Incep.</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{formatPercent(fund.sinceInception)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Min. Investment</p>
                  <p className="text-sm text-slate-900 mt-1">{formatGHS(fund.minimumInvestment ?? fund.minInvestment ?? 0)}</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 line-clamp-2">{fund.objective}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <Link 
                  href={`/funds/${fund.id}`}
                  className="flex-1 h-10 flex items-center justify-center text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  View fund
                </Link>
                <button 
                  onClick={() => {
                    setSelectedFundId(fund.id);
                    setIsInvestOpen(true);
                  }}
                  className="flex-1 h-10 flex items-center justify-center text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
                >
                  Invest
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InvestFlow 
        isOpen={isInvestOpen} 
        onClose={() => setIsInvestOpen(false)} 
        preselectedFundId={selectedFundId || undefined} 
      />
    </motion.div>
  );
}
