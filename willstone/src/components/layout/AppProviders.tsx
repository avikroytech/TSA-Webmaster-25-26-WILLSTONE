"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </AuthProvider>
  );
}
