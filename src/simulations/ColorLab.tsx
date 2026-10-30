import { useMemo, useState } from 'react';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { CodeBlock } from '../components/Code';
import { copyText } from '../lib/store';
import { cn } from '../utils/cn';
import { Seg, Slider, Tabs } from './kit';

/* ---------------- colour maths ---------------- */
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
export const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const n = parseInt(h.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
export function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}
const lum = (hex: string) => {
  const a = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};
export const contrastRatio = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const isHex = (s: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s);

const NAMED: [string, string][] = [['tomato', '#ff6347'], ['gold', '#ffd700'], ['teal', '#008080'], ['navy', '#000080'], ['orchid', '#da70d6'], ['crimson', '#dc143c'], ['skyblue', '#87ceeb'], ['olive', '#808000']];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
      <span className="text-xs font-bold text-muted">{label}</span>
      <span className="flex items-center gap-2"><code className="font-mono text-sm font-semibold text-ink">{value}</code>
        <button className="icon-btn h-7 w-7" onClick={() => copyText(value)} aria-label={`Copy ${label}`}><Copy className="h-3.5 w-3.5" /></button></span>
    </div>
  );
}

type Tab = 'mixer' | 'harmony' | 'contrast' | 'gradient';
type Harmony = 'complementary' | 'analogous' | 'triadic' | 'split' | 'monochrome';

export function ColorLabSim() {
  const [tab, setTab] = useState<Tab>('mixer');
  return (
    <div>
      <Tabs<Tab> tabs={[{ id: 'mixer', label: '🎚️ RGB Mixer' }, { id: 'harmony', label: '🎨 Harmonies' }, { id: 'contrast', label: '👁️ Contrast' }, { id: 'gradient', label: '🌈 Gradient' }]} value={tab} onChange={setTab} />
      {tab === 'mixer' && <Mixer />}
      {tab === 'harmony' && <Harmonies />}
      {tab === 'contrast' && <Contrast />}
      {tab === 'gradient' && <Gradient />}
    </div>
  );
}

