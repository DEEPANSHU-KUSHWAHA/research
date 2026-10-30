import { useEffect, useMemo, useRef, useState } from 'react';
import { Laptop, Monitor, Play, RotateCcw, Smartphone, Tablet, Terminal } from 'lucide-react';
import { CodeBlock } from '../components/Code';
import { buildDoc } from '../lib/store';
import { cn } from '../utils/cn';
import { Hint, Slider } from './kit';

/* ================================================================== */
/* Responsive viewport simulator                                       */
/* ================================================================== */
const DEVICES = [
  { label: 'Mobile', w: 375, icon: Smartphone },
  { label: 'Tablet', w: 768, icon: Tablet },
  { label: 'Laptop', w: 1100, icon: Laptop },
  { label: 'Desktop', w: 1440, icon: Monitor },
];
const BASE_CSS = `/* Base styles = mobile (always active) */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; }
header { display: flex; justify-content: space-between; padding: 14px 18px; background: #0891b2; color: white; }
nav { display: none; }
.cards { display: grid; grid-template-columns: 1fr; gap: 12px; }
aside { display: none; }`;
const TABLET_CSS = `@media (min-width: 600px) {
  nav { display: block; }
  .menu-btn { display: none; }
  .cards { grid-template-columns: 1fr 1fr; }
}`;
const DESKTOP_CSS = `@media (min-width: 1024px) {
  .layout { display: grid; grid-template-columns: 1fr 240px; }
  .cards { grid-template-columns: repeat(3, 1fr); }
  aside { display: block; }
}`;
const EXTRA_CSS = `nav a { color: white; margin-left: 14px; text-decoration: none; font-size: 14px; }
.menu-btn { font-size: 22px; line-height: 1; }
.hero { padding: 26px 18px; background: linear-gradient(135deg, #cffafe, #e0e7ff); }
.hero h1 { margin: 0 0 6px; font-size: 24px; color: #0f172a; }
.hero p { margin: 0; color: #334155; }
.layout { padding: 16px; gap: 20px; }
.card { background: white; border-radius: 12px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.08); color: #0f172a; }
.card .img { height: 70px; border-radius: 8px; background: linear-gradient(135deg, #22d3ee, #6366f1); margin-bottom: 8px; }
aside { background: white; border-radius: 12px; padding: 16px; color: #0f172a; }
.badge { position: fixed; bottom: 10px; right: 10px; background: #0f172a; color: #fff; font: 600 12px system-ui; padding: 6px 10px; border-radius: 99px; }
.badge::after { content: "📱 Mobile layout"; }
@media (min-width: 600px) { .hero h1 { font-size: 32px; } .badge::after { content: "📲 Tablet layout"; } }
@media (min-width: 1024px) { .badge::after { content: "💻 Desktop layout"; } }`;
const PAGE_HTML = `<header><b>🌐 ResponsiveSite</b><span class="menu-btn">☰</span><nav><a href="#">Home</a><a href="#">About</a><a href="#">Blog</a><a href="#">Contact</a></nav></header>
<section class="hero"><h1>One site, every screen</h1><p>The same HTML, rearranged by media queries.</p></section>
<div class="layout"><div class="cards">${[1, 2, 3, 4, 5, 6].map((i) => `<div class="card"><div class="img"></div><b>Card ${i}</b><p style="margin:4px 0 0;font-size:13px;color:#64748b">Flexible content</p></div>`).join('')}</div>
<aside><h3 style="margin-top:0">Sidebar</h3><p style="font-size:14px">Only visible on large screens (1024px and wider).</p></aside></div><div class="badge"></div>`;

