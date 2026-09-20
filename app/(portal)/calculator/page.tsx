"use client";

import { useState, useEffect, useMemo } from "react";
import { formatGHS } from "@/lib/formatters";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function CalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(18); // default to balanced
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const data = [];
    let currentBalance = initialInvestment;
    let totalContributions = initialInvestment;
    const monthlyRate = expectedReturn / 100 / 12;

    for (let i = 0; i <= years; i++) {
      if (i === 0) {
        data.push({
          year: `Year ${i}`,
          contributions: initialInvestment,
          growth: 0,
          total: initialInvestment
        });
        continue;
      }

      for (let m = 0; m < 12; m++) {
        currentBalance += monthlyContribution;
        totalContributions += monthlyContribution;
        currentBalance = currentBalance * (1 + monthlyRate);
      }

      data.push({
        year: `Year ${i}`,
        contributions: totalContributions,
        growth: currentBalance - totalContributions,
        total: currentBalance
      });
    }
    return data;
  }, [initialInvestment, monthlyContribution, years, expectedReturn]);

  const finalYear = chartData[chartData.length - 1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8 pb-12 mt-4"
    >
      <div>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">See what your investment could become.</h1>
        <p className="text-slate-500 mt-2">Project your potential returns with Aura funds.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* INPUTS - LEFT SIDE */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-lg border border-slate-200/60 bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <label className="text-sm font-medium text-slate-700">Initial investment</label>
              <span className="text-base font-semibold text-navy-900 tabular-nums sm:text-right">{formatGHS(initialInvestment)}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="500000" 
              step="500"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-3 rounded-lg"
            />
            <div className="mt-2 flex justify-between text-[11px] text-slate-400"><span>GH₵ 500</span><span>GH₵ 500,000</span></div>
          </div>

          <div className="rounded-lg border border-slate-200/60 bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <label className="text-sm font-medium text-slate-700">Monthly contribution</label>
              <span className="text-base font-semibold text-navy-900 tabular-nums sm:text-right">{formatGHS(monthlyContribution)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              step="100"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full h-3 rounded-lg"
            />
            <div className="mt-2 flex justify-between text-[11px] text-slate-400"><span>GH₵ 0</span><span>GH₵ 50,000</span></div>
          </div>

          <div className="rounded-lg border border-slate-200/60 bg-white p-4 sm:p-5">
            <label className="text-sm font-medium text-slate-700 block mb-3">Investment period</label>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5, 10, 15, 20].map((y) => (
                <button
                  key={y}
                  onClick={() => setYears(y)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    years === y 
                      ? "bg-navy-900 text-white" 
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {y} {y === 1 ? 'year' : 'years'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200/60 bg-white p-4 sm:p-5">
            <label className="text-sm font-medium text-slate-700 block mb-3">Expected annual return</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setExpectedReturn(14)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  expectedReturn === 14 
                    ? "border-navy-900 bg-navy-50" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">14%</div>
                <div className="text-xs text-slate-500 mt-1">Conservative</div>
              </button>
              <button
                onClick={() => setExpectedReturn(18)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  expectedReturn === 18 
                    ? "border-navy-900 bg-navy-50" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">18%</div>
                <div className="text-xs text-slate-500 mt-1">Balanced</div>
              </button>
              <button
                onClick={() => setExpectedReturn(22)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  expectedReturn === 22 
                    ? "border-navy-900 bg-navy-50" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="text-sm font-semibold text-slate-900">22%</div>
                <div className="text-xs text-slate-500 mt-1">Growth</div>
              </button>
            </div>
            
            <div className="mt-4">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Custom return rate</label>
                <span className="text-sm font-semibold text-navy-900 tabular-nums">{expectedReturn}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-3 rounded-lg"
              />
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 italic">
              Illustrative projection — not guaranteed. Past performance does not guarantee future returns. Actual returns may vary depending on market conditions and specific fund performance.
            </p>
          </div>
        </div>

        {/* RESULTS - RIGHT SIDE */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="grid grid-cols-1 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200/60 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="min-w-0 p-5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total contributions</p>
              <p className="text-2xl font-light text-slate-900 tabular-nums mt-1">{formatGHS(finalYear.contributions)}</p>
            </div>
            <div className="min-w-0 p-5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estimated growth</p>
              <p className="text-2xl font-light text-emerald-600 tabular-nums mt-1">+{formatGHS(finalYear.growth)}</p>
            </div>
            <div className="min-w-0 p-5 sm:col-span-2 sm:border-t sm:border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Projected value</p>
              <p className="text-3xl font-semibold text-navy-900 tabular-nums mt-1">{formatGHS(finalYear.total)}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Growth projection over {years} years</h3>
            <div className="h-[320px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      dy={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      dx={-10}
                      tickFormatter={(val) => `GH₵${(val/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                      itemStyle={{ fontSize: "14px", fontWeight: 500 }}
                      labelStyle={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}
                      formatter={(value: number) => [formatGHS(value), undefined]}
                    />
                    <Bar dataKey="contributions" name="Contributions" stackId="a" fill="#0B192C" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="growth" name="Estimated Growth" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-navy-900" />
                <span className="text-sm text-slate-600">Contributions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-sm text-slate-600">Estimated Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
