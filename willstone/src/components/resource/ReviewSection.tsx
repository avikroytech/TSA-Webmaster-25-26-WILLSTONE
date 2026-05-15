"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import StarRating from "@/components/resource/StarRating";
import { useAuth } from "@/context/AuthContext";

type Review = {
  rating: number;
  text: string;
  name: string;
  created_at: string;
};

export default function ReviewSection({
  resourceId,
}: {
  resourceId: string | number;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const storageKey = `willstone-reviews-${resourceId}`;
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const submitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !user) return;
    const nextReviews = [
      {
        rating,
        text: text.trim(),
        name: user.name,
        created_at: new Date().toISOString(),
      },
      ...reviews,
    ].slice(0, 10);
    setReviews(nextReviews);
    window.localStorage.setItem(storageKey, JSON.stringify(nextReviews));
    setText("");
    setRating(5);
  };

  return (
    <section className="mt-12 rounded-3xl border border-road-paint/10 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl text-road-paint">
            Community Reviews
          </h2>
          <p className="text-sm font-bold text-asphalt/65">
            {reviews.length > 0
              ? `${average.toFixed(1)} average from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
              : "Be the first resident to review this resource."}
          </p>
        </div>
        <StarRating value={Math.round(average || rating)} readonly />
      </div>

      {!isLoading &&
        (user ? (
          <form
            onSubmit={submitReview}
            className="grid gap-3 rounded-2xl bg-[var(--background)] p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <StarRating value={rating} onChange={setRating} />
              <p className="text-sm font-black text-asphalt/70">
                Posting as {user.name}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                required
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Share a concise review"
                className="min-h-11 rounded-xl border border-road-paint/15 px-4 font-bold text-asphalt outline-none focus:ring-4 focus:ring-asphalt/10"
              />
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-road-paint px-5 font-black text-white"
              >
                Post
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-road-paint/10 bg-[var(--background)] p-5">
            <p className="font-bold leading-relaxed text-asphalt/75">
              Sign in to post a resource review under your resident account.
            </p>
            <Link
              href={`/auth?next=${encodeURIComponent(pathname)}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-road-paint px-5 font-black text-white"
            >
              Login to Review
            </Link>
          </div>
        ))}

      {reviews.length > 0 && (
        <div className="mt-6 grid gap-3">
          {reviews.map((review, index) => (
            <article
              key={`${review.created_at}-${index}`}
              className="rounded-2xl border border-road-paint/10 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-black text-asphalt">{review.name}</p>
                <StarRating value={review.rating} readonly />
              </div>
              <p className="text-sm font-bold leading-relaxed text-asphalt/70">
                {review.text}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
