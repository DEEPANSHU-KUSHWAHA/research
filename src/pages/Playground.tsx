import { useEffect, useRef, useState } from 'react';
import { Copy, Download, ExternalLink, Laptop, Monitor, Play, RotateCcw, Smartphone, Tablet, Terminal, Trash2 } from 'lucide-react';
import { CodeEditor, LANG_LABEL } from '../components/Code';
import { practicals } from '../data/practicals';
import type { Lang } from '../lib/highlight';
import { buildDoc, copyText, downloadFile, toast, useLocalStorage } from '../lib/store';
import { cn } from "/utils/cn";

interface Code { html: string; css: string; js: string; }
const STARTER: Code = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Web Page</title>
</head>
<body>
  <div class="card">
    <h1>Hello, Web! 👋</h1>
    <p>Edit the HTML, CSS and JS tabs — the preview updates live.</p>
    <button id="btn">Click me</button>
  </div>
</body>
</html>`,
  css: `body {
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(135deg, #e0e7ff, #fae8ff);
  display: flex;
  justify-content: center;
  padding: 40px;
}
.card {
  background: white;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  text-align: center;
}
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}`,
  js: `let clicks = 0;
document.getElementById("btn").addEventListener("click", function () {
  clicks++;
  this.textContent = "Clicked " + clicks + " times";
  console.log("Button clicked:", clicks);
});`,
};
const TEMPLATES: { name: string; code: Code }[] = [
  { name: 'Starter: card + button', code: STARTER },
  { name: 'Blank page', code: { html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Blank</title>\n</head>\n<body>\n  \n</body>\n</html>', css: '', js: '' } },
  ...practicals.map((p, i) => ({ name: `Project ${i + 1}: ${p.title}`, code: { html: p.html, css: '', js: '' } })),
];
const DEVICES = [{ label: 'Full', w: null, icon: Monitor }, { label: 'Laptop', w: 1024, icon: Laptop }, { label: 'Tablet', w: 768, icon: Tablet }, { label: 'Mobile', w: 375, icon: Smartphone }];

export default function Playground() {
  const [code, setCode] = useLocalStorage<Code>('wc-playground', STARTER);
  const [tab, setTab] = useState<Lang>('html');
  const [auto, setAuto] = useState(true);
  const [doc, setDoc] = useState(() => buildDoc(code.html, code.css, code.js, true));
  const [runKey, setRunKey] = useState(0);
  const [device, setDevice] = useState<number | null>(null);
  const [logs, setLogs] = useState<{ type: string; text: string }[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let raw: string | null = null;
    try { raw = localStorage.getItem('wc-playground-incoming'); localStorage.removeItem('wc-playground-incoming'); } catch { /* ignore */ }
    if (raw) {
      try {
        const c = JSON.parse(raw);
        setCode({ html: c.html ?? '', css: c.css ?? '', js: c.js ?? '' });
        toast('Code loaded into the Playground');
      } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = () => { setLogs([]); setDoc(buildDoc(code.html, code.css, code.js, true)); setRunKey((k) => k + 1); };

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => { setLogs([]); setDoc(buildDoc(code.html, code.css, code.js, true)); }, 500);
    return () => clearTimeout(t);
  }, [code, auto]);

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      const d = e.data;
      if (d && d.__wc) setLogs((l) => [...l, { type: String(d.type), text: (d.args || []).join(' ') }].slice(-100));
    };
    window.addEventListener('message', on);
    return () => window.removeEventListener('message', on);
  }, []);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key.toLowerCase() === 's')) { e.preventDefault(); run(); toast(e.key === 'Enter' ? 'Code executed' : 'Saved automatically'); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  });

  const fullDoc = () => buildDoc(code.html, code.css, code.js);
  const openTab = () => {
    const url = URL.createObjectURL(new Blob([fullDoc()], { type: 'text/html' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  const errors = logs.filter((l) => l.type === 'error').length;

  return (
    <div className="animate-fade-up flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2">
          <h1 className="text-xl font-extrabold tracking-tight text-ink">Code Playground</h1>
          <p className="text-xs text-muted">Write HTML, CSS & JavaScript and see the result instantly. Your work is saved automatically.</p>
        </div>
        <select className="input !w-auto max-w-[260px] text-xs" value="" onChange={(e) => { const t = TEMPLATES[Number(e.target.value)]; if (t) { setCode(t.code); toast(`Loaded "${t.name}"`); } }} aria-label="Load template">
          <option value="" disabled>📂 Load a template…</option>
          {TEMPLATES.map((t, i) => <option key={t.name} value={i}>{t.name}</option>)}
        </select>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <label className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2"><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto-run</label>
          <button className="btn btn-primary !py-1.5" onClick={run} title="Ctrl + Enter"><Play className="h-4 w-4" /> Run</button>
          <button className="btn btn-ghost !px-2.5 !py-1.5" onClick={openTab} title="Open result in a new tab"><ExternalLink className="h-4 w-4" /></button>
          <button className="btn btn-ghost !px-2.5 !py-1.5" onClick={() => { downloadFile('my-webpage.html', fullDoc()); toast('Downloaded my-webpage.html'); }} title="Download as .html"><Download className="h-4 w-4" /></button>
          <button className="btn btn-ghost !px-2.5 !py-1.5" onClick={() => copyText(fullDoc(), 'Full HTML copied')} title="Copy complete page"><Copy className="h-4 w-4" /></button>
          <button className="btn btn-ghost !px-2.5 !py-1.5" onClick={() => { if (confirm('Reset the playground to the starter code?')) setCode(STARTER); }} title="Reset"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
          <div className="code-surface flex items-center gap-1 border-b border-white/10 px-2 pt-2">
            {(['html', 'css', 'js'] as Lang[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn('flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-xs font-bold transition', tab === t ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white')}>
                <i className={cn('h-2 w-2 rounded-full', t === 'html' ? 'bg-orange-400' : t === 'css' ? 'bg-sky-400' : 'bg-yellow-300')} />
                {LANG_LABEL[t]}<span className="font-mono text-[10px] font-normal opacity-60">{code[t].split('\n').length}L</span>
              </button>
            ))}
          </div>
          <CodeEditor value={code[tab]} onChange={(v) => setCode((c) => ({ ...c, [tab]: v }))} lang={tab} className="h-[420px] xl:h-[calc(100vh-15rem)] xl:min-h-[480px]" />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-line bg-surface-2 px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-bold text-muted">
              <span className="flex gap-1"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></span>
              Live preview {device && <span className="font-mono">· {device}px</span>}
            </div>
            <div className="flex gap-0.5">
              {DEVICES.map((d) => (
                <button key={d.label} title={d.label} onClick={() => setDevice(d.w)} className={cn('icon-btn h-8 w-8', device === d.w && 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300')}><d.icon className="h-4 w-4" /></button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-surface-2/50 bg-dots">
            <iframe ref={frame} key={runKey} title="Playground preview" srcDoc={doc} sandbox="allow-scripts allow-modals allow-forms allow-popups"
              className="mx-auto block h-[420px] bg-white shadow-sm transition-all xl:h-full xl:min-h-[300px]" style={{ width: device ?? '100%' }} />
          </div>
          <div className="border-t border-line">
            <button onClick={() => setShowConsole((s) => !s)} className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-bold text-muted hover:text-ink">
              <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" /> Console {logs.length > 0 && <span className={cn('rounded-full px-1.5 text-[10px] text-white', errors ? 'bg-rose-500' : 'bg-indigo-500')}>{logs.length}</span>}</span>
              <span className="flex items-center gap-2">{logs.length > 0 && <Trash2 className="h-3.5 w-3.5" onClick={(e) => { e.stopPropagation(); setLogs([]); }} />}{showConsole ? '▾' : '▸'}</span>
            </button>
            {showConsole && (
              <div className="code-surface max-h-36 min-h-[72px] overflow-y-auto px-3 py-2 font-mono text-[11.5px] leading-relaxed">
                {logs.length === 0 ? <div className="text-slate-500">// console.log() output and errors appear here</div> : logs.map((l, i) => (
                  <div key={i} className={cn('whitespace-pre-wrap border-b border-white/5 py-0.5', l.type === 'error' ? 'text-rose-400' : l.type === 'warn' ? 'text-amber-300' : 'text-emerald-300')}>
                    {l.type === 'error' ? '✖ ' : l.type === 'warn' ? '⚠ ' : '› '}{l.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted">Shortcuts: <kbd className="rounded border border-line px-1">Tab</kbd> indent · <kbd className="rounded border border-line px-1">Ctrl + Enter</kbd> run · auto-indent on Enter · work is saved in your browser.</p>
    </div>
  );
}
