import { useEffect, useMemo, useRef, useState } from 'react';
import { CodeBlock } from '../components/Code';
import { cn } from "/utils/cn";
import { Hint, Seg, Slider, Toggle } from './kit';

/* ================================================================== */
/* Selector lab                                                        */
/* ================================================================== */
const SAMPLE = {
  __html: `<div class="page">
  <h1 id="main-title">My Blog</h1>
  <p class="intro">Welcome to my <a href="#">website</a>.</p>
  <div class="card">
    <h2>First Post</h2>
    <p>CSS selectors are powerful.</p>
    <p class="highlight">This paragraph is highlighted.</p>
  </div>
  <ul>
    <li>HTML</li>
    <li class="highlight">CSS</li>
    <li>JavaScript</li>
    <li><a href="https://example.com" target="_blank">External link</a></li>
  </ul>
  <h2>Contact</h2>
  <p>Email me anytime.</p>
</div>`,
};

const PRESETS: [string, string][] = [
  ['p', 'Element (type) selector — selects every <p> element.'],
  ['.highlight', 'Class selector — every element with class="highlight" (here a <p> and an <li>).'],
  ['#main-title', 'ID selector — the single element with id="main-title".'],
  ['h1, h2', 'Group selector — all <h1> and all <h2> elements.'],
  ['.card p', 'Descendant selector — <p> elements anywhere inside the element with class "card".'],
  ['ul > li', 'Child selector — <li> elements that are direct children of a <ul>.'],
  ['h2 + p', 'Adjacent sibling selector — the <p> that comes immediately after an <h2>.'],
  ['a[target]', 'Attribute selector — links that have a target attribute.'],
  ['li:first-child', 'Pseudo-class — the first <li> inside its parent.'],
  ['li:nth-child(even)', 'Pseudo-class — every second <li> (2nd, 4th…).'],
  ['p:not(.intro)', 'Negation pseudo-class — <p> elements that do NOT have the class "intro".'],
  ['*', 'Universal selector — selects every element.'],
];

function specificity(sel: string): [number, number, number] {
  let s = sel.replace(/"[^"]*"|'[^']*'/g, '""');
  s = s.replace(/:(not|is|has)\(([^)]*)\)/g, (_m, _f, inner: string) => ` ${inner} `).replace(/:where\([^)]*\)/g, ' ');
  const count = (re: RegExp) => { const n = (s.match(re) || []).length; s = s.replace(re, ' '); return n; };
  const a = count(/#[\w-]+/g);
  const pe = count(/::[\w-]+/g);
  const b = count(/\.[\w-]+/g) + count(/\[[^\]]*\]/g) + count(/:[\w-]+(\([^)]*\))?/g);
  const c = count(/[a-zA-Z][\w-]*/g) + pe;
  return [a, b, c];
}

