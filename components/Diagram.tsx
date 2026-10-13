import type { DiagramId } from "@/lib/types";

const ink = "hsl(var(--ink))";
const muted = "hsl(var(--muted))";
const line = "hsl(var(--line))";
const surf = "hsl(var(--surface))";
const accent = "var(--c)";
const rad = (d: number) => (d * Math.PI) / 180;

const T = ({ x, y, children, anchor = "middle", size = 12 }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; size?: number }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={muted} fontFamily="var(--font-serif)" fontStyle="italic">{children}</text>
);

function Inscribed() {
  return (
    <g>
      <circle cx="160" cy="100" r="80" fill={accent} fillOpacity=".08" stroke={accent} strokeWidth="1.5" />
      <path d="M80 100 L240 100 L137.6 23.2 Z" fill="none" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M131.6 31.2 L139.6 37.2 L145.6 29.2" fill="none" stroke={ink} strokeWidth="1.2" />
      <circle cx="137.6" cy="23.2" r="3" fill={ink} /><circle cx="80" cy="100" r="3" fill={ink} /><circle cx="240" cy="100" r="3" fill={ink} />
      <T x={104} y={56} size={14}>6</T><T x={198} y={52} size={14}>8</T><T x={160} y={118} size={14}>10</T>
    </g>
  );
}

function DiagonalGrid() {
  const w = 6, h = 4, s = 34, x0 = 58, y0 = 22;
  const seen = new Set<string>();
  for (let i = 1; i < 6000; i++) { const t = i / 6000; seen.add(`${Math.floor(t * w)},${Math.floor(t * h)}`); }
  return (
    <g>
      {[...seen].map((k) => { const [c, r] = k.split(",").map(Number); return <rect key={k} x={x0 + c * s} y={y0 + (h - 1 - r) * s} width={s} height={s} fill={accent} fillOpacity=".22" />; })}
      {Array.from({ length: w + 1 }, (_, i) => <line key={`v${i}`} x1={x0 + i * s} y1={y0} x2={x0 + i * s} y2={y0 + h * s} stroke={line} />)}
      {Array.from({ length: h + 1 }, (_, i) => <line key={`h${i}`} x1={x0} y1={y0 + i * s} x2={x0 + w * s} y2={y0 + i * s} stroke={line} />)}
      <line x1={x0} y1={y0 + h * s} x2={x0 + w * s} y2={y0} stroke={ink} strokeWidth="1.8" />
      <T x={160} y={190} size={12}>A smaller 4×6 example</T>
    </g>
  );
}

function Lunes() {
  return (
    <svg viewBox="80 -10 200 190" x="60" y="0" width="200" height="200" overflow="visible">
      <path d="M150 40 A42 42 0 0 1 234 40 Z" fill={accent} fillOpacity=".4" stroke={accent} />
      <path d="M150 40 A56 56 0 0 0 150 152 Z" fill={accent} fillOpacity=".4" stroke={accent} />
      <circle cx="192" cy="96" r="70" fill={surf} stroke={ink} strokeWidth="1.2" />
      <path d="M150 40 L234 40 L150 152 Z" fill="none" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M150 52 H162 V40" fill="none" stroke={ink} strokeWidth="1" />
      <T x={192} y={34} size={13}>6</T><T x={141} y={102} size={13} anchor="end">8</T>
    </svg>
  );
}

