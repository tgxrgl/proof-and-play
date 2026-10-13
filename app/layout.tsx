import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { ThemeSync } from "@/components/ThemeSync";
import { CommandPalette } from "@/components/CommandPalette";
import { getSummaries } from "@/lib/puzzles";

export const metadata: Metadata = {
  title: { default: "Proof & Play — mathematical puzzles", template: "%s · Proof & Play" },
  description: "A library of elegant mathematical puzzles with progressive hints and full solutions, plus ranked 1v1 matches.",
};
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fbfaf7" }, { media: "(prefers-color-scheme: dark)", color: "#0e1017" }],
};

const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem('pp:v1')||'{}').settings;var t=(s&&s.theme)||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
        <ThemeSync />
        <Header />
        <CommandPalette puzzles={getSummaries()} />
        <main id="main">{children}</main>
        <footer className="mt-24 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6">
            <p>Proof &amp; Play. Puzzles are original or classical and public-domain; each page states its source. Solo progress is stored on this device; ranked play uses a free account.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
