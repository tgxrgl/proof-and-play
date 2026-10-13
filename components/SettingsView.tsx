"use client";
import { Monitor, Moon, Sun, Trash2 } from "lucide-react";
import { useHydrated, useStore } from "@/lib/hooks";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

const THEMES = [
  { v: "light", label: "Light", icon: Sun },
  { v: "dark", label: "Dark", icon: Moon },
  { v: "system", label: "System", icon: Monitor },
] as const;

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 py-4">
      <span><span className="block text-sm font-medium">{label}</span><span className="block text-sm text-muted">{hint}</span></span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[hsl(var(--accent))] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-surface after:shadow after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

export function SettingsView() {
  const { settings, progress, bookmarks } = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="skeleton h-64" aria-busy="true" />;
  const solved = Object.values(progress).filter((p) => p.status === "solved").length;

  return (
    <div className="space-y-8">
      <section className="card p-6" aria-labelledby="theme">
        <h2 id="theme" className="text-xl">Appearance</h2>
        <div role="radiogroup" aria-label="Theme" className="mt-4 grid grid-cols-3 gap-2">
          {THEMES.map(({ v, label, icon: Icon }) => (
            <button key={v} type="button" role="radio" aria-checked={settings.theme === v} onClick={() => actions.updateSettings({ theme: v })}
              className={cn("btn btn-outline flex-col gap-1.5 py-4", settings.theme === v && "!border-ink ring-1 ring-ink")}>
              <Icon className="h-5 w-5" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
      </section>

      <section className="card divide-y divide-line px-6" aria-labelledby="prefs">
        <h2 id="prefs" className="py-4 text-xl">Preferences</h2>
        <Toggle label="Show estimated solving times" hint="Display “~10 min” on cards and puzzle pages." checked={settings.showTimes} onChange={(v) => actions.updateSettings({ showTimes: v })} />
        <Toggle label="Hide solved puzzles in the library" hint="Solved puzzles disappear from the default view. Use the Solved filter to see them." checked={settings.autoHideSolved} onChange={(v) => actions.updateSettings({ autoHideSolved: v })} />
      </section>

      <section className="card p-6" aria-labelledby="data">
        <h2 id="data" className="text-xl">Your data</h2>
        <p className="mt-2 text-sm text-muted">Progress, notes and bookmarks live only in this browser&apos;s local storage. Nothing is sent anywhere. Currently saved: {solved} solved, {bookmarks.length} bookmarked.</p>
        <button type="button" className="btn btn-outline mt-4 text-red-700 dark:text-red-300"
          onClick={() => { if (window.confirm("Erase all progress, notes and bookmarks on this device? This cannot be undone.")) actions.resetAll(); }}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />Reset all progress
        </button>
      </section>
    </div>
  );
}
