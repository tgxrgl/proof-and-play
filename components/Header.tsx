"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Moon, Search, Settings, Swords, Trophy, UserRound } from "lucide-react";
import { supabaseConfigured } from "@/lib/supabase/config";
import { actions } from "@/lib/store";
import { useProfile } from "@/lib/useProfile";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Explore", icon: Compass, also: ["/puzzle", "/category"] },
  { href: "/play", label: "Play", icon: Swords, also: ["/match"] },
  { href: "/leaderboard", label: "Ranks", icon: Trophy, also: [] as string[] },
  { href: "/progress", label: "Progress", icon: BarChart3, also: [] as string[] },
  { href: "/settings", label: "Settings", icon: Settings, also: [] as string[] },
];

export function Header() {
  const path = usePathname();
  const { loading, profile } = useProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-lg tracking-tight">
          <svg viewBox="0 0 28 28" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22 L14 5 L24 22 Z" /><circle cx="14" cy="16" r="3.2" fill="currentColor" stroke="none" />
          </svg>
          <span className="hidden sm:inline">Proof <span className="text-muted">&amp;</span> Play</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon, also }) => {
            const active = href === "/" ? path === "/" || also.some((a) => path.startsWith(a)) : path.startsWith(href) || also.some((a) => path.startsWith(a));
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("btn btn-ghost px-2.5 sm:px-3", active && "bg-subtle text-ink")}>
                <Icon className="h-4 w-4" aria-hidden="true" /><span className="hidden lg:inline">{label}</span>
                <span className="sr-only lg:hidden">{label}</span>
              </Link>
            );
          })}
          <button type="button" className="btn btn-outline ml-1 gap-2 px-2.5 text-muted sm:px-3" aria-label="Search puzzles" onClick={() => window.dispatchEvent(new Event("pp:open-palette"))}>
            <Search className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Search</span><kbd className="hidden rounded border border-line px-1.5 text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button type="button" className="btn btn-ghost px-2.5" aria-label="Toggle light and dark theme"
            onClick={() => actions.updateSettings({ theme: document.documentElement.classList.contains("dark") ? "light" : "dark" })}>
            <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
            <svg viewBox="0 0 24 24" className="hidden h-4 w-4 dark:block" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          </button>
          {supabaseConfigured && !loading && (profile ? (
            <Link href="/account" className="btn btn-outline ml-1 gap-2 px-2.5 sm:px-3" aria-label="Your account">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="hidden max-w-[9rem] truncate sm:inline">{profile.username}</span>
              <span className="font-mono text-xs text-muted">{profile.rating}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary ml-1 px-3">Sign in</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
