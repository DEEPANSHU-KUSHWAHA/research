import { useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Copy, ExternalLink, FlaskConical, Play, RotateCcw } from 'lucide-react';
import { highlight, type Lang } from '../lib/highlight';
import { buildDoc, copyText, openInPlayground, useDebounced } from '../lib/store';
import { cn } from "/utils/cn";

export const LANG_LABEL: Record<Lang, string> = { html: 'HTML', css: 'CSS', js: 'JavaScript' };

/* ------------------------------------------------------------------ */
/* Read-only highlighted code                                          */
/* ------------------------------------------------------------------ */
export function CodeBlock({ code, lang, title, light, className, compact }: {
  code: string; lang: Lang; title?: string; light?: boolean; className?: string; compact?: boolean;
}) {
  const html = useMemo(() => highlight(code, lang), [code, lang]);
  return (
    <div className={cn('code-surface my-5 overflow-hidden rounded-xl border', light && 'code-light', className)}>
      <div className={cn('flex items-center justify-between gap-2 border-b px-4 py-1.5', light ? 'border-[#d0d7de]' : 'border-white/10')}>
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5 print:hidden">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className={cn('font-mono text-xs', light ? 'text-slate-500' : 'text-slate-400')}>{title ?? LANG_LABEL[lang]}</span>
        </div>
        <button onClick={() => copyText(code)} className={cn('no-print inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition', light ? 'text-slate-500 hover:bg-slate-200' : 'text-slate-400 hover:bg-white/10 hover:text-white')}>
          <Copy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
      <pre className={cn('overflow-x-auto font-mono text-[13px] leading-relaxed', compact ? 'p-3' : 'p-4')}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editable code with live highlighting (textarea over <pre>)          */
/* ------------------------------------------------------------------ */
export function CodeEditor({ value, onChange, lang, className, style }: {
  value: string; onChange: (v: string) => void; lang: Lang; className?: string; style?: CSSProperties;
}) {
  const html = useMemo(() => highlight(value, lang), [value, lang]);

  const insert = (ta: HTMLTextAreaElement, text: string) => {
    let ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch { ok = false; }
    if (!ok) {
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      onChange(value.slice(0, s) + text + value.slice(e));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + text.length; });
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      insert(ta, '  ');
    } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      const s = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', s - 1) + 1;
      const indent = (/^[ \t]*/.exec(value.slice(lineStart, s)) || [''])[0];
      if (indent) {
        e.preventDefault();
        insert(ta, '\n' + indent);
      }
    }
  };

  return (
    <div className={cn('code-surface overflow-auto', className)} style={style}>
      <div className="relative min-h-full">
        <pre aria-hidden className="editor-layer pointer-events-none" dangerouslySetInnerHTML={{ __html: html + '\n' }} />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label={`${LANG_LABEL[lang]} code editor`}
          className="editor-layer editor-input"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* "Try it yourself" — editor + live preview                           */
/* ------------------------------------------------------------------ */
interface TryProps { title: string; html: string; css?: string; js?: string; height?: number; }

const WIDTHS: { label: string; w: number | null }[] = [{ label: 'Fit', w: null }, { label: '360', w: 360 }, { label: '520', w: 520 }, { label: '800', w: 800 }];

export function TryIt({ title, html, css, js, height = 260 }: TryProps) {
  const initial = useMemo(() => ({ html, css: css ?? '', js: js ?? '' }), [html, css, js]);
  const [code, setCode] = useState(initial);
  const [tab, setTab] = useState<Lang>('html');
  const [run, setRun] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const tabs = (['html', 'css', 'js'] as Lang[]).filter((t) => t === 'html' || initial[t]);
  const doc = useDebounced(buildDoc(code.html, code.css, code.js), 400);
  const changed = code.html !== initial.html || code.css !== initial.css || code.js !== initial.js;

  return (
    <div className="tryit my-7 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm print:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-ink">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white"><FlaskConical className="h-4 w-4" /></span>
          <span className="truncate"><span className="text-muted print:hidden">Try it yourself · </span>{title}</span>
        </div>
        <div className="flex items-center gap-1 print:hidden">
          <button title="Run again" onClick={() => setRun((r) => r + 1)} className="icon-btn h-8 w-8"><Play className="h-4 w-4" /></button>
          <button title="Reset code" disabled={!changed} onClick={() => setCode(initial)} className="icon-btn h-8 w-8 disabled:opacity-40"><RotateCcw className="h-4 w-4" /></button>
          <button title="Copy code" onClick={() => copyText(code[tab])} className="icon-btn h-8 w-8"><Copy className="h-4 w-4" /></button>
          <button title="Open in Playground" onClick={() => openInPlayground(code)} className="btn btn-soft ml-1 !px-2.5 !py-1.5 text-xs"><ExternalLink className="h-3.5 w-3.5" /> Playground</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 print:block">
        <div className="flex min-w-0 flex-col md:border-r md:border-line print:hidden">
          <div className="code-surface flex gap-1 border-b border-white/10 px-2 pt-2">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('rounded-t-lg px-3 py-1.5 font-mono text-xs font-semibold transition', tab === t ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white')}>
                {t === 'js' ? 'JS' : t.toUpperCase()}
              </button>
            ))}
            <span className="ml-auto self-center pr-2 text-[10px] text-slate-500">edit me ✎</span>
          </div>
          <CodeEditor value={code[tab]} onChange={(v) => setCode((c) => ({ ...c, [tab]: v }))} lang={tab} style={{ height }} />
        </div>
        <div className="hidden p-3 print:block">
          {tabs.map((t) => <CodeBlock key={t} code={code[t]} lang={t} light compact className="my-2" />)}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Output</span>
            <div className="flex gap-0.5 print:hidden">
              {WIDTHS.map((o) => (
                <button key={o.label} onClick={() => setWidth(o.w)} className={cn('rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold transition', width === o.w ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300' : 'text-muted hover:text-ink')}>{o.label}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto bg-white">
            <iframe key={run} title={title} srcDoc={doc} sandbox="allow-scripts allow-modals allow-forms allow-popups"
              className="block bg-white" style={{ height, width: width ?? '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Static version used inside the printable report. */
export function TryItStatic({ title, html, css, js, height = 220 }: TryProps) {
  const doc = useMemo(() => buildDoc(html, css, js), [html, css, js]);
  return (
    <div className="my-5 rounded-xl border border-line p-3">
      <div className="mb-1 text-sm font-bold text-ink">▶ Example: {title}</div>
      <CodeBlock code={html} lang="html" light compact className="my-2" />
      {css && <CodeBlock code={css} lang="css" light compact className="my-2" />}
      {js && <CodeBlock code={js} lang="js" light compact className="my-2" />}
      <div className="avoid-break">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">Output</div>
        <iframe title={title} srcDoc={doc} sandbox="allow-scripts" className="block w-full rounded-lg border border-line bg-white" style={{ height }} />
      </div>
    </div>
  );
}
