import { useState, type CSSProperties } from 'react';
import { Sparkles, Wand2, RotateCcw } from 'lucide-react';
import { cn } from "/utils/cn";
import { Toggle } from './kit';

const PRINCIPLES = [
  { key: 'contrast', label: 'Contrast', desc: 'Dark text on a light card and a bold, colourful call-to-action button that stands out.' },
  { key: 'hierarchy', label: 'Visual hierarchy', desc: 'The title is biggest and boldest, the date is small and muted — the eye reads in order of importance.' },
  { key: 'alignment', label: 'Alignment', desc: 'Every element lines up along one strong left edge instead of being scattered.' },
  { key: 'proximity', label: 'Proximity', desc: 'Related items (title + date, list items) sit close together; separate groups get more space.' },
  { key: 'repetition', label: 'Repetition', desc: 'One font family, one corner radius and one button style repeated everywhere.' },
  { key: 'whitespace', label: 'White space', desc: 'Generous padding and line spacing let the content breathe and feel premium.' },
] as const;
type PKey = (typeof PRINCIPLES)[number]['key'];
const NONE: Record<PKey, boolean> = { contrast: false, hierarchy: false, alignment: false, proximity: false, repetition: false, whitespace: false };
const ALL: Record<PKey, boolean> = { contrast: true, hierarchy: true, alignment: true, proximity: true, repetition: true, whitespace: true };

export function DesignPrinciplesSim() {
  const [on, setOn] = useState<Record<PKey, boolean>>(NONE);
  const score = Object.values(on).filter(Boolean).length;
  const { contrast: c, hierarchy: hi, alignment: al, proximity: pr, repetition: rep, whitespace: ws } = on;
  const font = '"Plus Jakarta Sans", sans-serif';

  const card: CSSProperties = {
    background: c ? '#ffffff' : '#e5e7eb', color: c ? '#0f172a' : '#9ca3af', padding: ws ? 28 : 8, lineHeight: ws ? 1.6 : 1.15,
    borderRadius: rep ? 18 : 0, fontFamily: rep ? font : 'Georgia, serif', width: '100%', maxWidth: 380,
    boxShadow: c ? '0 18px 40px -16px rgba(15,23,42,.35)' : 'none', border: c ? '1px solid #e2e8f0' : '1px solid #d1d5db', transition: 'all .45s ease',
  };
  const t = 'all .45s ease';
  const primary: CSSProperties = rep
    ? { background: c ? '#4f46e5' : '#c7d2fe', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontFamily: font, transition: t }
    : { background: c ? '#4f46e5' : '#d1d5db', color: '#fff', border: 'none', padding: '5px 9px', borderRadius: 999, fontFamily: '"Comic Sans MS", cursive', transition: t };
  const secondary: CSSProperties = rep
    ? { background: 'transparent', color: c ? '#4f46e5' : '#a5b4fc', border: `2px solid ${c ? '#4f46e5' : '#c7d2fe'}`, padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontFamily: font, transition: t }
    : { background: 'transparent', color: c ? '#16a34a' : '#a3a3a3', border: '2px dashed #86efac', padding: '12px 20px', borderRadius: 0, fontFamily: 'Georgia, serif', transition: t };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-line bg-surface-2/60 bg-dots p-5">
        <div style={card}>
          <div style={{ height: ws ? 120 : 80, borderRadius: rep ? 12 : 0, background: c ? 'linear-gradient(135deg,#6366f1,#ec4899)' : 'linear-gradient(135deg,#c7d2fe,#fbcfe8)', marginBottom: ws ? 18 : 4, transition: t }} />
          <h3 style={{ fontSize: hi ? 26 : 16, fontWeight: hi ? 800 : 400, textAlign: al ? 'left' : 'center', margin: 0, marginBottom: pr ? 2 : 20, letterSpacing: hi ? '-0.02em' : 0, fontFamily: rep ? font : 'Impact, fantasy', transition: t }}>
            Annual Tech Fest 2025
          </h3>
          <p style={{ fontSize: hi ? 13 : 16, color: hi ? (c ? '#64748b' : '#a1a1aa') : undefined, textAlign: al ? 'left' : 'right', margin: 0, marginBottom: pr ? 16 : 20, fontFamily: rep ? font : '"Courier New", monospace', transition: t }}>
            📅 14 Feb · City Convention Centre
          </p>
          <p style={{ fontSize: hi ? 15 : 16, textAlign: al ? 'left' : 'center', margin: 0, marginBottom: pr ? 8 : 20, paddingLeft: al ? 0 : 24, transition: t }}>
            Join coding contests, robotics demos and a web-design challenge.
          </p>
          <ul style={{ margin: 0, marginBottom: 20, paddingLeft: al ? 20 : 70, fontSize: hi ? 14 : 16, listStyle: 'disc', transition: t }}>
            {['Hackathon', 'Robo-race', 'Design sprint'].map((x) => <li key={x} style={{ marginBottom: pr ? 2 : 14, transition: t }}>{x}</li>)}
          </ul>
          <div style={{ display: 'flex', gap: 10, justifyContent: al ? 'flex-start' : 'space-around', flexWrap: 'wrap' }}>
            <button style={primary}>Register now</button>
            <button style={secondary}>Learn more</button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border border-line p-4">
          <div className="flex items-center justify-between text-sm font-bold text-ink"><span>Design score</span><span>{score} / 6</span></div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-linear-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500" style={{ width: `${(score / 6) * 100}%` }} />
          </div>
          <div className="mt-2 text-xs font-semibold text-muted">{score === 6 ? '🎉 Great design! Clear, consistent and readable.' : score >= 3 ? '👍 Getting better — keep applying principles.' : '😬 Poor design — hard to read and messy.'}</div>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-primary !px-3 !py-1.5 text-xs" onClick={() => setOn(ALL)}><Wand2 className="h-3.5 w-3.5" /> Apply all</button>
            <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setOn(NONE)}><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
          </div>
        </div>
        {PRINCIPLES.map((p) => (
          <div key={p.key} className={cn('rounded-xl border p-3 transition', on[p.key] ? 'border-emerald-500/40 bg-emerald-500/[.06]' : 'border-line')}>
            <Toggle label={<span className="flex items-center gap-1">{p.label}{on[p.key] && <Sparkles className="h-3.5 w-3.5 text-emerald-500" />}</span>} checked={on[p.key]} onChange={(v) => setOn((s) => ({ ...s, [p.key]: v }))} />
            {on[p.key] && <p className="animate-fade-up mt-1.5 pl-[46px] text-xs leading-relaxed text-ink-2">{p.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
