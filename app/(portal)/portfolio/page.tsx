"use client";

import { useEffect, useState } from "react";
import { useStore, generateChartData } from "@/lib/store";
import { formatGHS, formatMasked, formatPercent, formatNumber } from "@/lib/formatters";
import { Plus, ArrowUp, ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const COLORS = ["#0B192C", "#64748B", "#C4960A", "#10B981"];

export default function PortfolioPage() {
  const { portfolio, balanceHidden, toggleBalance, showToast } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("1Y");

  useEffect(() => {
    setIsMounted(true);
    setChartData(generateChartData("1Y"));
  }, []);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartData(generateChartData(tf));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">Portfolio</h1>
          <div className="flex items-center gap-3 mt-4">
            <h2 className="text-2xl font-light text-slate-900 tabular-nums">
              {formatMasked(portfolio.summary.totalValue, balanceHidden)}
            </h2>
            <button 
              onClick={toggleBalance}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            >
              {balanceHidden ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => showToast("Withdrawal flow opened")}
            className="h-10 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ArrowUp size={16} weight="bold" />
            Withdraw
          </button>
          <button 
            onClick={() => showToast("InvestFlow modal opened")}
            className="h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} weight="bold" />
            Add funds
          </button>
        </div>
      </div>

      {/* PERFORMANCE SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Value</p>
          <p className="text-xl font-light text-slate-900 tabular-nums mt-2">
            {formatMasked(portfolio.summary.totalValue, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Invested</p>
          <p className="text-xl font-light text-slate-900 tabular-nums mt-2">
            {formatMasked(portfolio.summary.totalInvested, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Gain</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            +{formatMasked(portfolio.summary.totalGain, balanceHidden)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">YTD Return</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            +{formatPercent(portfolio.summary.ytdReturn)}
          </p>
        </div>
      </div>

      {/* PERFORMANCE CHART */}
      <div className="bg-white border border-slate-200/60 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Portfolio performance</h3>
            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 text-[10px] uppercase tracking-wider rounded">
              Illustrative data
            </span>
          </div>
          <div className="flex items-center bg-slate-50 p-1 rounded-md border border-slate-100">
            {["1M", "3M", "6M", "1Y", "3Y", "ALL"].map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
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

        <div className="h-[320px] w-full mt-4">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  dx={-10}
                  tickFormatter={(val) => `GH₵ ${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                  itemStyle={{ fontSize: "14px" }}
                  labelStyle={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}
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

      {/* HOLDINGS TABLE */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Your holdings</h3>
        </div>
        <div className="overflow-x-auto">
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
              {portfolio.holdings.map((holding) => (
                <tr key={holding.fundId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{holding.fundId.replace(/-/g, ' ')}</div>
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
                      <span className="text-xs ml-1 opacity-80">({holding.gainLoss >= 0 ? "+" : ""}{formatPercent(holding.gainLossPercent)})</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-600">
                    {formatPercent(holding.allocation)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/funds/${holding.fundId}`}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
}
