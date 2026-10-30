import { createContext, useContext } from 'react';
import { ChevronRight, CircleCheck, Maximize2, MousePointerClick } from 'lucide-react';
import type { Block, SimId } from '../data/types';
import { progress, slugify } from '../lib/store';
import { simById } from '../simulations/registry';
import { cn } from "/utils/cn";
import { CodeBlock, TryIt, TryItStatic } from './Code';
import { Diagram } from './Diagrams';
import { Icon } from './Icon';
import { Callout, Inline } from './ui';

export const AccentCtx = createContext('#6366f1');

export function Blocks({ blocks, print = false }: { blocks: Block[]; print?: boolean }) {
  return <>{blocks.map((b, i) => <BlockView key={i} b={b} print={print} />)}</>;
}

function BlockView({ b, print }: { b: Block; print: boolean }) {
  const accent = useContext(AccentCtx);
  switch (b.type) {
    case 'h2':
      return (
        <h2 id={print ? undefined : slugify(b.text)} className="mb-4 mt-12 flex scroll-mt-24 items-center gap-3 text-xl font-extrabold tracking-tight text-ink first:mt-0 sm:text-2xl">
          <span className="h-7 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span><Inline text={b.text} /></span>
        </h2>
      );
    case 'h3':
      return <h3 className="mb-3 mt-8 text-lg font-bold text-ink"><Inline text={b.text} /></h3>;
    case 'p':
      return <p className="my-4 text-[15.5px] leading-[1.85] text-ink-2"><Inline text={b.text} /></p>;
    case 'list':
      return b.ordered ? (
        <ol className="my-4 space-y-2.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: accent }}>{i + 1}</span>
              <span><Inline text={it} /></span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-4 space-y-2.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} />
              <span><Inline text={it} /></span>
            </li>
          ))}
        </ul>
      );
    case 'code':
      return <CodeBlock code={b.code} lang={b.lang} title={b.title} light={print} />;
    case 'tryit':
      return print
        ? <TryItStatic title={b.title} html={b.html} css={b.css} js={b.js} height={Math.min(b.height ?? 220, 320)} />
        : <TryIt title={b.title} html={b.html} css={b.css} js={b.js} height={b.height} />;
    case 'callout':
      return <Callout variant={b.variant} title={b.title} text={b.text} />;
    case 'image':
      return (
        <figure className="avoid-break my-6">
          <img src={b.src} alt={b.alt} loading="lazy" className="w-full rounded-2xl border border-line object-cover" />
          {b.caption && <figcaption className="mt-2 text-center text-xs text-muted">{b.caption}</figcaption>}
        </figure>
      );
    case 'table':
      return (
        <div className="avoid-break my-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[460px] border-collapse text-left text-sm">
            <thead>
              <tr>
                {b.headers.map((h, i) => (
                  <th key={i} className="border-b border-line px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink" style={{ background: accent + '1a' }}><Inline text={h} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0 even:bg-surface-2/60">
                  {r.map((c, j) => <td key={j} className={cn('px-4 py-2.5 align-top text-ink-2', j === 0 && 'font-semibold text-ink')}><Inline text={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'sim':
      return print ? <SimNote id={b.id} /> : <><SimEmbed id={b.id} /><div className="hidden print:block"><SimNote id={b.id} /></div></>;
    case 'cards':
      return (
        <div className={cn('my-6 grid gap-4 sm:grid-cols-2', b.items.length % 3 === 0 && 'lg:grid-cols-3')}>
          {b.items.map((c, i) => (
            <div key={i} className="card avoid-break p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: accent + '1f', color: accent }}><Icon name={c.icon} className="h-5 w-5" /></div>
              <div className="mb-1 font-bold text-ink"><Inline text={c.title} /></div>
              <p className="text-sm leading-relaxed text-ink-2"><Inline text={c.text} /></p>
            </div>
          ))}
        </div>
      );
    case 'compare':
      return (
        <div className="avoid-break my-6 grid gap-4 md:grid-cols-2 print:grid-cols-2">
          {[b.left, b.right].map((side, i) => (
            <div key={i} className="card overflow-hidden">
              <div className={cn('px-5 py-3 font-bold text-white', i === 0 ? 'bg-linear-to-r from-sky-500 to-blue-600' : 'bg-linear-to-r from-violet-500 to-fuchsia-600')}><Inline text={side.title} /></div>
              <ul className="space-y-2 p-5">
                {side.items.map((it, k) => (
                  <li key={k} className="flex gap-2 text-sm leading-relaxed text-ink-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted" /><span><Inline text={it} /></span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case 'steps':
      return (
        <ol className="avoid-break my-6">
          {b.items.map((s, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < b.items.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-0.5 bg-line" />}
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md" style={{ background: accent }}>{i + 1}</span>
              <div className="pt-1">
                <div className="font-bold text-ink">{s.title}</div>
                <div className="text-sm leading-relaxed text-ink-2"><Inline text={s.text} /></div>
              </div>
            </li>
          ))}
        </ol>
      );
    case 'diagram':
      return <Diagram id={b.id} caption={b.caption} />;
    default:
      return null;
  }
}

function SimEmbed({ id }: { id: SimId }) {
  const s = simById(id);
  if (!s) return null;
  const C = s.Component;
  return (
    <section className="no-print my-8 overflow-hidden rounded-2xl border-2 border-dashed border-indigo-300/70 bg-linear-to-br from-indigo-500/[.06] to-fuchsia-500/[.06] dark:border-indigo-400/30">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md"><Icon name={s.icon} className="h-5 w-5" /></span>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300"><MousePointerClick className="h-3 w-3" /> Interactive simulation</div>
            <div className="font-bold text-ink">{s.title}</div>
          </div>
        </div>
        <a href={`#/lab/${s.id}`} className="btn btn-ghost !px-3 !py-1.5 text-xs"><Maximize2 className="h-3.5 w-3.5" /> Open in Lab</a>
      </div>
      <div className="border-t border-line bg-surface p-4 sm:p-5" onPointerDown={() => progress.markSim(id)}>
        <C />
      </div>
    </section>
  );
}

function SimNote({ id }: { id: SimId }) {
  const s = simById(id);
  if (!s) return null;
  return (
    <div className="avoid-break my-4 flex gap-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/60 p-3 text-sm text-ink-2">
      <span className="text-lg">🔬</span>
      <div><b className="text-ink">Interactive simulation — {s.title}:</b> {s.desc} <i>(Explore it live in the WebCraft Simulation Lab.)</i></div>
    </div>
  );
}
