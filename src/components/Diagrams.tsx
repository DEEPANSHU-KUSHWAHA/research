import { Fragment, useState, type ReactNode } from 'react';
import { ArrowRight, CircleCheck, CodeXml, Globe, Laptop, Palette, PenTool, RefreshCw, Rocket, Server, Target, type LucideIcon } from 'lucide-react';
import type { DiagramId } from '../data/types';
import { cn } from '../utils/cn';

export function Diagram({ id, caption }: { id: DiagramId; caption?: string }) {
  const C = { 'client-server': ClientServer, 'element-anatomy': ElementAnatomy, 'html-structure': HtmlStructure, 'css-syntax': CssSyntax, 'box-model': BoxModelDiagram, 'semantic-layout': SemanticLayout, 'web-process': WebProcess }[id];
  return (
    <figure className="avoid-break my-7">
      <div className="card overflow-x-auto bg-dots p-5 sm:p-6">
        <C />
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs font-semibold text-muted">{caption}</figcaption>}
    </figure>
  );
}

/* ---------------- Client–server ---------------- */
function Node({ icon: I, title, sub, color }: { icon: LucideIcon; title: string; sub: string; color: string }) {
  return (
    <div className="flex w-28 shrink-0 flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: color }}><I className="h-8 w-8" /></div>
      <div className="mt-2 text-sm font-bold text-ink">{title}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  );
}
function Arrows({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="flex min-w-[90px] flex-1 flex-col gap-4 px-1">
      <div className="text-center">
        <div className="mb-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">{top}</div>
        <div className="relative h-0.5 bg-sky-500"><span className="absolute -right-1 -top-[5px] border-y-[6px] border-l-[9px] border-y-transparent border-l-sky-500" /></div>
      </div>
      <div className="text-center">
        <div className="relative h-0.5 bg-emerald-500"><span className="absolute -left-1 -top-[5px] border-y-[6px] border-r-[9px] border-y-transparent border-r-emerald-500" /></div>
        <div className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{bottom}</div>
      </div>
    </div>
  );
}
function ClientServer() {
  return (
    <div className="flex min-w-[560px] items-center justify-between gap-2">
      <Node icon={Laptop} title="Client" sub="Web browser" color="#0ea5e9" />
      <Arrows top="① Request: GET /index.html" bottom="④ Response: 200 OK" />
      <div className="flex flex-col items-center gap-2">
        <Node icon={Globe} title="Internet" sub="ISPs, routers, DNS" color="#8b5cf6" />
      </div>
      <Arrows top="② Request forwarded" bottom="③ HTML, CSS, images" />
      <Node icon={Server} title="Web Server" sub="Stores website files" color="#10b981" />
    </div>
  );
}

