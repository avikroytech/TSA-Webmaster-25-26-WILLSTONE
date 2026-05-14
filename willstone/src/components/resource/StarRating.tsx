"use client";

import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
};

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className="rounded p-1 text-[var(--brand-muted)] disabled:cursor-default"
            aria-label={`Rate ${star} stars`}
          >
            <Star size={20} fill={active ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}
