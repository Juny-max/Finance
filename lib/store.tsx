"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  Fund, Transaction, Statement, AppNotification,
  PortfolioData, Holding, PortfolioSummary,
  Toast, Timeframe, ChartDataPoint,
} from "./types";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./persistence";
import { useAuth } from "./auth";
import seedFunds from "@/data/funds.json";
import seedTransactions from "@/data/transactions.json";
import seedStatements from "@/data/statements.json";
import seedNotifications from "@/data/notifications.json";

// ─── Computed portfolio data from seed ────────────────────────
function computePortfolio(userId: string, funds: Fund[], transactions: Transaction[]): PortfolioData {
  const userTxns = transactions.filter((t) => t.userId === userId);
  const holdingsMap: Record<string, { units: number; invested: number }> = {};

  for (const txn of userTxns) {
    if (!holdingsMap[txn.fundId]) holdingsMap[txn.fundId] = { units: 0, invested: 0 };
    const h = holdingsMap[txn.fundId];
    if (txn.type === "investment" || txn.type === "dividend" || txn.type === "switch_in") {
      h.units += txn.units;
      h.invested += txn.amount;
    } else if (txn.type === "withdrawal" || txn.type === "switch_out") {
      h.units -= txn.units;
      h.invested -= txn.amount;
    }
  }

  const holdings: Holding[] = [];
  let totalValue = 0;
  let totalInvested = 0;

  for (const [fundId, data] of Object.entries(holdingsMap)) {
    if (data.units <= 0) continue;
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) continue;
    const currentValue = data.units * fund.nav;
    const gainLoss = currentValue - data.invested;
    totalValue += currentValue;
    totalInvested += Math.max(0, data.invested);
    holdings.push({
      fundId, units: data.units, averageCost: data.invested / data.units,
      currentValue, gainLoss, gainLossPercent: data.invested > 0 ? (gainLoss / data.invested) * 100 : 0,
      allocation: 0,
    });
  }

  // For the individual persona use a known baseline
  if (userId === "usr_kwame" && totalValue === 0) {
    totalValue = 148650;
    totalInvested = 125240;
  }
  if (userId === "usr_gcb" && totalValue === 0) {
    totalValue = 14850000;
    totalInvested = 12439500;
  }

  // Compute allocation percentages
  for (const h of holdings) {
    h.allocation = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0;
  }

  const totalGain = totalValue - totalInvested;
  const summary: PortfolioSummary = {
    totalValue, totalInvested, totalGain,
    gainPercent: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    ytdReturn: userId === "usr_gcb" ? 19.4 : 18.6,
    dayChange: userId === "usr_gcb" ? 12400 : 182.4,
    dayChangePercent: userId === "usr_gcb" ? 0.08 : 0.12,
    lastUpdated: "2026-09-09",
  };

  return { userId, summary, holdings };
}

// ─── Performance chart data generator ─────────────────────────
export function generateChartData(tf: Timeframe | string = "1Y", base: number = 148650): ChartDataPoint[] {
  const pts = tf === "1M" ? 30 : tf === "3M" ? 45 : tf === "6M" ? 60 : tf === "1Y" ? 52 : tf === "3Y" ? 60 : 70;
  const daysBack = tf === "1M" ? 30 : tf === "3M" ? 90 : tf === "6M" ? 180 : tf === "1Y" ? 365 : tf === "3Y" ? 1095 : 1460;
  const now = new Date("2026-09-10");
  const data: ChartDataPoint[] = [];
  const startCap = base * 0.84;
  const startBench = base * 0.86;
  const startTbill = base * 0.88;

  for (let i = 0; i <= pts; i++) {
    const p = i / pts;
    const d = new Date(now.getTime() - daysBack * (1 - p) * 86400000);
    const growth = Math.pow(1.19, (daysBack * p) / 365);
    const bGrowth = Math.pow(1.155, (daysBack * p) / 365);
    const tGrowth = Math.pow(1.13, (daysBack * p) / 365);
    const noise = Math.sin(i * 1.3) * 0.006 + Math.cos(i * 0.7) * 0.004;
    data.push({
      date: d.toLocaleDateString("en-GB", { day: pts <= 30 ? "numeric" : undefined, month: "short", year: daysBack > 365 ? "2-digit" : undefined }),
      portfolio: i === pts ? base : Math.round(startCap * growth * (1 + noise)),
      benchmark: Math.round(startBench * bGrowth * (1 + noise * 0.5)),
      tbill: Math.round(startTbill * tGrowth),
      invested: Math.round(startCap + base * 0.04 * p),
    });
  }
  return data;
}

