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
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) => { success: boolean; error?: string };
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
    setUsers(seedUsers as User[]);
    if (storedSession) {
      setSession(storedSession);
    }
    setIsLoading(false);
  }, []);

  const rawUser = session ? (users.find((u) => u.id === session.userId) || null) : null;
  const user = rawUser ? { ...rawUser, name: `${rawUser.firstName} ${rawUser.lastName}` } : null;

  const login = useCallback((email: string, password: string) => {
    const found = (seedUsers as User[]).find(
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
  }, []);

  const signup = useCallback((data: { firstName: string; lastName: string; email: string; password: string }) => {
    const existing = (seedUsers as User[]).find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }
    // For prototype, just log them in as Kwame
    const defaultUser = (seedUsers as User[])[0];
    const newSession: AuthSession = {
      userId: defaultUser.id,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      accountType: "individual",
      loginTime: new Date().toISOString(),
      isDemo: true,
    };
    setSession(newSession);
    saveToStorage(STORAGE_KEYS.SESSION, newSession);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    removeFromStorage(STORAGE_KEYS.SESSION);
  }, []);

  const switchPersona = useCallback((userId: string) => {
    const found = (seedUsers as User[]).find((u) => u.id === userId);
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
  }, []);

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

