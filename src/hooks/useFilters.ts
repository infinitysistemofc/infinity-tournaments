import { useState, useEffect, useCallback } from "react";

export interface HistoryFilters {
  gameId?: string;
  status?: string[];
  period?: string;
  circuitId?: string;
  positionMin?: number;
  positionMax?: number;
  pointsMin?: number;
  pointsMax?: number;
}

export interface AchievementFilters {
  type?: string[];
  period?: string;
}

export function useFilters<T extends Record<string, any>>(
  storageKey: string,
  initialFilters: T
) {
  const [filters, setFilters] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...initialFilters, ...JSON.parse(stored) } : initialFilters;
    } catch {
      return initialFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filters to localStorage:", error);
    }
  }, [filters, storageKey]);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).some(
      (key) =>
        filters[key as keyof T] !== undefined &&
        filters[key as keyof T] !== initialFilters[key as keyof T]
    );
  }, [filters, initialFilters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  };
}