function Langley() {
  const B = { x: 50, y: 290 }, C = { x: 150, y: 290 };
  const A = { x: 100, y: 290 - 50 * Math.tan(rad(80)) };
  const D = { x: B.x + 153.2 * Math.cos(rad(60)), y: B.y - 153.2 * Math.sin(rad(60)) };
  const E = { x: B.x + 100 * Math.cos(rad(80)), y: B.y - 100 * Math.sin(rad(80)) };
  const pt = (p: { x: number; y: number }, l: string, dx: number, dy: number) => (
    <g key={l}><circle cx={p.x} cy={p.y} r="2.5" fill={ink} /><text x={p.x + dx} y={p.y + dy} fontSize="12" fill={ink} fontFamily="var(--font-serif)" fontStyle="italic">{l}</text></g>
  );
  return (
    <svg viewBox="0 0 200 300" x="100" y="0" width="120" height="200">
      <path d={`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`} fill={accent} fillOpacity=".07" stroke={ink} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M${B.x} ${B.y} L${D.x} ${D.y} M${C.x} ${C.y} L${E.x} ${E.y} M${D.x} ${D.y} L${E.x} ${E.y}`} stroke={accent} strokeWidth="1.4" fill="none" />
      {pt(A, "A", 6, 4)}{pt(B, "B", -14, 4)}{pt(C, "C", 6, 4)}{pt(D, "D", 6, 4)}{pt(E, "E", -14, 4)}
      <text x={D.x - 6} y={D.y + 24} fontSize="12" fill={accent} fontWeight="600" textAnchor="end">?</text>
      <text x="96" y="30" fontSize="10" fill={muted}>20°</text>
      <text x="62" y="280" fontSize="10" fill={muted}>60°</text>
      <text x="108" y="280" fontSize="10" fill={muted}>50°</text>
    </svg>
  );
}

function Konigsberg() {
  const N = (x: number, y: number, l: string) => (
    <g key={l}><circle cx={x} cy={y} r="15" fill={surf} stroke={ink} strokeWidth="1.5" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="14" fill={ink} fontFamily="var(--font-serif)" fontStyle="italic">{l}</text></g>
  );
  const e = { fill: "none", stroke: accent, strokeWidth: 1.8 } as const;
  return (
    <g>
      <path {...e} d="M160 100 Q128 62 160 28 M160 100 Q192 62 160 28 M160 100 Q128 138 160 172 M160 100 Q192 138 160 172 M160 100 L270 100 M160 28 L270 100 M160 172 L270 100" />
      {N(160, 28, "A")}{N(160, 100, "C")}{N(160, 172, "B")}{N(270, 100, "D")}
    </g>
  );
}

function Wheel() {
  const pts = Array.from({ length: 5 }, (_, k) => [160 + 72 * Math.cos(rad(-90 + 72 * k)), 100 + 72 * Math.sin(rad(-90 + 72 * k))]);
  return (
    <g>
      {pts.map(([x, y], i) => <line key={`s${i}`} x1="160" y1="100" x2={x} y2={y} stroke={line} strokeWidth="1.6" />)}
      <path d={`M${pts.map((p) => p.join(" ")).join(" L")} Z`} fill="none" stroke={accent} strokeWidth="1.8" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={surf} stroke={ink} strokeWidth="1.5" />)}
      <circle cx="160" cy="100" r="11" fill={surf} stroke={ink} strokeWidth="1.8" />
      <T x={160} y={104} size={12}>hub</T>
    </g>
  );
}

function Chessboard() {
  const s = 23, x0 = 68, y0 = 8;
  const cells = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const gone = (r === 0 && c === 0) || (r === 7 && c === 7);
    cells.push(<rect key={`${r}${c}`} x={x0 + c * s} y={y0 + r * s} width={s} height={s} fill={gone ? "none" : (r + c) % 2 ? ink : surf} fillOpacity={gone ? 0 : (r + c) % 2 ? 0.7 : 1} stroke={gone ? accent : "none"} strokeDasharray={gone ? "3 2" : undefined} strokeWidth="1.5" />);
  }
  return <g>{cells}<rect x={x0} y={y0} width={s * 8} height={s * 8} fill="none" stroke={ink} strokeWidth="1.2" /></g>;
}

function Pigeonhole() {
  const x0 = 90, y0 = 16, S = 168, h = S / 2;
  const pts: [number, number][] = [[0, 0], [S, 0], [0, S], [S, S], [h, h]];
  return (
    <g>
      <rect x={x0} y={y0} width={S} height={S} fill="none" stroke={ink} strokeWidth="1.5" />
      <path d={`M${x0 + h} ${y0} V${y0 + S} M${x0} ${y0 + h} H${x0 + S}`} stroke={line} strokeDasharray="4 3" />
      <rect x={x0} y={y0} width={h} height={h} fill={accent} fillOpacity=".16" />
      <line x1={x0} y1={y0} x2={x0 + h} y2={y0 + h} stroke={accent} strokeWidth="1.5" />
      {pts.map(([x, y], i) => <circle key={i} cx={x0 + x} cy={y0 + y} r="5" fill={ink} />)}
    </g>
  );
}

function OddSquares() {
  const g = 22, x0 = 116, y0 = 40, dots = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
    const layer = Math.max(i, j);
    dots.push(<circle key={`${i}${j}`} cx={x0 + j * g} cy={y0 + i * g} r="7" fill={accent} fillOpacity={0.25 + layer * 0.19} />);
  }
  return <g>{dots}<T x={160} y={176} size={13}>1 + 3 + 5 + 7 + 9 = ?</T></g>;
}

function Steinmetz() {
  const cx = 105, cy = 100, r = 70, a = 36, hh = Math.sqrt(r * r - a * a);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={accent} fillOpacity=".07" stroke={ink} strokeWidth="1.4" />
      <line x1={cx + a} y1={cy - hh} x2={cx + a} y2={cy + hh} stroke={accent} strokeWidth="2" strokeDasharray="5 3" />
      <rect x="225" y={cy - hh / 2} width={hh} height={hh} fill={accent} fillOpacity=".25" stroke={accent} strokeWidth="1.5" />
      <path d={`M${cx + a + 6} ${cy} H${225 - 6}`} stroke={line} strokeDasharray="2 3" />
      <T x={cx} y={cy + 4} size={12}>disc</T>
      <T x={225 + hh / 2} y={cy + hh / 2 + 18} size={12}>square slice</T>
    </g>
  );
}

const MAP: Record<DiagramId, () => React.ReactNode> = {
  inscribed: Inscribed, diagonal: DiagonalGrid, lunes: Lunes, langley: Langley, konigsberg: Konigsberg,
  wheel: Wheel, chessboard: Chessboard, pigeonhole: Pigeonhole, oddsquares: OddSquares, steinmetz: Steinmetz,
};

const LABELS: Record<DiagramId, string> = {
  inscribed: "A right triangle with legs 6 and 8 inscribed in a circle",
  diagonal: "A diagonal drawn across a 4 by 6 grid with the squares it crosses shaded",
  lunes: "A right triangle with semicircles on its legs and its circumscribed circle",
  langley: "Isosceles triangle ABC with points D and E and the lines BD, CE and DE",
  konigsberg: "Graph of four districts A, B, C, D joined by seven bridges",
  wheel: "A wheel graph: a hub joined to five points on a pentagon",
  chessboard: "A chessboard with two opposite corners removed",
  pigeonhole: "A square divided into four cells with five points: four corners and the centre",
  oddsquares: "A five by five dot square built from nested L-shaped layers",
  steinmetz: "A disc and a square cross-section of the intersection of two cylinders",
};

export function Diagram({ id }: { id: DiagramId }) {
  const Body = MAP[id];
  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 200" role="img" aria-label={LABELS[id]} className="mx-auto block h-auto w-full max-w-md">
        <Body />
      </svg>
    </figure>
  );
}
