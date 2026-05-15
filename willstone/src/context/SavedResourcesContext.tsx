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
  isSaved: (resourceId: string | number) => boolean;
  toggleSaved: (resource: SavedResource) => void;
  removeSaved: (resourceId: string | number) => void;
};

const SavedResourcesContext = createContext<SavedResourcesContextValue | null>(
  null,
);

const getStorageKey = (userId: string) => `willstone-saved-resources-${userId}`;

export function SavedResourcesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setSavedResources([]);
      return;
    }

    const saved = window.localStorage.getItem(getStorageKey(user.id));
    if (!saved) {
      setSavedResources([]);
      return;
    }

    try {
      setSavedResources(JSON.parse(saved) as SavedResource[]);
    } catch {
      window.localStorage.removeItem(getStorageKey(user.id));
      setSavedResources([]);
    }
  }, [user, isLoading]);

  const persist = useCallback(
    (nextResources: SavedResource[]) => {
      setSavedResources(nextResources);
      if (user) {
        window.localStorage.setItem(
          getStorageKey(user.id),
          JSON.stringify(nextResources),
        );
      }
    },
    [user],
  );

  const isSaved = useCallback(
    (resourceId: string | number) =>
      savedResources.some((resource) => resource.id === String(resourceId)),
    [savedResources],
  );

  const toggleSaved = useCallback(
    (resource: SavedResource) => {
      if (!user) return;
      const normalizedResource = {
        ...resource,
        id: String(resource.id),
      };
      const nextResources = isSaved(normalizedResource.id)
        ? savedResources.filter((item) => item.id !== normalizedResource.id)
        : [normalizedResource, ...savedResources].slice(0, 100);
      persist(nextResources);
    },
    [user, savedResources, isSaved, persist],
  );

  const removeSaved = useCallback(
    (resourceId: string | number) => {
      if (!user) return;
      persist(
        savedResources.filter((resource) => resource.id !== String(resourceId)),
      );
    },
    [user, savedResources, persist],
  );

  const value = useMemo(
    () => ({ savedResources, isSaved, toggleSaved, removeSaved }),
    [savedResources, isSaved, toggleSaved, removeSaved],
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
