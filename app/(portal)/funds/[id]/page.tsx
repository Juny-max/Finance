"use client";

import { useEffect, useState } from "react";
import { useStore, generateChartData } from "@/lib/store";
import { formatGHS, formatPercent, formatDate } from "@/lib/formatters";
import { FileText, ShieldCheck, ArrowLeft } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FundDetailPage() {
  const params = useParams();
  const fundId = params.id as string;
  const { funds, showToast } = useStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("1Y");

  const fund = funds.find(f => f.id === fundId);

  useEffect(() => {
    setIsMounted(true);
    // Use the global generator for illustration, real app would use fund-specific data
    setChartData(generateChartData("1Y"));
  }, []);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartData(generateChartData(tf));
  };

  if (!fund) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-light text-slate-900 mb-4">Fund not found</h2>
        <Link href="/funds" className="text-navy-900 font-medium hover:underline">
          &larr; Back to all funds
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <Link href="/funds" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mt-4">
        <ArrowLeft size={16} />
        Back to funds
      </Link>

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">{fund.name}</h1>
            <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} weight="fill" />
              {fund.riskLevel}
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">{fund.type}</p>
          <p className="text-slate-600 max-w-2xl">{fund.objective}</p>
        </div>
        <button 
          onClick={() => showToast(`Opening invest flow for ${fund.name}`)}
          className="shrink-0 h-10 px-6 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
        >
          Invest in this fund
        </button>
      </div>

      {/* 2. KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current NAV</p>
          <p className="text-xl font-light text-slate-900 tabular-nums mt-1">GH₵ {fund.nav.toFixed(4)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Daily Change</p>
          <p className={`text-xl font-light tabular-nums mt-1 ${fund.dailyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {fund.dailyChange >= 0 ? "+" : ""}{formatPercent(fund.dailyChange)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">YTD Return</p>
          <p className="text-xl font-light text-slate-900 tabular-nums mt-1">{formatPercent(fund.ytdReturn)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Since Inception</p>
          <p className="text-xl font-light text-slate-900 tabular-nums mt-1">{formatPercent(fund.sinceInception)}</p>
        </div>
      </div>

      {/* 3. PERFORMANCE CHART */}
      <div className="bg-white border border-slate-200/60 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Historical performance</h3>
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

        <div className="h-[280px] w-full mt-4">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFund" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={fund.color || "#0B192C"} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={fund.color || "#0B192C"} stopOpacity={0}/>
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
                  tickFormatter={(val) => `${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                  itemStyle={{ fontSize: "14px" }}
                  labelStyle={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke={fund.color || "#0B192C"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorFund)" 
                  activeDot={{ r: 4, strokeWidth: 0, fill: fund.color || "#0B192C" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. PORTFOLIO COMPOSITION */}
      <div className="bg-white border border-slate-200/60 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Portfolio composition</h3>
        <div className="space-y-4">
          {fund.composition.map((comp, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 font-medium">{comp.name || comp.assetClass}</span>
                <span className="text-slate-600 tabular-nums">{comp.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${comp.percentage}%`, 
                    backgroundColor: fund.color || "#0B192C",
                    opacity: 1 - (idx * 0.15)
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FUND INFORMATION */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Fund details</h3>
          <dl className="space-y-4 divide-y divide-slate-50">
            <div className="flex justify-between pt-3 first:pt-0">
              <dt className="text-sm text-slate-500">Fund Size</dt>
              <dd className="text-sm font-medium text-slate-900">{formatGHS(fund.fundSize)}</dd>
            </div>
            <div className="flex justify-between pt-3">
              <dt className="text-sm text-slate-500">Minimum Investment</dt>
              <dd className="text-sm font-medium text-slate-900">{formatGHS(fund.minimumInvestment ?? fund.minInvestment ?? 0)}</dd>
            </div>
            <div className="flex justify-between pt-3">
              <dt className="text-sm text-slate-500">Management Fee</dt>
              <dd className="text-sm font-medium text-slate-900">{formatPercent(fund.managementFee)} p.a.</dd>
            </div>
            <div className="flex justify-between pt-3">
              <dt className="text-sm text-slate-500">Benchmark</dt>
              <dd className="text-sm font-medium text-slate-900">{fund.benchmark}</dd>
            </div>
            <div className="flex justify-between pt-3">
              <dt className="text-sm text-slate-500">Inception Date</dt>
              <dd className="text-sm font-medium text-slate-900">{formatDate(fund.inceptionDate)}</dd>
            </div>
          </dl>
        </div>

        {/* 6. DOCUMENTS */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Fund documents</h3>
          <div className="space-y-3">
            {fund.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-200/60 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <FileText size={16} weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.name || doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => showToast("Downloading document...")}
                  className="text-xs font-medium text-navy-900 hover:underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 7. CTA */}
      <div className="mt-8 pt-8 border-t border-slate-200/60 text-center">
        <h3 className="text-xl font-light text-slate-900 mb-4">Ready to invest in {fund.name}?</h3>
        <button 
          onClick={() => showToast(`Opening invest flow for ${fund.name}`)}
          className="h-12 px-8 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors inline-flex items-center justify-center"
        >
          Invest Now
        </button>
      </div>

    </motion.div>
  );
}
