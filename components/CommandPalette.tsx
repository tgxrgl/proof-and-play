"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { CATEGORY_MAP } from "@/lib/categories";
import type { PuzzleSummary } from "@/lib/puzzles";
import { CatStyle } from "./ui";

export function CommandPalette({ puzzles }: { puzzles: PuzzleSummary[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const toggle = () => { setQ(""); setI(0); setOpen(true); };
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest("input, textarea, select, [contenteditable]");
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); toggle(); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pp:open-palette", toggle);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pp:open-palette", toggle); };
  }, []);
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 0); }, [open]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const scored = puzzles.map((p) => {
      const hay = `${p.title} ${CATEGORY_MAP[p.category].name} ${p.difficulty} ${p.teaser}`.toLowerCase();
      const title = p.title.toLowerCase();
      if (!t.every((w) => hay.includes(w))) return null;
      return { p, score: t.reduce((s, w) => s + (title.startsWith(w) ? 3 : title.includes(w) ? 2 : 1), 0) };
    }).filter(Boolean) as { p: PuzzleSummary; score: number }[];
    return (t.length ? scored.sort((a, b) => b.score - a.score) : scored).slice(0, 8).map((x) => x.p);
  }, [q, puzzles]);

  if (!open) return null;
  const go = (p: PuzzleSummary) => { setOpen(false); router.push(`/puzzle/${p.slug}`); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div role="dialog" aria-modal="true" aria-label="Search puzzles" className="w-full max-w-xl animate-rise overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 text-muted" aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[i] ? `pal-${results[i].slug}` : undefined}
            placeholder="Search puzzles, topics, difficulty…" className="h-14 w-full bg-transparent text-base placeholder:text-muted focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(x + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(x - 1, 0)); }
              if (e.key === "Enter" && results[i]) go(results[i]);
            }} />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-muted">esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">Nothing matches “{q}”.</li>}
          {results.map((p, idx) => (
            <li key={p.slug} id={`pal-${p.slug}`} role="option" aria-selected={idx === i}>
              <CatStyle category={p.category}>
                <button type="button" onMouseEnter={() => setI(idx)} onClick={() => go(p)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${idx === i ? "bg-subtle" : ""}`}>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cat" aria-hidden="true" />
                  <span className="min-w-0 flex-1"><span className="block truncate font-serif text-base">{p.title}</span>
                    <span className="block truncate text-xs text-muted">{CATEGORY_MAP[p.category].name} · {p.difficulty} · ~{p.minutes} min</span></span>
                  {idx === i && <CornerDownLeft className="h-4 w-4 text-muted" aria-hidden="true" />}
                </button>
              </CatStyle>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