function Mixer() {
  const [rgb, setRgb] = useState<[number, number, number]>([99, 102, 241]);
  const [alpha, setAlpha] = useState(1);
  const [r, g, b] = rgb;
  const hex = rgbToHex(r, g, b);
  const [h, s, l] = rgbToHsl(r, g, b);
  const set = (i: number, v: number) => setRgb((c) => c.map((x, k) => (k === i ? v : x)) as [number, number, number]);
  const track = (i: number) => {
    const from = [...rgb]; const to = [...rgb]; from[i] = 0; to[i] = 255;
    return { background: `linear-gradient(to right, rgb(${from.join(',')}), rgb(${to.join(',')}))` };
  };
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        {(['Red', 'Green', 'Blue'] as const).map((name, i) => (
          <div key={name}>
            <Slider label={name} value={rgb[i]} min={0} max={255} unit="" onChange={(v) => set(i, v)} />
            <div className="mt-1 h-2 rounded-full" style={track(i)} />
          </div>
        ))}
        <Slider label="Alpha (opacity)" value={alpha} min={0} max={1} step={0.05} unit="" onChange={setAlpha} />
        <div>
          <div className="label">Try a named colour</div>
          <div className="flex flex-wrap gap-1.5">
            {NAMED.map(([n, hx]) => (
              <button key={n} onClick={() => { setRgb(hexToRgb(hx)); setAlpha(1); }} className="chip"><i className="h-3 w-3 rounded-full" style={{ background: hx }} />{n}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-checker h-36 overflow-hidden rounded-2xl border border-line">
          <div className="flex h-full items-end justify-end p-3 transition-colors" style={{ background: `rgba(${r},${g},${b},${alpha})` }}>
            <span className="rounded-lg bg-black/40 px-2 py-1 font-mono text-xs font-bold text-white">{hex.toUpperCase()}</span>
          </div>
        </div>
        <Row label="HEX" value={hex.toUpperCase()} />
        <Row label="RGB" value={`rgb(${r}, ${g}, ${b})`} />
        <Row label="RGBA" value={`rgba(${r}, ${g}, ${b}, ${alpha})`} />
        <Row label="HSL" value={`hsl(${h}, ${s}%, ${l}%)`} />
        <p className="text-xs text-muted">Each channel goes from 0 (none) to 255 (full). In HEX, 255 = FF. Mixing all three at 255 gives white; all at 0 gives black.</p>
      </div>
    </div>
  );
}

function Harmonies() {
  const [base, setBase] = useState('#6366f1');
  const [type, setType] = useState<Harmony>('complementary');
  const [h, s, l] = rgbToHsl(...hexToRgb(base));
  const offsets: Record<Harmony, number[]> = { complementary: [0, 180], analogous: [-30, 0, 30], triadic: [0, 120, 240], split: [0, 150, 210], monochrome: [0, 0, 0, 0, 0] };
  const colors = type === 'monochrome' ? [20, 35, 50, 65, 80].map((L) => hslToHex(h, s, L)) : offsets[type].map((o) => hslToHex(h + o, s, l));
  const hues = type === 'monochrome' ? [h] : offsets[type].map((o) => (((h + o) % 360) + 360) % 360);
  const DESC: Record<Harmony, string> = {
    complementary: 'Opposite sides of the wheel — maximum contrast. Use one as the main colour and the other for highlights.',
    analogous: 'Neighbours on the wheel — calm, natural and pleasing. Great for backgrounds and gentle designs.',
    triadic: 'Three colours evenly spaced (120° apart) — vibrant but balanced. Let one colour dominate.',
    split: 'The base plus the two neighbours of its complement — strong contrast with less tension.',
    monochrome: 'Light and dark versions of one hue — elegant, simple and always matching.',
  };
  return (
    <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
      <div className="relative mx-auto h-52 w-52 rounded-full shadow-inner" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}>
        <div className="absolute inset-[30%] rounded-full bg-surface shadow" />
        {hues.map((hue, i) => (
          <span key={i} className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-lg transition-all duration-500"
            style={{ left: `${50 + 40 * Math.sin((hue * Math.PI) / 180)}%`, top: `${50 - 40 * Math.cos((hue * Math.PI) / 180)}%`, background: colors[i] ?? base }} />
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block"><span className="label">Base colour</span><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-line bg-transparent" /></label>
          <Seg label="Harmony" options={['complementary', 'analogous', 'triadic', 'split', 'monochrome'] as const} value={type} onChange={setType} />
        </div>
        <div className="flex overflow-hidden rounded-2xl border border-line">
          {colors.map((c, i) => (
            <button key={i} onClick={() => copyText(c.toUpperCase())} className="group flex h-24 flex-1 items-end justify-center pb-2 transition hover:flex-[1.4]" style={{ background: c }} title="Click to copy">
              <span className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">{c.toUpperCase()}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-2">{DESC[type]} <span className="text-muted">(Click a swatch to copy it.)</span></p>
      </div>
    </div>
  );
}

function Contrast() {
  const [fg, setFg] = useState('#1e293b');
  const [bg, setBg] = useState('#fde68a');
  const [fgText, setFgText] = useState(fg);
  const [bgText, setBgText] = useState(bg);
  const ratio = contrastRatio(fg, bg);
  const checks: [string, number][] = [['AA · normal text', 4.5], ['AA · large text', 3], ['AAA · normal text', 7], ['AAA · large text', 4.5]];
  const swap = () => { setFg(bg); setBg(fg); setFgText(bg); setBgText(fg); };
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-3">
        {([['Text colour', fg, setFg, fgText, setFgText], ['Background colour', bg, setBg, bgText, setBgText]] as const).map(([label, val, setV, txt, setTxt]) => (
          <div key={label}>
            <div className="label">{label}</div>
            <div className="flex gap-2">
              <input type="color" value={val} onChange={(e) => { setV(e.target.value); setTxt(e.target.value); }} className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-transparent" />
              <input className="input font-mono" value={txt} onChange={(e) => { setTxt(e.target.value); if (isHex(e.target.value)) setV(e.target.value); }} />
            </div>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={swap}><ArrowLeftRight className="h-4 w-4" /> Swap colours</button>
        <div className="grid grid-cols-2 gap-2">
          {checks.map(([l, min]) => {
            const ok = ratio >= min;
            return <div key={l} className={cn('rounded-xl border px-3 py-2 text-xs font-bold', ok ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300')}>{ok ? '✔ Pass' : '✘ Fail'} — {l} <span className="font-normal opacity-70">(≥ {min})</span></div>;
          })}
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-line p-6" style={{ background: bg, color: fg }}>
          <div className="text-3xl font-extrabold">Aa Large heading</div>
          <p className="mt-2 text-sm">This is normal body text. Can you read it comfortably? People with low vision need good contrast.</p>
        </div>
        <div className="rounded-2xl border border-line p-4 text-center">
          <div className="text-4xl font-extrabold text-ink">{ratio.toFixed(2)} : 1</div>
          <div className="text-xs font-semibold text-muted">Contrast ratio (1 = none, 21 = black on white)</div>
        </div>
      </div>
    </div>
  );
}

function Gradient() {
  const [c1, setC1] = useState('#f43f5e');
  const [c2, setC2] = useState('#8b5cf6');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const css = useMemo(() => (type === 'linear' ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`), [type, angle, c1, c2]);
  return (
    <div className="grid gap-5 md:grid-cols-[240px_1fr]">
      <div className="space-y-3">
        <Seg label="Type" options={['linear', 'radial'] as const} value={type} onChange={setType} />
        <div className="flex gap-3">
          <label><span className="label">Colour 1</span><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-line bg-transparent" /></label>
          <label><span className="label">Colour 2</span><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-line bg-transparent" /></label>
        </div>
        {type === 'linear' && <Slider label="Angle" value={angle} min={0} max={360} unit="°" onChange={setAngle} />}
      </div>
      <div className="space-y-3">
        <div className="h-40 rounded-2xl border border-line shadow-inner" style={{ background: css }} />
        <CodeBlock code={`.banner {\n  background: ${css};\n}`} lang="css" className="!my-0" />
      </div>
    </div>
  );
}