export function SelectorLabSim() {
  const [sel, setSel] = useState('.highlight');
  const [res, setRes] = useState<{ count: number; error?: string }>({ count: 0 });
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    el.querySelectorAll('.sel-match').forEach((m) => m.classList.remove('sel-match'));
    if (!sel.trim()) { setRes({ count: 0 }); return; }
    try {
      const found = el.querySelectorAll(sel);
      found.forEach((m) => m.classList.add('sel-match'));
      setRes({ count: found.length });
    } catch {
      setRes({ count: 0, error: 'Invalid selector — check the syntax.' });
    }
  }, [sel]);

  const parts = sel.split(',').map((s) => s.trim()).filter(Boolean);
  const explain = PRESETS.find(([p]) => p === sel.trim())?.[1];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <span className="pl-2 font-mono text-sm font-bold text-pink-500">css&gt;</span>
          <input value={sel} onChange={(e) => setSel(e.target.value)} className="flex-1 bg-transparent px-1 py-1.5 font-mono text-sm text-ink outline-none" placeholder="Type a CSS selector…" aria-label="CSS selector" />
          <span className="font-mono text-pink-500">{'{ }'}</span>
          <span className={cn('rounded-lg px-2.5 py-1 text-xs font-bold', res.error ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300')}>
            {res.error ? 'error' : `${res.count} match${res.count === 1 ? '' : 'es'}`}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map(([p]) => <button key={p} onClick={() => setSel(p)} className={cn('chip font-mono transition hover:border-pink-400', sel === p && 'border-pink-500 text-pink-600 dark:text-pink-300')}>{p}</button>)}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div ref={stage} dangerouslySetInnerHTML={SAMPLE}
          className="rounded-xl border border-line bg-white p-4 text-sm text-slate-800 [&_.card]:my-2 [&_.card]:rounded-lg [&_.card]:border [&_.card]:border-slate-200 [&_.card]:bg-slate-50 [&_.card]:p-3 [&_a]:text-indigo-600 [&_a]:underline [&_h1]:text-2xl [&_h1]:font-extrabold [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-bold [&_li]:my-0.5 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-6" />
        <div className="space-y-3">
          <div className="rounded-xl border border-line p-3">
            <div className="mb-2 text-xs font-bold text-ink">Specificity score</div>
            {parts.length === 0 && <div className="text-xs text-muted">Type a selector.</div>}
            {parts.map((p, i) => {
              const [a, b, c] = specificity(p);
              return (
                <div key={i} className="mb-2 last:mb-0">
                  <div className="truncate font-mono text-xs text-pink-600 dark:text-pink-300">{p}</div>
                  <div className="mt-1 grid grid-cols-3 gap-1 text-center">
                    {[['ID', a, '#ef4444'], ['Class', b, '#f59e0b'], ['Element', c, '#10b981']].map(([l, v, col]) => (
                      <div key={l as string} className="rounded-lg py-1" style={{ background: (col as string) + '1a' }}>
                        <div className="text-base font-extrabold" style={{ color: col as string }}>{v}</div>
                        <div className="text-[9px] font-bold uppercase text-muted">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Hint>{res.error ?? explain ?? 'Highlighted elements match your selector. Compare specificity from left to right: the selector with more IDs wins, then more classes, then more elements.'}</Hint>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Typography tester                                                   */
/* ================================================================== */
const FONTS: [string, string][] = [
  ['Arial', 'Arial, Helvetica, sans-serif'], ['Verdana', 'Verdana, Geneva, sans-serif'], ['Trebuchet MS', '"Trebuchet MS", sans-serif'],
  ['Georgia', 'Georgia, serif'], ['Times New Roman', '"Times New Roman", Times, serif'], ['Courier New', '"Courier New", Courier, monospace'],
  ['Comic Sans MS', '"Comic Sans MS", cursive'], ['Impact', 'Impact, fantasy'], ['Plus Jakarta Sans', '"Plus Jakarta Sans", sans-serif'],
  ['Playfair Display', '"Playfair Display", serif'], ['JetBrains Mono', '"JetBrains Mono", monospace'],
];
const FAMILIES: [string, string, string][] = [
  ['serif', 'Georgia, serif', 'Formal, classic'], ['sans-serif', 'Arial, sans-serif', 'Clean, modern'], ['monospace', '"Courier New", monospace', 'Code, typewriter'],
  ['cursive', '"Comic Sans MS", cursive', 'Handwritten'], ['fantasy', 'Impact, fantasy', 'Decorative'],
];

export function TypographySim() {
  const [font, setFont] = useState(9);
  const [size, setSize] = useState(30);
  const [weight, setWeight] = useState<'300' | '400' | '600' | '700' | '900'>('700');
  const [italic, setItalic] = useState(false);
  const [lh, setLh] = useState(1.4);
  const [ls, setLs] = useState(0);
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [transform, setTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const [deco, setDeco] = useState<'none' | 'underline' | 'overline' | 'line-through'>('none');
  const [color, setColor] = useState('#7c3aed');
  const [shadow, setShadow] = useState(false);
  const [text, setText] = useState('Good typography makes reading a pleasure.');

  const css = useMemo(() => [
    'h1 {',
    `  font-family: ${FONTS[font][1]};`,
    `  font-size: ${size}px;`,
    `  font-weight: ${weight};`,
    italic ? '  font-style: italic;' : '',
    `  line-height: ${lh};`,
    ls ? `  letter-spacing: ${ls}px;` : '',
    `  text-align: ${align};`,
    transform !== 'none' ? `  text-transform: ${transform};` : '',
    deco !== 'none' ? `  text-decoration: ${deco};` : '',
    `  color: ${color};`,
    shadow ? '  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);' : '',
    '}',
  ].filter(Boolean).join('\n'), [font, size, weight, italic, lh, ls, align, transform, deco, color, shadow]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FAMILIES.map(([name, stack, d]) => (
          <button key={name} onClick={() => setFont(FONTS.findIndex(([, s]) => s.includes(stack.split(',')[0])))}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-left transition hover:border-fuchsia-400">
            <div className="text-xl leading-none text-ink" style={{ fontFamily: stack }}>Aa</div>
            <div className="mt-1 font-mono text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-300">{name}</div>
            <div className="text-[10px] text-muted">{d}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="space-y-3">
          <label className="block"><span className="label">font-family</span>
            <select className="input" value={font} onChange={(e) => setFont(Number(e.target.value))}>
              {FONTS.map(([n], i) => <option key={n} value={i}>{n}</option>)}
            </select>
          </label>
          <Slider label="font-size" value={size} min={10} max={72} onChange={setSize} />
          <Seg label="font-weight" options={['300', '400', '600', '700', '900'] as const} value={weight} onChange={setWeight} />
          <Slider label="line-height" value={lh} min={0.8} max={2.5} step={0.1} unit="" onChange={setLh} />
          <Slider label="letter-spacing" value={ls} min={-3} max={12} onChange={setLs} />
          <Seg label="text-align" options={['left', 'center', 'right', 'justify'] as const} value={align} onChange={setAlign} />
          <Seg label="text-transform" options={['none', 'uppercase', 'lowercase', 'capitalize'] as const} value={transform} onChange={setTransform} />
          <Seg label="text-decoration" options={['none', 'underline', 'overline', 'line-through'] as const} value={deco} onChange={setDeco} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted">color <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-line bg-transparent" /></label>
            <Toggle label="italic" checked={italic} onChange={setItalic} />
          </div>
          <Toggle label="text-shadow" checked={shadow} onChange={setShadow} />
        </div>
        <div className="min-w-0 space-y-3">
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} aria-label="Preview text" />
          <div className="flex min-h-[200px] items-center rounded-xl border border-line bg-white p-6">
            <h1 className="w-full break-words" style={{
              fontFamily: FONTS[font][1], fontSize: size, fontWeight: Number(weight), fontStyle: italic ? 'italic' : 'normal', lineHeight: lh,
              letterSpacing: ls, textAlign: align, textTransform: transform, textDecoration: deco, color, textShadow: shadow ? '2px 2px 6px rgba(0,0,0,.3)' : 'none',
            }}>{text}</h1>
          </div>
          <CodeBlock code={css} lang="css" title="Generated CSS" className="!my-0" />
        </div>
      </div>
    </div>
  );
}
