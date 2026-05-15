"use client";

import { Bookmark, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RequireAuth from "@/components/auth/RequireAuth";
import Footer from "@/components/home/Footer";
import SubpageHero from "@/components/layout/SubpageHero";
import { useSavedResources } from "@/context/SavedResourcesContext";

export default function SavedPage() {
  const { savedResources, removeSaved } = useSavedResources();

  return (
    <div className="min-h-screen bg-[#f8f4ec]">
      <main>
        <SubpageHero
          title="Saved Resources"
          eyebrow="Resident bookmarks"
          description="Keep useful Willstone services, programs, and public resources close at hand."
          image="/img/city-home2.jpg"
        />
        <section className="px-[var(--space-page-x)] py-[var(--space-section-tight)]">
          <div className="mx-auto max-w-6xl">
            <RequireAuth redirectTo="/saved">
              {savedResources.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {savedResources.map((resource) => (
                    <article
                      key={resource.id}
                      className="overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fbfaf7] shadow-sm"
                    >
                      <Link
                        href={`/resource-hub/${resource.slug}`}
                        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b98d63]"
                      >
                        <div className="relative h-44 bg-[#173b3f]/8">
                          {resource.image ? (
                            <Image
                              src={resource.image}
                              alt={resource.title}
                              fill
                              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#3f6256]">
                              <Bookmark size={42} />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="city-kicker text-[#48605b]">
                            {resource.category || "Community Resource"}
                          </p>
                          <h2 className="mt-2 font-display text-3xl font-black leading-tight text-[#173b3f]">
                            {resource.title}
                          </h2>
                          {resource.description && (
                            <p className="mt-3 line-clamp-3 text-sm font-semibold leading-relaxed text-[#48605b]">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </Link>
                      <div className="border-t border-[#ded6c9] p-4">
                        <button
                          type="button"
                          onClick={() => removeSaved(resource.id)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-black text-[#173b3f] hover:bg-[#f8f4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b98d63]"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-[#ded6c9] bg-[#fbfaf7] p-10 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-[#f8f4ec] text-[#b98d63]">
                    <Bookmark size={30} />
                  </div>
                  <h2 className="font-display text-4xl font-black text-[#173b3f]">
                    No saved resources yet
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-relaxed text-[#48605b]">
                    Save resources from the directory or a resource detail page
                    to build your personal list.
                  </p>
                  <Link
                    href="/resource-hub"
                    className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#173b3f] px-5 text-sm font-black text-[#fbfaf7] hover:bg-[#3f6256]"
                  >
                    Browse Resources
                  </Link>
                </div>
              )}
            </RequireAuth>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
