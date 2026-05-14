"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WillstoneUser = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: WillstoneUser | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WillstoneUser | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("willstone-user");
    if (!saved) return;
    try {
      setUser(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem("willstone-user");
    }
  }, []);

  const login = (email: string, name?: string) => {
    const nextUser = { email, name: name?.trim() || email.split("@")[0] || "Resident" };
    setUser(nextUser);
    window.localStorage.setItem("willstone-user", JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("willstone-user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
