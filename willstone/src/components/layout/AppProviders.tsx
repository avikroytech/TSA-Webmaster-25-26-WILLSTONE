"use client";

import type React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SavedResourcesProvider } from "@/context/SavedResourcesContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SavedResourcesProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </SavedResourcesProvider>
    </AuthProvider>
  );
}