/* ---------------- Element anatomy (interactive) ---------------- */
const PARTS = [
  { k: 'open', label: 'Opening tag', color: '#f97316', desc: 'Marks the start of the element, written inside angle brackets: <p class="intro">.' },
  { k: 'attr', label: 'Attribute name', color: '#0ea5e9', desc: 'Gives extra information about the element. Attributes are always written inside the opening tag.' },
  { k: 'val', label: 'Attribute value', color: '#8b5cf6', desc: 'The value of the attribute, written inside double quotes after the = sign.' },
  { k: 'content', label: 'Content', color: '#10b981', desc: 'The text (or other elements) placed between the opening and closing tags. This is what users see.' },
  { k: 'close', label: 'Closing tag', color: '#f43f5e', desc: 'Marks the end of the element. Same tag name as the opening tag, but with a forward slash: </p>.' },
];
function ElementAnatomy() {
  const [active, setActive] = useState<string | null>(null);
  const color = (k: string) => PARTS.find((p) => p.k === k)!.color;
  const seg = (k: string, text: string) => (
    <span onMouseEnter={() => setActive(k)} onMouseLeave={() => setActive(null)} onClick={() => setActive(k)}
      className="cursor-help rounded px-0.5 transition"
      style={{ color: color(k), background: active === k ? color(k) + '22' : undefined, boxShadow: active === k ? `inset 0 -3px 0 ${color(k)}` : undefined }}>
      {text}
    </span>
  );
  const cur = PARTS.find((p) => p.k === active);
  return (
    <div className="text-center">
      <div className="inline-block">
        <div className="whitespace-nowrap py-2 font-mono text-lg font-bold sm:text-2xl">
          {seg('open', '<p ')}{seg('attr', 'class')}{seg('open', '=')}{seg('val', '"intro"')}{seg('open', '>')}{seg('content', 'Hello, World!')}{seg('close', '</p>')}
        </div>
        <div className="mx-auto h-3 w-full rounded-b-lg border-2 border-t-0 border-slate-400" />
        <div className="mt-1 text-[11px] font-extrabold uppercase tracking-widest text-muted">Element</div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {PARTS.map((p) => (
          <button key={p.k} onMouseEnter={() => setActive(p.k)} onMouseLeave={() => setActive(null)} onClick={() => setActive(p.k)}
            className="chip transition" style={{ borderColor: p.color, color: p.color, background: active === p.k ? p.color + '1c' : undefined }}>
            <i className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.label}
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[48px] rounded-xl bg-surface-2 p-3 text-sm text-ink-2 print:hidden">
        {cur ? <><b style={{ color: cur.color }}>{cur.label}:</b> {cur.desc}</> : <><b>Element</b> = opening tag + content + closing tag. Hover over or tap a part to learn more.</>}
      </div>
      <ul className="mt-3 hidden space-y-1 text-left text-xs print:block">
        {PARTS.map((p) => <li key={p.k}><b style={{ color: p.color }}>{p.label}:</b> {p.desc}</li>)}
      </ul>
    </div>
  );
}

/* ---------------- HTML document structure ---------------- */
function Box({ tag, color, note, children }: { tag: string; color: string; note?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border-2 p-3" style={{ borderColor: color, background: color + '12' }}>
      <div className="mb-2 flex items-center justify-between gap-2 font-mono text-xs font-bold" style={{ color }}>
        <span>&lt;{tag}&gt;</span>{note && <span className="font-sans font-semibold text-muted">{note}</span>}
      </div>
      {children}
    </div>
  );
}
const Leaf = ({ tag, text }: { tag: string; text: string }) => (
  <div className="rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs"><b className="text-ink">&lt;{tag}&gt;</b> <span className="text-muted">{text}</span></div>
);
function HtmlStructure() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 rounded-lg border border-dashed border-slate-400 px-3 py-1.5 font-mono text-xs text-muted">&lt;!DOCTYPE html&gt; — tells the browser: "this is HTML5"</div>
      <Box tag="html" color="#f97316" note="root element">
        <div className="grid gap-3 sm:grid-cols-2">
          <Box tag="head" color="#0ea5e9" note="information · not visible">
            <div className="space-y-1.5"><Leaf tag="meta" text="charset" /><Leaf tag="title" text="tab text" /><Leaf tag="link" text="CSS file" /></div>
          </Box>
          <Box tag="body" color="#10b981" note="visible content">
            <div className="space-y-1.5"><Leaf tag="h1" text="heading" /><Leaf tag="p" text="paragraph" /><Leaf tag="img" text="image" /></div>
          </Box>
        </div>
      </Box>
    </div>
  );
}