export function ResponsiveSim() {
  const [width, setWidth] = useState(375);
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(700);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const doc = useMemo(() => buildDoc(PAGE_HTML, `${BASE_CSS}\n${TABLET_CSS}\n${DESKTOP_CSS}\n${EXTRA_CSS}`), []);
  const H = 500;
  const bezel = 10;
  const scale = Math.min(1, (boxW - 8) / (width + bezel * 2));
  const active = { tablet: width >= 600, desktop: width >= 1024 };
  const label = width >= 1024 ? 'Desktop layout · 3 columns + sidebar' : width >= 600 ? 'Tablet layout · 2 columns + menu links' : 'Mobile layout · 1 column + ☰ menu';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {DEVICES.map((d) => (
          <button key={d.label} onClick={() => setWidth(d.w)} className={cn('btn !px-3 !py-1.5 text-xs', width === d.w ? 'btn-primary' : 'btn-ghost')}>
            <d.icon className="h-4 w-4" />{d.label} <span className="font-mono opacity-70">{d.w}</span>
          </button>
        ))}
        <div className="min-w-[180px] flex-1"><Slider label="Custom viewport width" value={width} min={320} max={1600} onChange={setWidth} /></div>
      </div>
      <div className="rounded-xl bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-800 dark:text-cyan-200">Viewport {width}px → {label} <span className="font-normal opacity-70">(preview scaled to {Math.round(scale * 100)}%)</span></div>
      <div ref={boxRef} className="overflow-hidden rounded-xl border border-line bg-surface-2/60 p-1">
        <div className="mx-auto transition-all duration-300" style={{ width: (width + bezel * 2) * scale, height: (H + bezel * 2) * scale }}>
          <div className="rounded-[22px] bg-slate-800 shadow-2xl transition-all duration-300" style={{ width: width + bezel * 2, height: H + bezel * 2, padding: bezel, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <iframe title="Responsive preview" srcDoc={doc} className="block rounded-xl bg-white" style={{ width, height: H }} />
          </div>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {[{ code: BASE_CSS, on: true, name: 'Base (mobile)' }, { code: TABLET_CSS, on: active.tablet, name: '≥ 600px (tablet)' }, { code: DESKTOP_CSS, on: active.desktop, name: '≥ 1024px (desktop)' }].map((b) => (
          <div key={b.name} className={cn('rounded-xl transition', b.on ? 'ring-2 ring-cyan-500' : 'opacity-50')}>
            <div className={cn('flex items-center justify-between rounded-t-xl px-3 py-1 text-xs font-bold', b.on ? 'bg-cyan-500 text-white' : 'bg-surface-2 text-muted')}>{b.name}<span>{b.on ? '● ACTIVE' : '○ inactive'}</span></div>
            <CodeBlock code={b.code} lang="css" compact className="!mt-0 !mb-0 !rounded-t-none text-[11px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* JavaScript DOM playground                                           */
/* ================================================================== */
const STAGE = `<div class="demo">
  <h2 id="title">Hello, World! 👋</h2>
  <p id="msg">I am a paragraph. JavaScript can change me.</p>
  <div id="box"></div>
  <ul id="list"><li>HTML</li><li>CSS</li></ul>
  <button id="btn">Click me</button> <span>Clicks: <b id="count">0</b></span>
</div>`;
const ACTIONS: { label: string; code: string }[] = [
  { label: 'Change text', code: 'document.getElementById("title").innerHTML = "JavaScript is awesome! 🚀";' },
  { label: 'Change colour', code: 'document.getElementById("title").style.color = "crimson";' },
  { label: 'Box → circle', code: 'const box = document.getElementById("box");\nbox.style.borderRadius = "50%";\nbox.style.background = "orange";' },
  { label: 'Hide / show', code: 'const p = document.getElementById("msg");\np.style.display = (p.style.display === "none") ? "block" : "none";' },
  { label: 'Add list item', code: 'const li = document.createElement("li");\nli.textContent = "JavaScript";\ndocument.getElementById("list").appendChild(li);' },
  { label: 'Toggle class', code: 'document.getElementById("box").classList.toggle("spin");' },
  { label: 'Count items', code: 'const items = document.querySelectorAll("#list li");\nconsole.log("The list has " + items.length + " items");' },
];
interface Log { kind: 'code' | 'out' | 'err' | 'event'; text: string; }

export function JsDomSim() {
  const stage = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [custom, setCustom] = useState('document.getElementById("msg").style.fontSize = "22px";');
  const [resetKey, setResetKey] = useState(0);
  const [last, setLast] = useState(ACTIONS[0].code);
  const add = (l: Log | Log[]) => setLogs((s) => [...s, ...(Array.isArray(l) ? l : [l])].slice(-14));

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    el.innerHTML = STAGE;
    let count = 0;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.id === 'btn') { count++; const c = el.querySelector('#count'); if (c) c.textContent = String(count); }
      add({ kind: 'event', text: `click → <${t.tagName.toLowerCase()}${t.id ? ' id="' + t.id + '"' : ''}>` });
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [resetKey]);

  const run = (code: string) => {
    const el = stage.current;
    if (!el) return;
    setLast(code);
    const doc = {
      getElementById: (id: string) => el.querySelector('#' + CSS.escape(id)),
      querySelector: (s: string) => el.querySelector(s),
      querySelectorAll: (s: string) => el.querySelectorAll(s),
      createElement: (t: string) => document.createElement(t),
      body: el,
    };
    const out: Log[] = [{ kind: 'code', text: code }];
    const con = { log: (...a: unknown[]) => out.push({ kind: 'out', text: a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ') }) };
    try {
      new Function('document', 'console', code)(doc, con);
    } catch (err) {
      out.push({ kind: 'err', text: String(err) });
    }
    add(out);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {ACTIONS.map((a) => <button key={a.label} onClick={() => run(a.code)} className="btn btn-soft !px-3 !py-1.5 text-xs"><Play className="h-3 w-3" />{a.label}</button>)}
        <button onClick={() => { setResetKey((k) => k + 1); setLogs([]); }} className="btn btn-ghost !px-3 !py-1.5 text-xs"><RotateCcw className="h-3 w-3" /> Reset page</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="label">Mini web page (real DOM)</div>
          <div ref={stage}
            className="min-h-[250px] rounded-xl border border-line bg-white p-4 text-slate-800 [&_#box]:my-2 [&_#box]:h-14 [&_#box]:w-14 [&_#box]:rounded-xl [&_#box]:bg-indigo-500 [&_#box]:transition-all [&_#box]:duration-500 [&_#btn]:rounded-lg [&_#btn]:bg-yellow-400 [&_#btn]:px-3 [&_#btn]:py-1.5 [&_#btn]:font-bold [&_#list]:list-disc [&_#list]:pl-6 [&_.spin]:rotate-45 [&_.spin]:scale-75 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:transition-colors [&_p]:my-1" />
          <div className="mt-2 text-xs font-semibold text-muted">Last code that ran:</div>
          <CodeBlock code={last} lang="js" compact className="!mt-1 !mb-0" />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="label flex items-center gap-1"><Terminal className="h-3.5 w-3.5" /> Console & event log</div>
          <div className="code-surface h-[200px] overflow-y-auto rounded-xl border p-3 font-mono text-[11.5px] leading-relaxed">
            {logs.length === 0 && <div className="text-slate-500">// Click a button above or the "Click me" button on the page…</div>}
            {logs.map((l, i) => (
              <div key={i} className={cn('whitespace-pre-wrap', l.kind === 'code' && 'text-sky-300', l.kind === 'out' && 'text-emerald-300', l.kind === 'err' && 'text-rose-400', l.kind === 'event' && 'text-amber-300')}>
                {l.kind === 'code' ? '> ' : l.kind === 'event' ? '⚡ ' : l.kind === 'err' ? '✖ ' : '← '}{l.text}
              </div>
            ))}
          </div>
          <div className="mt-2 label">Write your own JavaScript (Ctrl + Enter to run)</div>
          <textarea value={custom} onChange={(e) => setCustom(e.target.value)} spellCheck={false}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(custom); } }}
            className="input h-20 resize-none font-mono text-xs" />
          <button onClick={() => run(custom)} className="btn btn-primary mt-2 self-start !py-1.5"><Play className="h-4 w-4" /> Run my code</button>
        </div>
      </div>
      <Hint>Elements available: <code className="inline-code">#title</code> <code className="inline-code">#msg</code> <code className="inline-code">#box</code> <code className="inline-code">#list</code> <code className="inline-code">#btn</code> <code className="inline-code">#count</code>. Try <code className="inline-code">document.getElementById("box").style.width = "200px";</code></Hint>
    </div>
  );
}
