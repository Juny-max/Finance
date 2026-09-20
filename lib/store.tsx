"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  Fund, Transaction, Statement, AppNotification,
  PortfolioData, Holding, PortfolioSummary,
  Toast, Timeframe, ChartDataPoint, OnboardingApplication,
} from "./types";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./persistence";
import { useAuth } from "./auth";
import seedFunds from "@/data/funds.json";
import seedTransactions from "@/data/transactions.json";
import seedStatements from "@/data/statements.json";
import seedNotifications from "@/data/notifications.json";
import seedApplications from "@/data/onboarding_applications.json";

// ─── Computed portfolio data from seed ────────────────────────
function computePortfolio(userId: string, funds: Fund[], transactions: Transaction[]): PortfolioData {
  const fiFund = funds.find(f => f.id.includes("fixed-income")) || funds[0];
  const balFund = funds.find(f => f.id.includes("balanced") && !f.id.includes("global")) || funds[1] || funds[0];
  const globFund = funds.find(f => f.id.includes("global")) || funds[2] || funds[0];

  // Baseline holdings per persona (authentic starting allocations)
  const holdingsMap: Record<string, { units: number; invested: number }> = {};
  if (userId === "usr_gcb") {
    const v1 = 8500000;
    const v2 = 4250000;
    const v3 = 2100000;
    if (fiFund) holdingsMap[fiFund.id] = { units: Number((v1 / fiFund.nav).toFixed(2)), invested: 7225000 };
    if (balFund) holdingsMap[balFund.id] = { units: Number((v2 / balFund.nav).toFixed(2)), invested: 3485000 };
    if (globFund) holdingsMap[globFund.id] = { units: Number((v3 / globFund.nav).toFixed(2)), invested: 1729500 };
  } else if (userId === "usr_kwame") {
    const v1 = 72400;
    const v2 = 51250;
    const v3 = 25000;
    if (fiFund) holdingsMap[fiFund.id] = { units: Number((v1 / fiFund.nav).toFixed(2)), invested: 60816 };
    if (balFund) holdingsMap[balFund.id] = { units: Number((v2 / balFund.nav).toFixed(2)), invested: 41512.5 };
    if (globFund) holdingsMap[globFund.id] = { units: Number((v3 / globFund.nav).toFixed(2)), invested: 22911.5 };
  }

  // Apply transactions created during user session (id starting with txn_ and numeric timestamp)
  const dynamicTxns = transactions.filter(
    (t) => t.userId === userId && /^txn_\d{10,}/.test(t.id) && t.status === "completed"
  );
  for (const txn of dynamicTxns) {
    const normId = txn.fundId.replace(/^(bora|aura)-/, "");
    const matchingFund = funds.find((f) => f.id === txn.fundId || f.id.replace(/^(bora|aura)-/, "") === normId) || funds[0];
    const targetId = matchingFund ? matchingFund.id : txn.fundId;

    if (!holdingsMap[targetId]) holdingsMap[targetId] = { units: 0, invested: 0 };
    const h = holdingsMap[targetId];
    const u = txn.units || (matchingFund ? txn.amount / matchingFund.nav : 0);
    if (txn.type === "investment" || txn.type === "dividend" || txn.type === "switch_in") {
      h.units += u;
      h.invested += txn.amount;
    } else if (txn.type === "withdrawal" || txn.type === "switch_out") {
      h.units = Math.max(0, h.units - u);
      h.invested = Math.max(0, h.invested - txn.amount);
    }
  }

  const holdings: Holding[] = [];
  let totalValue = 0;
  let totalInvested = 0;

  for (const [fundId, data] of Object.entries(holdingsMap)) {
    if (data.units <= 0.001) continue;
    const normId = fundId.replace(/^(bora|aura)-/, "");
    const fund = funds.find((f) => f.id === fundId || f.id.replace(/^(bora|aura)-/, "") === normId);
    if (!fund) continue;
    const currentValue = Number((data.units * fund.nav).toFixed(2));
    const gainLoss = Number((currentValue - data.invested).toFixed(2));
    totalValue += currentValue;
    totalInvested += Math.max(0, data.invested);
    holdings.push({
      fundId: fund.id,
      fundName: fund.name,
      units: Number(data.units.toFixed(2)),
      averageCost: data.invested > 0 && data.units > 0 ? Number((data.invested / data.units).toFixed(4)) : fund.nav,
      currentValue,
      gainLoss,
      gainLossPercent: data.invested > 0 ? Number(((gainLoss / data.invested) * 100).toFixed(2)) : 0,
      allocation: 0,
    });
  }

  // Compute allocation percentages
  for (const h of holdings) {
    h.allocation = totalValue > 0 ? Number(((h.currentValue / totalValue) * 100).toFixed(1)) : 0;
  }

  const totalGain = totalValue - totalInvested;
  const summary: PortfolioSummary = {
    totalValue, totalInvested, totalGain,
    gainPercent: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    ytdReturn: userId === "usr_gcb" ? 19.4 : userId === "usr_kwame" ? 18.6 : 0,
    dayChange: userId === "usr_gcb" ? 12400 : userId === "usr_kwame" ? 182.4 : 0,
    dayChangePercent: userId === "usr_gcb" ? 0.08 : userId === "usr_kwame" ? 0.12 : 0,
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
  allTransactions: Transaction[];
  applications: OnboardingApplication[];
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
  addApplication: (app: OnboardingApplication) => void;
  approveApplication: (id: string, notes?: string) => void;
  rejectApplication: (id: string, notes?: string) => void;
  approveTransaction: (id: string) => void;
  rejectTransaction: (id: string, reason?: string) => void;
  updateFundNav: (fundId: string, newNav: number, dailyChangePercent?: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, updateUserKycStatus } = useAuth();
  const userId = user?.id || "usr_kwame";

  const [funds, setFunds] = useState<Fund[]>(() =>
    loadFromStorage(STORAGE_KEYS.FUNDS, seedFunds as Fund[])
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, seedTransactions as Transaction[])
  );
  const [applications, setApplications] = useState<OnboardingApplication[]>(() =>
    loadFromStorage(STORAGE_KEYS.ONBOARDING_APPLICATIONS, seedApplications as OnboardingApplication[])
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, seedNotifications as AppNotification[])
  );
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.FUNDS, funds); }, [funds]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ONBOARDING_APPLICATIONS, applications); }, [applications]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);

  // Real-time synchronization across browser tabs via storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.FUNDS && e.newValue) {
        try { setFunds(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.TRANSACTIONS && e.newValue) {
        try { setTransactions(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.ONBOARDING_APPLICATIONS && e.newValue) {
        try { setApplications(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.NOTIFICATIONS && e.newValue) {
        try { setNotifications(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
    let status: "completed" | "processing" | "pending" | "failed" = "completed";
    let targetUserId = userId;
    if (typeof args[0] === "object" && args[0] !== null) {
      fundId = args[0].fundId;
      amount = args[0].amount;
      method = args[0].method || "Direct Payment";
      if (args[0].status) status = args[0].status;
      if (args[0].userId) targetUserId = args[0].userId;
    } else {
      fundId = args[0];
      amount = args[1];
      method = args[2] || "Direct Payment";
    }
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;
    const units = Number((amount / fund.nav).toFixed(2));
    const txn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: targetUserId,
      date: new Date().toISOString().split("T")[0],
      type: "investment",
      fundId,
      fundName: fund.name,
      amount,
      units,
      nav: fund.nav,
      status,
      reference: `INV-${Date.now().toString().slice(-6)}`,
      description: `Investment via ${method}`,
      paymentMethod: method,
    };
    setTransactions((prev) => [txn, ...prev]);
    if (status === "completed") {
      showToast(`GH₵\u00A0${amount.toLocaleString()} invested in ${fund.shortName}. ${units.toLocaleString()} units allocated.`);
    } else {
      showToast(`Investment of GH₵\u00A0${amount.toLocaleString()} submitted for settlement.`, "info");
    }
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

  const addApplication = useCallback((app: OnboardingApplication) => {
    setApplications((prev) => [app, ...prev]);
  }, []);

  const approveApplication = useCallback((id: string, notes?: string) => {
    let targetEmail = "";
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          targetEmail = app.email;
          return {
            ...app,
            status: "approved" as const,
            reviewedBy: "Audrey Mensah (Compliance Officer)",
            reviewedAt: new Date().toISOString(),
            complianceNotes: notes || app.complianceNotes || "Approved and verified under SEC Ghana Guidelines.",
          };
        }
        return app;
      })
    );
    if (targetEmail) {
      updateUserKycStatus(targetEmail, "verified");
    }
    showToast("Application approved. Client KYC marked as verified.");
  }, [showToast, updateUserKycStatus]);

  const rejectApplication = useCallback((id: string, notes?: string) => {
    let targetEmail = "";
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          targetEmail = app.email;
          return {
            ...app,
            status: "rejected" as const,
            reviewedBy: "Audrey Mensah (Compliance Officer)",
            reviewedAt: new Date().toISOString(),
            complianceNotes: notes || "Rejected due to incomplete or unverified documentation.",
          };
        }
        return app;
      })
    );
    if (targetEmail) {
      updateUserKycStatus(targetEmail, "rejected");
    }
    showToast("Application marked as rejected.", "info");
  }, [showToast, updateUserKycStatus]);

  const approveTransaction = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t))
    );
    showToast(`Transaction ${id} settled and marked completed.`);
  }, [showToast]);

  const rejectTransaction = useCallback((id: string, reason?: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "failed" as const, description: `${t.description} (Declined: ${reason || "Failed compliance review"})` }
          : t
      )
    );
    showToast(`Transaction ${id} declined.`, "error");
  }, [showToast]);

  const updateFundNav = useCallback((fundId: string, newNav: number, dailyChangePercent?: number) => {
    setFunds((prev) =>
      prev.map((f) => {
        if (f.id === fundId) {
          const changePercent = dailyChangePercent !== undefined
            ? dailyChangePercent
            : Number((((newNav - f.nav) / f.nav) * 100).toFixed(2));
          const changeVal = Number((newNav - f.nav).toFixed(4));
          return {
            ...f,
            nav: newNav,
            dailyChange: changeVal,
            dailyChangePercent: changePercent,
            navDate: new Date().toISOString().split("T")[0],
          };
        }
        return f;
      })
    );
    showToast("Fund NAV updated successfully.");
  }, [showToast]);

  return (
    <StoreContext.Provider
      value={{
        funds, portfolio, transactions: userTransactions, allTransactions: transactions,
        applications,
        statements: userStatements, notifications: userNotifications,
        unreadCount, toasts, balanceHidden, toggleBalance,
        showToast, removeToast, markNotificationRead, markAllNotificationsRead,
        addInvestment, addWithdrawal, addSwitch,
        addApplication, approveApplication, rejectApplication,
        approveTransaction, rejectTransaction, updateFundNav,
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
