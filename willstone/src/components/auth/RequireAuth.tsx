"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || user) return;
    const nextPath = redirectTo || pathname || "/dashboard";
    router.replace(`/auth?next=${encodeURIComponent(nextPath)}`);
  }, [isLoading, user, pathname, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] text-center shadow-sm">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#3f6256]" />
        <p className="city-kicker text-[#48605b]">Checking account</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
