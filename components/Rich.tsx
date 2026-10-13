import katex from "katex";
import type { ReactNode } from "react";

const TOKEN = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;

function tex(src: string, display: boolean, key: number) {
  const html = katex.renderToString(src.trim(), { displayMode: display, throwOnError: false, output: "htmlAndMathml", strict: "ignore" });
  return display ? (
    <div key={key} className="math-scroll" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/** Renders text containing $inline$, $$display$$, **bold** and *italic*. Blank lines split paragraphs. */
export function Rich({ text, inline = false, className }: { text: string; inline?: boolean; className?: string }) {
  const blocks: ReactNode[] = [];
  text.split(/\n\s*\n/).forEach((para, pi) => {
    let run: ReactNode[] = [];
    const flush = () => {
      if (run.length) blocks.push(inline ? <span key={`s${pi}-${blocks.length}`}>{run}</span> : <p key={`p${pi}-${blocks.length}`}>{run}</p>);
      run = [];
    };
    let last = 0, k = 0, m: RegExpExecArray | null;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(para))) {
      if (m.index > last) run.push(para.slice(last, m.index));
      if (m[1] !== undefined) { flush(); blocks.push(tex(m[1], true, 1000 * pi + k++)); }
      else if (m[2] !== undefined) run.push(tex(m[2], false, 1000 * pi + k++));
      else if (m[3] !== undefined) run.push(<strong key={`b${pi}-${k++}`}>{m[3]}</strong>);
      else run.push(<em key={`i${pi}-${k++}`}>{m[4]}</em>);
      last = m.index + m[0].length;
    }
    if (last < para.length) run.push(para.slice(last));
    flush();
  });
  return inline ? <span className={className}>{blocks}</span> : <div className={`prose-math space-y-3 ${className ?? ""}`}>{blocks}</div>;
}
