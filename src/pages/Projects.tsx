import { useMemo, useState } from 'react';
import { ChevronDown, Copy, Download, ExternalLink, Hammer, Printer, Target } from 'lucide-react';
import { CodeBlock } from '../components/Code';
import { PageHeader } from '../components/ui';
import { practicals, type Practical } from '../data/practicals';
import { buildDoc, copyText, downloadFile, openInPlayground, printPage } from '../lib/store';
import { cn } from "/utils/cn";

const level = (n: number) =>
  n === 12 ? { label: 'HTML + CSS + JS', cls: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' }
    : n >= 10 ? { label: 'JavaScript', cls: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' }
      : n >= 7 ? { label: 'CSS', cls: 'bg-pink-500/15 text-pink-700 dark:text-pink-300' }
        : { label: 'HTML', cls: 'bg-orange-500/15 text-orange-700 dark:text-orange-300' };

function ProjectCard({ p, n, open, onToggle }: { p: Practical; n: number; open: boolean; onToggle: () => void }) {
  const doc = useMemo(() => buildDoc(p.html), [p.html]);
  const lv = level(n);
  return (
    <article className={cn('card overflow-hidden print:border-0 print:shadow-none', n > 1 && 'print:break-before-page')}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left print:px-0">
        <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-600 text-white shadow-md print:hidden">
          <span className="text-[9px] font-bold uppercase opacity-80">No.</span><span className="text-lg font-extrabold leading-none">{n}</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-300">Project {n}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', lv.cls)}>{lv.label}</span>
          </div>
          <h3 className="text-lg font-extrabold text-ink">{p.title}</h3>
          <p className="mt-1 flex gap-1.5 text-sm text-ink-2"><Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-500 print:hidden" /><span><b className="text-ink">Goal:</b> {p.aim}</span></p>
          <div className="mt-2 flex flex-wrap gap-1.5">{p.concepts.map((c) => <span key={c} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-2">{c}</span>)}</div>
        </div>
        <ChevronDown className={cn('no-print mt-1 h-5 w-5 shrink-0 text-muted transition', open && 'rotate-180')} />
      </button>
      <div className={cn('border-t border-line p-5 print:block print:border-0 print:px-0', !open && 'hidden')}>
        <div className="no-print mb-3 flex flex-wrap gap-2">
          <button className="btn btn-soft !py-1.5 text-xs" onClick={() => openInPlayground({ html: p.html })}><ExternalLink className="h-3.5 w-3.5" /> Open in Playground</button>
          <button className="btn btn-ghost !py-1.5 text-xs" onClick={() => copyText(p.html)}><Copy className="h-3.5 w-3.5" /> Copy code</button>
          <button className="btn btn-ghost !py-1.5 text-xs" onClick={() => downloadFile(`project-${n}.html`, p.html)}><Download className="h-3.5 w-3.5" /> Download .html</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 print:block">
          <div className="min-w-0">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-muted">Source code</div>
            <CodeBlock code={p.html} lang="html" title={`project-${n}.html`} className="!my-0 max-h-[520px] overflow-auto print:max-h-none" />
          </div>
          <div className="min-w-0 print:mt-4">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-muted">Output</div>
            <div className="avoid-break overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100 px-3 py-1.5 print:hidden">
                <i className="h-2 w-2 rounded-full bg-[#ff5f57]" /><i className="h-2 w-2 rounded-full bg-[#febc2e]" /><i className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">project-{n}.html</span>
              </div>
              <iframe title={p.title} srcDoc={doc} sandbox="allow-scripts allow-modals allow-forms" className="block w-full bg-white" style={{ height: p.height ?? 360 }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<Record<string, boolean>>({ p1: true });
  const allOpen = practicals.every((p) => open[p.id]);
  return (
    <div className="animate-fade-up">
      <PageHeader icon={<Hammer className="h-7 w-7" />} title="Hands-on Projects" gradient="from-violet-600 via-purple-600 to-fuchsia-600"
        subtitle={`${practicals.length} guided projects, from your first web page to a complete portfolio. Each has a clear goal, full source code and live output — open it in the Playground, remix it and make it your own.`}>
        <button className="btn bg-white/15 text-white backdrop-blur hover:bg-white/25" onClick={() => setOpen(allOpen ? {} : Object.fromEntries(practicals.map((p) => [p.id, true])))}>{allOpen ? 'Collapse all' : 'Expand all'}</button>
        <button className="btn bg-white text-violet-700 shadow-lg" onClick={printPage}><Printer className="h-4 w-4" /> Print projects</button>
      </PageHeader>
      <div className="space-y-4">
        {practicals.map((p, i) => <ProjectCard key={p.id} p={p} n={i + 1} open={!!open[p.id]} onToggle={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))} />)}
      </div>
    </div>
  );
}
