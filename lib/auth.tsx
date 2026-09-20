"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { User, AuthSession } from "./types";
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from "./persistence";
import seedUsers from "@/data/users.json";

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: { firstName: string; lastName: string; email: string; password: string; accountType?: User["accountType"]; riskProfile?: User["riskProfile"]; phone?: string }) => { success: boolean; error?: string };
  logout: () => void;
  switchPersona: (userId: string) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    const storedSession = loadFromStorage<AuthSession | null>(STORAGE_KEYS.SESSION, null);
    setUsers(loadFromStorage<User[]>(STORAGE_KEYS.USERS, seedUsers as User[]));
    if (storedSession) {
      setSession(storedSession);
    }
    setIsLoading(false);
  }, []);

  const rawUser = session ? (users.find((u) => u.id === session.userId) || null) : null;
  const user = rawUser ? { ...rawUser, name: `${rawUser.firstName} ${rawUser.lastName}` } : null;

  const login = useCallback((email: string, password: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password." };
    }
    const newSession: AuthSession = {
      userId: found.id,
      email: found.email,
      name: `${found.firstName} ${found.lastName}`,
      accountType: found.accountType,
      loginTime: new Date().toISOString(),
      isDemo: true,
    };
    setSession(newSession);
    saveToStorage(STORAGE_KEYS.SESSION, newSession);
    return { success: true };
  }, [users]);

  const signup = useCallback((data: { firstName: string; lastName: string; email: string; password: string; accountType?: User["accountType"]; riskProfile?: User["riskProfile"]; phone?: string }) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }
    const generatedId = `usr_${Date.now()}`;
    const createdUser: User = {
      id: generatedId,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      accountNumber: `AM-${Math.floor(10000 + Math.random() * 90000)}`,
      accountType: data.accountType || "individual",
      riskProfile: data.riskProfile || "balanced",
      phone: data.phone || "",
      address: "",
      city: "Accra",
      country: "Ghana",
      kycStatus: "pending",
      joinDate: new Date().toISOString().slice(0, 10),
      advisor: { name: "Client Services Team", role: "Relationship Management", email: "support@auraasset.com", phone: "+233 30 277 4839" },
      bankAccounts: [],
      momoAccounts: [],
      beneficiaries: [],
    };
    const updatedUsers = [...users, createdUser];
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    const newSession: AuthSession = {
      userId: createdUser.id,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      accountType: createdUser.accountType,
      loginTime: new Date().toISOString(),
      isDemo: true,
    };
    setSession(newSession);
    saveToStorage(STORAGE_KEYS.SESSION, newSession);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setSession(null);
    removeFromStorage(STORAGE_KEYS.SESSION);
  }, []);

  const switchPersona = useCallback((userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (!found) return;
    const newSession: AuthSession = {
      userId: found.id,
      email: found.email,
      name: `${found.firstName} ${found.lastName}`,
      accountType: found.accountType,
      loginTime: new Date().toISOString(),
      isDemo: true,
    };
    setSession(newSession);
    saveToStorage(STORAGE_KEYS.SESSION, newSession);
  }, [users]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        users,
        isAuthenticated: !!session,
        isLoading,
        login,
        signup,
        logout,
        switchPersona,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
