"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore, generateChartData } from "@/lib/store";
import { formatGHS, formatMasked, formatPercent, getGreeting, formatDate } from "@/lib/formatters";
import { 
  Plus, ArrowUp, ArrowsLeftRight, FileText, 
  Eye, EyeSlash, Coins, ArrowRight, Envelope, Phone
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";
import InvestFlow from "@/components/flows/InvestFlow";
import WithdrawFlow from "@/components/flows/WithdrawFlow";
import SwitchFlow from "@/components/flows/SwitchFlow";
import { AdvisorMessageModal } from "@/components/advisor/AdvisorMessageModal";
import { AdvisorCallbackModal } from "@/components/advisor/AdvisorCallbackModal";

const COLORS = ["#0B192C", "#059669", "#C4960A", "#64748B"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { funds, portfolio, balanceHidden, toggleBalance, transactions } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("1Y");

  // Modal states
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [isMessageAdvisorOpen, setIsMessageAdvisorOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setChartData(generateChartData("1Y", portfolio.summary.totalValue));
  }, [portfolio.summary.totalValue]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartData(generateChartData(tf, portfolio.summary.totalValue));
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
      className="max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 pb-8 sm:pb-12"
    >
      {/* 1. GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mt-2 sm:mt-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-900">
            {getGreeting()}, {user?.firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your portfolio is performing well.
          </p>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
          <p className="text-xs sm:text-sm text-slate-500">As of 10 September 2026</p>
          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase tracking-wider rounded">
            Illustrative data
          </span>
        </div>
      </div>

      {/* 2. PORTFOLIO VALUE */}
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Total portfolio value</p>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tabular-nums tracking-tight break-all sm:break-normal">
            {formatMasked(portfolio.summary.totalValue, balanceHidden)}
          </h2>
          <button 
            onClick={toggleBalance}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 shrink-0"
            aria-label="Toggle balance visibility"
          >
            {balanceHidden ? <EyeSlash size={22} /> : <Eye size={22} />}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs sm:text-sm pt-0.5">
          <span className="text-emerald-600 font-medium tabular-nums inline-flex items-center">
            +{formatMasked(portfolio.summary.totalGain, balanceHidden)} ({formatPercent(portfolio.summary.gainPercent)})
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-slate-500 tabular-nums inline-flex items-center">
            +{formatMasked(portfolio.summary.dayChange, balanceHidden)} ({formatPercent(portfolio.summary.dayChangePercent)}) today
          </span>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div data-tour="quick-actions" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <button 
          onClick={() => setIsInvestOpen(true)}
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center group"
        >
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-navy-50 group-hover:bg-navy-100 flex items-center justify-center text-navy-900 transition-colors shrink-0">
            <Plus size={18} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Add funds</span>
        </button>
        
        <button 
          onClick={() => setIsWithdrawOpen(true)}
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center group"
        >
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shrink-0">
            <ArrowUp size={18} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Withdraw</span>
        </button>

        <button 
          onClick={() => setIsSwitchOpen(true)}
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center group"
        >
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shrink-0">
            <ArrowsLeftRight size={18} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Switch fund</span>
        </button>

        <Link 
          href="/statements"
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/60 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center group"
        >
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shrink-0">
            <FileText size={18} weight="bold" />
          </div>
          <span className="text-xs font-medium text-slate-700">Statement</span>
        </Link>
      </div>

      {/* 4. PERFORMANCE CHART */}
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

        <div className="h-[200px] sm:h-[240px] w-full mt-2 sm:mt-4">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
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

        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-full bg-navy-900 shrink-0" />
            <span className="text-xs text-slate-600">Your portfolio</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            <span className="text-xs text-slate-600">Bora benchmark</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
            <span className="text-xs text-slate-600">Invested capital</span>
          </div>
        </div>
      </div>

      {/* 5. WHERE YOUR MONEY IS INVESTED */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center bg-white border border-slate-200/60 rounded-lg p-4 sm:p-6">
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Where your money is invested</h3>
            <Link href="/portfolio" className="text-xs text-navy-900 font-medium hover:underline">
              View details &rarr;
            </Link>
          </div>

          {portfolio.holdings.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">No active fund holdings recorded yet.</p>
              <button 
                onClick={() => setIsInvestOpen(true)}
                className="mt-2 text-xs font-medium text-navy-900 underline"
              >
                Start your first investment &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {portfolio.holdings.map((holding, i) => {
                const normId = holding.fundId.replace(/^(aura|bora)-/, "");
                const fund = funds.find(f => f.id === holding.fundId || f.id.replace(/^(aura|bora)-/, "") === normId);
                const shortName = fund?.shortName || fund?.name || holding.fundName || holding.fundId;
                const fullName = fund?.name || holding.fundName || holding.fundId;
                const color = fund?.color || COLORS[i % COLORS.length];

                return (
                  <div key={holding.fundId} className="flex items-center justify-between gap-2.5 sm:gap-4 group">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <Link 
                        href={`/funds/${holding.fundId}`}
                        className="text-xs sm:text-sm font-medium text-slate-800 hover:text-navy-900 truncate transition-colors hover:underline"
                        title={fullName}
                      >
                        {shortName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                      <span className="text-xs sm:text-sm text-slate-700 tabular-nums font-medium whitespace-nowrap">
                        {formatMasked(holding.currentValue, balanceHidden)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 tabular-nums w-10 sm:w-12 text-right">
                        {holding.allocation.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-[200px] sm:h-[240px] flex items-center justify-center pt-2 md:pt-0">
          {isMounted && portfolio.holdings.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.holdings.map((h, i) => {
                    const normId = h.fundId.replace(/^(aura|bora)-/, "");
                    const fund = funds.find(f => f.id === h.fundId || f.id.replace(/^(aura|bora)-/, "") === normId);
                    return {
                      name: fund?.shortName || fund?.name || h.fundName || h.fundId,
                      allocation: h.allocation,
                      color: fund?.color || COLORS[i % COLORS.length],
                    };
                  })}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="allocation"
                  nameKey="name"
                  stroke="none"
                >
                  {portfolio.holdings.map((holding, index) => {
                    const normId = holding.fundId.replace(/^(aura|bora)-/, "");
                    const fund = funds.find(f => f.id === holding.fundId || f.id.replace(/^(aura|bora)-/, "") === normId);
                    const color = fund?.color || COLORS[index % COLORS.length];
                    return <Cell key={`pie-cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}% allocation`, name]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 6. RECENT ACTIVITY */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Recent activity</h3>
          <Link href="/transactions" className="text-xs sm:text-sm text-navy-900 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0 flex items-center justify-center ${getTransactionBg(tx.type)}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 capitalize truncate">
                    {tx.type} — {tx.fundName || tx.fundId.replace(/^(aura|bora)-/, "").replace(/-/g, ' ')}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{formatDate(tx.date)}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 tabular-nums whitespace-nowrap">
                  {tx.type === "investment" || tx.type === "dividend" ? "+" : "-"}{formatMasked(tx.amount, balanceHidden)}
                </p>
                <p className={`text-[11px] sm:text-xs mt-0.5 font-medium ${tx.status === "completed" ? "text-emerald-600" : "text-amber-600"}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. YOUR ADVISOR */}
      {(() => {
        const advisor = user?.advisor || {
          name: "Ama Serwaa Boateng",
          role: "Senior Relationship Manager",
          email: "ama.boateng@boracapital.com",
          phone: "+233 30 277 4839"
        };
        const initials = advisor.name.split(" ").map(n => n[0]).slice(0, 2).join("");

        return (
          <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navy-900 text-white flex items-center justify-center font-medium text-sm sm:text-base shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Your Relationship Manager</h3>
                <p className="text-sm sm:text-base font-semibold text-slate-900 mt-0.5">{advisor.name}</p>
                <p className="text-xs text-slate-600">{advisor.role}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                  <a href={`mailto:${advisor.email}`} className="hover:text-navy-900 underline transition-colors break-all">
                    {advisor.email}
                  </a>
                  <span className="hidden sm:inline">&bull;</span>
                  <a href={`tel:${advisor.phone}`} className="hover:text-navy-900 underline transition-colors whitespace-nowrap">
                    {advisor.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => setIsMessageAdvisorOpen(true)}
                className="flex-1 md:flex-none h-9 sm:h-10 px-3 sm:px-5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Envelope size={15} weight="bold" />
                Message
              </button>
              <button 
                onClick={() => setIsCallbackOpen(true)}
                className="flex-1 md:flex-none h-9 sm:h-10 px-3 sm:px-5 text-xs sm:text-sm font-medium text-white bg-navy-900 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone size={15} weight="bold" />
                Request callback
              </button>
            </div>
          </div>
        );
      })()}

      {/* 8. FOOTER DISCLAIMER */}
      <div className="pt-2 sm:pt-4 text-center">
        <p className="text-[11px] sm:text-xs text-slate-400 italic max-w-3xl mx-auto px-2">
          Illustrative data for demonstration purposes only. Investment values and returns shown are not live market data and should not be interpreted as investment advice or guaranteed performance.
        </p>
      </div>

      {/* MODALS */}
      <InvestFlow isOpen={isInvestOpen} onClose={() => setIsInvestOpen(false)} />
      <WithdrawFlow isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <SwitchFlow isOpen={isSwitchOpen} onClose={() => setIsSwitchOpen(false)} />
      <AdvisorMessageModal isOpen={isMessageAdvisorOpen} onClose={() => setIsMessageAdvisorOpen(false)} />
      <AdvisorCallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </motion.div>
  );
}
