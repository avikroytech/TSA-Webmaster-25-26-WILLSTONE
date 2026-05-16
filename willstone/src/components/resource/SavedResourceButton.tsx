"use client";

import { Bookmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  type SavedResource,
  useSavedResources,
} from "@/context/SavedResourcesContext";

export default function SavedResourceButton({
  resource,
  variant = "card",
}: {
  resource: SavedResource;
  variant?: "card" | "detail";
}) {
  const { user, isLoading } = useAuth();
  const { isLoadingSaved, isSaved, toggleSaved } = useSavedResources();
  const router = useRouter();
  const pathname = usePathname();
  const saved = isSaved(resource.id);

  const handleClick = async () => {
    if (!user) {
      router.push(`/auth?next=${encodeURIComponent(pathname || "/saved")}`);
      return;
    }
    await toggleSaved(resource);
  };

  const label = saved ? "Remove from saved resources" : "Save resource";
  const detailClasses =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#cfc7ba] bg-[#fbfaf7] px-4 text-sm font-black text-[#173b3f] shadow-sm hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]";
  const cardClasses =
    "absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#ded6c9] bg-[#fbfaf7]/95 text-[#173b3f] shadow-sm backdrop-blur hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || isLoadingSaved}
      aria-pressed={saved}
      aria-label={label}
      className={variant === "detail" ? detailClasses : cardClasses}
    >
      <Bookmark
        size={18}
        className={saved ? "fill-[#b98d63] text-[#173b3f]" : ""}
      />
      {variant === "detail" && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
