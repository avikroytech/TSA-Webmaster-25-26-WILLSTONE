"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

export type SavedResource = {
  id: string;
  title: string;
  slug: string;
  category?: string;
  address?: string;
  description?: string;
  image?: string;
};

type SavedResourcesContextValue = {
  savedResources: SavedResource[];
  isLoadingSaved: boolean;
  isSaved: (resourceId: string | number) => boolean;
  toggleSaved: (resource: SavedResource) => Promise<void>;
  removeSaved: (resourceId: string | number) => Promise<void>;
};

const SavedResourcesContext = createContext<SavedResourcesContextValue | null>(
  null,
);

type SavedResourceRow = {
  resource_id: string;
  title: string;
  slug: string;
  category: string | null;
  address: string | null;
  description: string | null;
  image: string | null;
  created_at?: string | null;
};

const getLegacyStorageKey = (userId: string) =>
  `willstone-saved-resources-${userId}`;

const normalizeSavedResource = (resource: SavedResource): SavedResource => ({
  ...resource,
  id: String(resource.id),
  slug: resource.slug || String(resource.id),
});

const toSavedResource = (row: SavedResourceRow): SavedResource => ({
  id: row.resource_id,
  title: row.title,
  slug: row.slug,
  category: row.category || undefined,
  address: row.address || undefined,
  description: row.description || undefined,
  image: row.image || undefined,
});

const toSavedResourceRow = (userId: string, resource: SavedResource) => ({
  user_id: userId,
  resource_id: resource.id,
  title: resource.title,
  slug: resource.slug,
  category: resource.category || null,
  address: resource.address || null,
  description: resource.description || null,
  image: resource.image || null,
});

export function SavedResourcesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  useEffect(() => {
    let active = true;

    if (isLoading) return;
    if (!user) {
      setSavedResources([]);
      setIsLoadingSaved(false);
      return;
    }

    const loadSavedResources = async () => {
      setIsLoadingSaved(true);

      try {
        const legacySaved = window.localStorage.getItem(
          getLegacyStorageKey(user.id),
        );

        if (legacySaved) {
          const parsedLegacy = JSON.parse(legacySaved) as SavedResource[];
          const legacyRows = parsedLegacy
            .map(normalizeSavedResource)
            .map((resource) => toSavedResourceRow(user.id, resource));

          if (legacyRows.length > 0) {
            const { error: migrationError } = await supabase
              .from("saved_resources")
              .upsert(legacyRows, { onConflict: "user_id,resource_id" });

            if (!migrationError) {
              window.localStorage.removeItem(getLegacyStorageKey(user.id));
            } else {
              console.warn("Saved resource migration failed:", migrationError);
            }
          }
        }

        const { data, error } = await supabase
          .from("saved_resources")
          .select(
            "resource_id,title,slug,category,address,description,image,created_at",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (active) {
          setSavedResources((data as SavedResourceRow[]).map(toSavedResource));
        }
      } catch (error) {
        console.warn("Saved resources could not be loaded:", error);
        if (active) setSavedResources([]);
      } finally {
        if (active) setIsLoadingSaved(false);
      }
    };

    loadSavedResources();

    return () => {
      active = false;
    };
  }, [user, isLoading]);

  const isSaved = useCallback(
    (resourceId: string | number) =>
      savedResources.some((resource) => resource.id === String(resourceId)),
    [savedResources],
  );

  const toggleSaved = useCallback(
    async (resource: SavedResource) => {
      if (!user) return;
      const normalizedResource = normalizeSavedResource(resource);
      const wasSaved = isSaved(normalizedResource.id);
      const previousResources = savedResources;
      const nextResources = wasSaved
        ? savedResources.filter((item) => item.id !== normalizedResource.id)
        : [normalizedResource, ...savedResources].slice(0, 100);

      setSavedResources(nextResources);

      const { error } = wasSaved
        ? await supabase
            .from("saved_resources")
            .delete()
            .eq("user_id", user.id)
            .eq("resource_id", normalizedResource.id)
        : await supabase
            .from("saved_resources")
            .upsert([toSavedResourceRow(user.id, normalizedResource)], {
              onConflict: "user_id,resource_id",
            });

      if (error) {
        console.warn("Saved resource update failed:", error);
        setSavedResources(previousResources);
      }
    },
    [user, savedResources, isSaved],
  );

  const removeSaved = useCallback(
    async (resourceId: string | number) => {
      if (!user) return;
      const normalizedId = String(resourceId);
      const previousResources = savedResources;
      setSavedResources(
        savedResources.filter((resource) => resource.id !== normalizedId),
      );

      const { error } = await supabase
        .from("saved_resources")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", normalizedId);

      if (error) {
        console.warn("Saved resource removal failed:", error);
        setSavedResources(previousResources);
      }
    },
    [user, savedResources],
  );

  const value = useMemo(
    () => ({
      savedResources,
      isLoadingSaved,
      isSaved,
      toggleSaved,
      removeSaved,
    }),
    [savedResources, isLoadingSaved, isSaved, toggleSaved, removeSaved],
  );

  return (
    <SavedResourcesContext.Provider value={value}>
      {children}
    </SavedResourcesContext.Provider>
  );
}

export function useSavedResources() {
  const value = useContext(SavedResourcesContext);
  if (!value)
    throw new Error(
      "useSavedResources must be used inside SavedResourcesProvider",
    );
  return value;
}
