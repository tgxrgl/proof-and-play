import type { PuzzleProgress, PuzzleStatus, Settings } from "./types";

export interface StoreState {
  progress: Record<string, PuzzleProgress>;
  bookmarks: string[];
  settings: Settings;
}

const KEY = "pp:v1";
export const DEFAULT_STATE: StoreState = {
  progress: {},
  bookmarks: [],
  settings: { theme: "system", showTimes: true, autoHideSolved: false },
};

let state: StoreState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    state = {
      progress: p.progress && typeof p.progress === "object" ? p.progress : {},
      bookmarks: Array.isArray(p.bookmarks) ? p.bookmarks : [],
      settings: { ...DEFAULT_STATE.settings, ...(p.settings ?? {}) },
    };
  } catch {
    /* corrupt or unavailable storage: start fresh */
  }
}

function commit(next: StoreState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or private mode: keep working in memory */
  }
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      state = DEFAULT_STATE;
      load();
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
export const getSnapshot = () => (load(), state);
export const getServerSnapshot = () => DEFAULT_STATE;

const blank = (): PuzzleProgress => ({
  status: "unsolved", attempted: false, hintsShown: 0, solutionShown: false, notes: "", updatedAt: 0,
});

function patch(slug: string, change: Partial<PuzzleProgress>) {
  load();
  const cur = state.progress[slug] ?? blank();
  commit({ ...state, progress: { ...state.progress, [slug]: { ...cur, ...change, updatedAt: Date.now() } } });
}

export const actions = {
  setStatus: (slug: string, status: PuzzleStatus) => patch(slug, { status, attempted: true }),
  showHint: (slug: string, count: number) => patch(slug, { hintsShown: count, attempted: true }),
  revealSolution: (slug: string) => patch(slug, { solutionShown: true, attempted: true }),
  resetPuzzle: (slug: string) => patch(slug, { hintsShown: 0, solutionShown: false }),
  setNotes: (slug: string, notes: string) => patch(slug, { notes, ...(notes.trim() ? { attempted: true } : {}) }),
  toggleBookmark: (slug: string) => {
    load();
    const has = state.bookmarks.includes(slug);
    commit({ ...state, bookmarks: has ? state.bookmarks.filter((s) => s !== slug) : [...state.bookmarks, slug] });
  },
  updateSettings: (s: Partial<Settings>) => {
    load();
    commit({ ...state, settings: { ...state.settings, ...s } });
  },
  resetAll: () => {
    load();
    commit({ ...DEFAULT_STATE, settings: state.settings });
  },
};
