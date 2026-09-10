"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore, generateChartData } from "@/lib/store";
import { formatGHS, formatMasked, formatPercent, getGreeting, formatDate } from "@/lib/formatters";
import { 
  Plus, ArrowUp, ArrowsLeftRight, FileText, 
  Eye, EyeSlash, Coins, ArrowRight
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

const COLORS = ["#0B192C", "#64748B", "#C4960A", "#10B981"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { portfolio, balanceHidden, toggleBalance, showToast, transactions } = useStore();
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

  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "investment": return <Plus size={16} weight="bold" className="text-emerald-600" />;
      case "withdrawal": return <ArrowUp size={16} weight="bold" className="text-slate-600" />;
      case "dividend": return <Coins size={16} weight="bold" className="text-gold-500" />;
      default: return <FileText size={16} weight="bold" className="text-slate-600" />;
    }
  };

  const getTransactionBg = (type: string) => {
    switch (type) {
      case "investment": return "bg-emerald-50";
      case "withdrawal": return "bg-slate-100";
      case "dividend": return "bg-gold-50";
      default: return "bg-slate-50";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-12 pb-12"
    >
      {/* 1. GREETING HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8">
        <div>
          <h1 className="text-2xl font-light text-slate-900">
            {getGreeting()}, {user?.firstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your portfolio is performing well.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">As of 10 September 2026</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase tracking-wider rounded">
            Illustrative data
          </span>
        </div>
      </div>

      {/* 2. PORTFOLIO VALUE */}
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Total portfolio value</p>
        <div className="flex items-center gap-3 mt-2">
          <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tabular-nums tracking-tight">
            {formatMasked(portfolio.summary.totalValue, balanceHidden)}
          </h2>
          <button 
            onClick={toggleBalance}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            aria-label="Toggle balance visibility"
          >
            {balanceHidden ? <EyeSlash size={24} /> : <Eye size={24} />}
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="text-emerald-600 font-medium tabular-nums">
            +{formatMasked(portfolio.summary.totalGain, balanceHidden)} (+{formatPercent(portfolio.summary.gainPercent)})
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 tabular-nums">
            +{formatMasked(portfolio.summary.dayChange, balanceHidden)} (+{formatPercent(portfolio.summary.dayChangePercent)}) today
          </span>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => showToast("InvestFlow modal would open here")}
          className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-900">
            <Plus size={20} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Add funds</span>
        </button>
        
        <button 
          onClick={() => showToast("Withdrawal flow would open here")}
          className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
            <ArrowUp size={20} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Withdraw</span>
        </button>

        <button 
          onClick={() => showToast("Switch funds flow would open here")}
          className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
            <ArrowsLeftRight size={20} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Switch fund</span>
        </button>

        <Link 
          href="/statements"
          className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
            <FileText size={20} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Statement</span>
        </Link>
      </div>

      {/* 4. PERFORMANCE CHART */}
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

        <div className="h-[240px] w-full mt-4">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorPortfolio)" 
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
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#CBD5E1" 
                  strokeDasharray="2 2"
                  strokeWidth={1.5}
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-navy-900" />
            <span className="text-xs text-slate-600">Your portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs text-slate-600">Bora benchmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-600">Invested capital</span>
          </div>
        </div>
      </div>

      {/* 5. WHERE YOUR MONEY IS INVESTED */}
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200/60 rounded-lg p-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Where your money is invested</h3>
          <div className="space-y-4">
            {portfolio.holdings.map((holding, i) => (
              <div key={holding.fundId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium text-slate-700">{holding.fundId.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-slate-600 tabular-nums">
                    {formatMasked(holding.currentValue, balanceHidden)}
                  </span>
                  <span className="text-sm text-slate-500 tabular-nums w-12 text-right">
                    {formatPercent(holding.allocation)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[240px]">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.holdings}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="allocation"
                  stroke="none"
                >
                  {portfolio.holdings.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 6. RECENT ACTIVITY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
          <Link href="/transactions" className="text-sm text-navy-900 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTransactionBg(tx.type)}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 capitalize">{tx.type} — {tx.fundId.replace(/-/g, ' ')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(tx.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900 tabular-nums">
                  {tx.type === "investment" || tx.type === "dividend" ? "+" : "-"}{formatMasked(tx.amount, balanceHidden)}
                </p>
                <p className={`text-xs mt-0.5 ${tx.status === "completed" ? "text-emerald-600" : "text-amber-600"}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. YOUR ADVISOR */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Your relationship manager</h3>
          <p className="text-lg font-semibold text-slate-900 mt-1">Sarah Osei-Bonsu</p>
          <p className="text-sm text-slate-600">Senior Wealth Advisor</p>
          <div className="flex gap-4 mt-2 text-sm text-slate-600">
            <span>s.osei-bonsu@boracapital.com</span>
            <span>+233 24 123 4567</span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => showToast("Message advisor opened")}
            className="flex-1 md:flex-none h-10 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Message
          </button>
          <button 
            onClick={() => showToast("Callback requested")}
            className="flex-1 md:flex-none h-10 px-5 text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors"
          >
            Request callback
          </button>
        </div>
      </div>

      {/* 8. FOOTER DISCLAIMER */}
      <div className="pt-8 text-center">
        <p className="text-xs text-slate-400 italic max-w-3xl mx-auto">
          Illustrative data for demonstration purposes only. Investment values and returns shown are not live market data and should not be interpreted as investment advice or guaranteed performance.
        </p>
      </div>
    </motion.div>
  );
}
