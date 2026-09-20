"use client";

import { useEffect, useState } from "react";
import { useStore, generateChartData } from "@/lib/store";
import { formatMasked, formatPercent } from "@/lib/formatters";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function InsightsPage() {
  const { portfolio, balanceHidden } = useStore();
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
      className="max-w-5xl mx-auto space-y-8 pb-12 mt-4"
    >
      <div>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">Performance & Insights</h1>
        <p className="text-slate-500 mt-2">Detailed breakdown of your portfolio's performance.</p>
      </div>

      {/* PERFORMANCE CHART */}
      <div className="bg-white border border-slate-200/60 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Portfolio growth</h3>
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
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorGrowth)" 
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#0B192C" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RETURNS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Return</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            {formatPercent(portfolio.summary.gainPercent)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">YTD Return</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            {formatPercent(portfolio.summary.ytdReturn)}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">1 Year Return</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            {formatPercent(portfolio.summary.ytdReturn * 1.2)} {/* Illustrative */}
          </p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Since Inception (Ann.)</p>
          <p className="text-xl font-light text-emerald-600 tabular-nums mt-2">
            {formatPercent(portfolio.summary.gainPercent * 0.8)} {/* Illustrative */}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* WHAT'S DRIVING PORTFOLIO */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">What's driving your portfolio</h3>
          <div className="space-y-6">
            {portfolio.holdings.map((holding) => {
              // Illustrative contribution metric based on gain/loss
              const contribution = holding.gainLossPercent * (holding.allocation / 100);
              return (
                <div key={holding.fundId}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-700 font-medium">{holding.fundId.replace(/-/g, ' ')}</span>
                    <span className={contribution >= 0 ? "text-emerald-600" : "text-red-500"}>
                      {formatPercent(contribution)} contribution
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${contribution >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(Math.abs(contribution) * 10, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENCHMARK COMPARISON */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Benchmark comparison (YTD)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Metric</th>
                  <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Your Portfolio</th>
                  <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Aura Benchmark</th>
                  <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">GoG 91-Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 text-sm font-medium text-slate-900">Return</td>
                  <td className="py-4 text-sm text-right text-emerald-600 tabular-nums">{formatPercent(portfolio.summary.ytdReturn)}</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">{formatPercent(portfolio.summary.ytdReturn * 0.9)}</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">+24.50%</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm font-medium text-slate-900">Volatility</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">Medium</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">Medium</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">Low</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm font-medium text-slate-900">Yield</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">{formatPercent(portfolio.summary.ytdReturn * 0.7)}</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">{formatPercent(portfolio.summary.ytdReturn * 0.75)}</td>
                  <td className="py-4 text-sm text-right text-slate-600 tabular-nums">24.50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