/* ---------------- CSS rule syntax ---------------- */
function Seg({ text, label, color }: { text: string; label?: string; color: string }) {
  return (
    <span className="inline-flex flex-col items-center align-top">
      <span className="px-1 font-mono text-xl font-bold sm:text-2xl" style={{ color }}>{text}</span>
      {label ? (
        <>
          <span className="mt-1 h-2 w-full rounded-b border-x-2 border-b-2" style={{ borderColor: color }} />
          <span className="mt-1 whitespace-nowrap text-[10px] font-extrabold uppercase tracking-wide" style={{ color }}>{label}</span>
        </>
      ) : <span className="h-7" />}
    </span>
  );
}
function CssSyntax() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 inline-block rounded-lg bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">Declaration block = everything inside {'{ }'}</div>
      <div className="whitespace-nowrap">
        <Seg text="h1" label="Selector" color="#ec4899" />
        <Seg text="{" color="#64748b" />
        <Seg text="color" label="Property" color="#0ea5e9" />
        <Seg text=":" color="#64748b" />
        <Seg text="blue" label="Value" color="#8b5cf6" />
        <Seg text=";" color="#64748b" />
        <Seg text="font-size: 24px;" label="Declaration" color="#10b981" />
        <Seg text="}" color="#64748b" />
      </div>
    </div>
  );
}

/* ---------------- Box model ---------------- */
function BoxModelDiagram() {
  return (
    <div className="mx-auto max-w-md font-mono text-xs">
      <div className="relative rounded-md border-2 border-dashed border-orange-400 bg-orange-200/70 p-7 dark:bg-orange-500/20">
        <span className="absolute left-2 top-1.5 font-bold text-orange-700 dark:text-orange-300">margin</span>
        <div className="relative rounded-sm bg-amber-300 p-6 dark:bg-amber-500/50">
          <span className="absolute left-2 top-1 font-bold text-amber-900 dark:text-amber-100">border</span>
          <div className="relative bg-emerald-200 p-7 dark:bg-emerald-500/30">
            <span className="absolute left-2 top-1.5 font-bold text-emerald-800 dark:text-emerald-200">padding</span>
            <div className="flex h-16 items-center justify-center rounded bg-sky-300 text-center font-bold text-sky-900 dark:bg-sky-500/50 dark:text-sky-50">content<br />width × height</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Semantic layout ---------------- */
function SBox({ tag, className, color }: { tag: string; className?: string; color: string }) {
  return <div className={cn('flex items-center justify-center rounded-lg border-2 font-mono text-xs font-bold', className)} style={{ borderColor: color, background: color + '1a', color }}>&lt;{tag}&gt;</div>;
}
function SemanticLayout() {
  return (
    <div className="mx-auto grid max-w-lg grid-cols-4 gap-2">
      <SBox tag="header" className="col-span-4 h-12" color="#6366f1" />
      <SBox tag="nav" className="col-span-4 h-9" color="#0ea5e9" />
      <div className="col-span-3 rounded-lg border-2 p-2" style={{ borderColor: '#10b981', background: '#10b98112' }}>
        <div className="mb-1 font-mono text-xs font-bold text-emerald-600">&lt;main&gt;</div>
        <div className="grid gap-2"><SBox tag="section" className="h-10" color="#14b8a6" /><SBox tag="article" className="h-16" color="#f59e0b" /></div>
      </div>
      <SBox tag="aside" className="col-span-1" color="#ec4899" />
      <SBox tag="footer" className="col-span-4 h-10" color="#64748b" />
    </div>
  );
}

/* ---------------- Web design process ---------------- */
const PROCESS: [string, LucideIcon][] = [['Plan', Target], ['Wireframe', PenTool], ['Design', Palette], ['Develop', CodeXml], ['Test', CircleCheck], ['Launch', Rocket], ['Maintain', RefreshCw]];
function WebProcess() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-y-4">
        {PROCESS.map(([t, I], i) => (
          <Fragment key={t}>
            <div className="flex w-[74px] flex-col items-center gap-1.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md" style={{ background: `hsl(${235 + i * 20} 72% 58%)` }}><I className="h-6 w-6" /></div>
              <div className="text-center text-[11px] font-bold text-ink">{i + 1}. {t}</div>
            </div>
            {i < PROCESS.length - 1 && <ArrowRight className="mb-5 h-4 w-4 shrink-0 text-muted" />}
          </Fragment>
        ))}
      </div>
      <div className="mt-3 text-center text-xs font-medium text-muted">↻ Feedback from maintenance flows back into planning — the cycle repeats.</div>
    </div>
  );
}