// ─── Store Context ────────────────────────────────────────────
interface StoreContextType {
  funds: Fund[];
  portfolio: PortfolioData;
  transactions: Transaction[];
  statements: Statement[];
  notifications: AppNotification[];
  unreadCount: number;
  toasts: Toast[];
  balanceHidden: boolean;
  toggleBalance: () => void;
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addInvestment: (fundIdOrParams: any, amount?: number, method?: string) => void;
  addWithdrawal: (fundIdOrParams: any, amount?: number, units?: number, destination?: string) => void;
  addSwitch: (fromFundIdOrParams: any, toFundId?: string, amount?: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || "usr_kwame";

  const [funds] = useState<Fund[]>(seedFunds as Fund[]);
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, seedTransactions as Transaction[])
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, seedNotifications as AppNotification[])
  );
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);

  const userTransactions = transactions.filter((t) => t.userId === userId);
  const userStatements = (seedStatements as Statement[]).filter((s) => s.userId === userId);
  const userNotifications = notifications.filter((n) => n.userId === userId);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const portfolio = computePortfolio(userId, funds, transactions);

  const toggleBalance = () => setBalanceHidden((b) => !b);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  }, [userId]);

  const addInvestment = useCallback((...args: any[]) => {
    let fundId: string;
    let amount: number;
    let method = "Direct Payment";
    if (typeof args[0] === "object" && args[0] !== null) {
      fundId = args[0].fundId;
      amount = args[0].amount;
      method = args[0].method || "Direct Payment";
    } else {
      fundId = args[0];
      amount = args[1];
      method = args[2] || "Direct Payment";
    }
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;
    const units = Number((amount / fund.nav).toFixed(2));
    const txn: Transaction = {
      id: `txn_${Date.now()}`, userId, date: new Date().toISOString().split("T")[0],
      type: "investment", fundId, fundName: fund.name, amount, units, nav: fund.nav,
      status: "completed", reference: `INV-${Date.now().toString().slice(-6)}`,
      description: `Investment via ${method}`, paymentMethod: method,
    };
    setTransactions((prev) => [txn, ...prev]);
    showToast(`GH₵\u00A0${amount.toLocaleString()} invested in ${fund.shortName}. ${units.toLocaleString()} units allocated.`);
  }, [funds, userId, showToast]) as any;

  const addWithdrawal = useCallback((...args: any[]) => {
    let fundId: string;
    let amount: number;
    let units = 0;
    let destination = "Bank Transfer";
    if (typeof args[0] === "object" && args[0] !== null) {
      fundId = args[0].fundId;
      amount = args[0].amount;
      units = args[0].units || 0;
      destination = args[0].destination || "Bank Transfer";
    } else {
      fundId = args[0];
      amount = args[1];
      units = args[2] || 0;
      destination = args[3] || "Bank Transfer";
    }
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;
    if (!units) units = Number((amount / fund.nav).toFixed(2));
    const txn: Transaction = {
      id: `txn_${Date.now()}`, userId, date: new Date().toISOString().split("T")[0],
      type: "withdrawal", fundId, fundName: fund.name, amount, units, nav: fund.nav,
      status: "processing", reference: `WDR-${Date.now().toString().slice(-6)}`,
      description: `Withdrawal to ${destination}`, paymentMethod: destination,
    };
    setTransactions((prev) => [txn, ...prev]);
    showToast(`Withdrawal of GH₵\u00A0${amount.toLocaleString()} from ${fund.shortName} is being processed.`, "info");
  }, [funds, userId, showToast]) as any;

  const addSwitch = useCallback((...args: any[]) => {
    let fromFundId: string;
    let toFundId: string;
    let amount: number;
    if (typeof args[0] === "object" && args[0] !== null) {
      fromFundId = args[0].fromFundId;
      toFundId = args[0].toFundId;
      amount = args[0].amount;
    } else {
      fromFundId = args[0];
      toFundId = args[1];
      amount = args[2];
    }
    const fromFund = funds.find((f) => f.id === fromFundId);
    const toFund = funds.find((f) => f.id === toFundId);
    if (!fromFund || !toFund) return;
    const outUnits = Number((amount / fromFund.nav).toFixed(2));
    const inUnits = Number((amount / toFund.nav).toFixed(2));
    const outId = `txn_${Date.now()}_out`;
    const inId = `txn_${Date.now()}_in`;
    const txnOut: Transaction = {
      id: outId, userId, date: new Date().toISOString().split("T")[0],
      type: "switch_out", fundId: fromFundId, fundName: fromFund.name, amount, units: outUnits, nav: fromFund.nav,
      status: "completed", reference: `SWT-${Date.now().toString().slice(-6)}`,
      description: `Switch to ${toFund.shortName}`, relatedTransactionId: inId,
    };
    const txnIn: Transaction = {
      id: inId, userId, date: new Date().toISOString().split("T")[0],
      type: "switch_in", fundId: toFundId, fundName: toFund.name, amount, units: inUnits, nav: toFund.nav,
      status: "completed", reference: `SWT-${Date.now().toString().slice(-6)}`,
      description: `Switch from ${fromFund.shortName}`, relatedTransactionId: outId,
    };
    setTransactions((prev) => [txnIn, txnOut, ...prev]);
    showToast(`Switched GH₵\u00A0${amount.toLocaleString()} from ${fromFund.shortName} to ${toFund.shortName}.`);
  }, [funds, userId, showToast]) as any;

  return (
    <StoreContext.Provider
      value={{
        funds, portfolio, transactions: userTransactions,
        statements: userStatements, notifications: userNotifications,
        unreadCount, toasts, balanceHidden, toggleBalance,
        showToast, removeToast, markNotificationRead, markAllNotificationsRead,
        addInvestment, addWithdrawal, addSwitch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

