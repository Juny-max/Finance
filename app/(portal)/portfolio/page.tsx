"use client";

import { useEffect, useState } from "react";
import { useStore, generateChartData } from "@/lib/store";
import { formatGHS, formatMasked, formatPercent, formatNumber } from "@/lib/formatters";
import { Plus, ArrowUp, ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";
import InvestFlow from "@/components/flows/InvestFlow";
import WithdrawFlow from "@/components/flows/WithdrawFlow";

const COLORS = ["#0B192C", "#059669", "#C4960A", "#64748B"];

export default function PortfolioPage() {
  const { funds, portfolio, balanceHidden, toggleBalance } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("1Y");
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setChartData(generateChartData("1Y", portfolio.summary.totalValue));
  }, [portfolio.summary.totalValue]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartData(generateChartData(tf, portfolio.summary.totalValue));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mt-2 sm:mt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">Portfolio</h1>
          <div className="flex items-center gap-3 mt-2 sm:mt-4">
            <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tabular-nums break-all sm:break-normal">
              {formatMasked(portfolio.summary.totalValue, balanceHidden)}
            </h2>
            <button 
              onClick={toggleBalance}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 shrink-0"
              aria-label="Toggle balance visibility"
            >
              {balanceHidden ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div data-tour="portfolio-actions" className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="flex-1 sm:flex-none h-10 px-4 sm:px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowUp size={16} weight="bold" />
            Withdraw
          </button>
          <button 
            onClick={() => setIsInvestOpen(true)}
            className="flex-1 sm:flex-none h-10 px-4 sm:px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} weight="bold" />
            Add funds
          </button>
        </div>
      </div>

      {/* PERFORMANCE SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border border-slate-200/60 rounded-lg p-3.5 sm:p-5">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">Total Value</p>
          <p className="text-lg sm:text-xl font-light text-slate-900 tabular-nums mt-1 sm:mt-2 truncate">
            {formatMasked(portfolio.summary.totalValue, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-3.5 sm:p-5">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">Total Invested</p>
          <p className="text-lg sm:text-xl font-light text-slate-900 tabular-nums mt-1 sm:mt-2 truncate">
            {formatMasked(portfolio.summary.totalInvested, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-3.5 sm:p-5">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">Total Gain</p>
          <p className="text-lg sm:text-xl font-light text-emerald-600 tabular-nums mt-1 sm:mt-2 truncate">
            +{formatMasked(portfolio.summary.totalGain, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-3.5 sm:p-5">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">YTD Return</p>
          <p className="text-lg sm:text-xl font-light text-emerald-600 tabular-nums mt-1 sm:mt-2 truncate">
            {formatPercent(portfolio.summary.ytdReturn)}
          </p>
        </div>
      </div>

      {/* PERFORMANCE CHART */}
      <div className="bg-white border border-slate-200/60 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Portfolio performance</h3>
            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 text-[10px] uppercase tracking-wider rounded">
              Illustrative data
            </span>
          </div>
          <div className="flex items-center bg-slate-50 p-1 rounded-md border border-slate-100 overflow-x-auto max-w-full">
            {["1M", "3M", "6M", "1Y", "3Y", "ALL"].map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-sm transition-colors shrink-0 ${
                  timeframe === tf 
                    ? "bg-white text-navy-900 shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[220px] sm:h-[320px] w-full mt-2 sm:mt-4">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolioLg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B192C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0B192C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  width={48}
                  tickFormatter={(val) => `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", fontSize: "12px" }}
                  itemStyle={{ fontSize: "12px" }}
                  labelStyle={{ fontSize: "11px", color: "#64748B", marginBottom: "4px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#0B192C" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPortfolioLg)" 
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#0B192C" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* HOLDINGS TABLE & MOBILE CARDS */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Your holdings</h3>
          <span className="text-xs text-slate-500 font-medium">{portfolio.holdings.length} Funds</span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Fund Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Units</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Current Value</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Gain / Loss</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Allocation</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolio.holdings.map((holding, i) => {
                const normId = holding.fundId.replace(/^(aura|bora)-/, "");
                const fund = funds.find(f => f.id === holding.fundId || f.id.replace(/^(aura|bora)-/, "") === normId);
                const fundName = fund?.name || holding.fundName || holding.fundId;
                const color = fund?.color || COLORS[i % COLORS.length];

                return (
                  <tr key={holding.fundId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="font-medium text-slate-900">{fundName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-slate-600">
                      {formatNumber(holding.units)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums font-medium text-slate-900">
                      {formatMasked(holding.currentValue, balanceHidden)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      <span className={holding.gainLoss >= 0 ? "text-emerald-600" : "text-red-500"}>
                        {holding.gainLoss >= 0 ? "+" : ""}{formatMasked(holding.gainLoss, balanceHidden)}
                        <span className="text-xs ml-1 opacity-80">({formatPercent(holding.gainLossPercent)})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-slate-600 font-medium">
                      {holding.allocation.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/funds/${holding.fundId}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="View fund details"
                      >
                        <ArrowRight size={16} weight="bold" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {portfolio.holdings.map((holding, i) => {
            const normId = holding.fundId.replace(/^(aura|bora)-/, "");
            const fund = funds.find(f => f.id === holding.fundId || f.id.replace(/^(aura|bora)-/, "") === normId);
            const fundName = fund?.name || holding.fundName || holding.fundId;
            const color = fund?.color || COLORS[i % COLORS.length];

            return (
              <div key={holding.fundId} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs font-semibold text-slate-900 truncate">{fundName}</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {holding.allocation.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Current Value</p>
                    <p className="font-semibold text-slate-900 tabular-nums mt-0.5">
                      {formatMasked(holding.currentValue, balanceHidden)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Gain / Loss</p>
                    <p className={`font-semibold tabular-nums mt-0.5 ${holding.gainLoss >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {holding.gainLoss >= 0 ? "+" : ""}{formatMasked(holding.gainLoss, balanceHidden)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] text-slate-500">
                  <span>Units: {formatNumber(holding.units)}</span>
                  <Link 
                    href={`/funds/${holding.fundId}`}
                    className="text-navy-900 font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    Details <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InvestFlow isOpen={isInvestOpen} onClose={() => setIsInvestOpen(false)} />
      <WithdrawFlow isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
    </motion.div>
  );
}
