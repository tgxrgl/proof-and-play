"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./store";
import type { PuzzleProgress } from "./types";

export const useStore = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
export const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);

export const blankProgress: PuzzleProgress = {
  status: "unsolved", attempted: false, hintsShown: 0, solutionShown: false, notes: "", updatedAt: 0,
};
export const useProgress = (slug: string) => useStore().progress[slug] ?? blankProgress;

/** Deterministic puzzle of the day, resolved after mount so server and client markup agree. */
export function useDailySlug(slugs: string[]) {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => { const d = new Date(); setDay(Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000)); }, []);
  return day === null || slugs.length === 0 ? null : slugs[day % slugs.length];
}
