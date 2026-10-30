import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowUp, CircleCheck, CodeXml, FileDown, FlaskConical, GraduationCap, Hammer, House, Info, Library, ListChecks,
  Menu, Moon, Printer, Search, Sun, X, type LucideIcon,
} from 'lucide-react';
import { chapterSections, chapters, units } from '../data';
import { glossary } from '../data/reference';
import { palette } from '../lib/palette';
import { navigate, printPage, scrollToId, setPendingScroll, slugify, useProgress, useTheme, useToasts } from '../lib/store';
import { SIMS } from '../simulations/registry';
import { cn } from "/utils/cn";
import { Icon } from './Icon';

export const NAV: { to: string; label: string; icon: LucideIcon; highlight?: boolean }[] = [
  { to: '/', label: 'Home', icon: House },
  { to: '/lab', label: 'Simulation Lab', icon: FlaskConical },
  { to: '/playground', label: 'Code Playground', icon: CodeXml },
  { to: '/projects', label: 'Projects', icon: Hammer },
  { to: '/quiz', label: 'Quiz Arena', icon: GraduationCap },
  { to: '/glossary', label: 'Glossary', icon: Library },
  { to: '/cheatsheet', label: 'Cheat Sheet', icon: ListChecks },
  { to: '/guide', label: 'PDF Study Guide', icon: Printer, highlight: true },
];

export function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
        <CodeXml className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-[17px] font-extrabold tracking-tight text-ink">WebCraft</span>
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted">Web Design for Everyone</span>
      </span>
    </a>
  );
}

const isActive = (path: string, to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'));

export function Sidebar({ path, open, onClose }: { path: string; open: boolean; onClose: () => void }) {
  const prog = useProgress();
  const pct = Math.round((prog.done.length / chapters.length) * 100);
  return (
    <>
      {open && <div className="no-print fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={cn('no-print fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0', open ? 'translate-x-0 shadow-2xl' : '-translate-x-full')}>
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <Logo />
          <button className="icon-btn lg:hidden" onClick={onClose} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-4 rounded-2xl bg-linear-to-br from-indigo-500/10 to-fuchsia-500/10 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-ink"><span>Your progress</span><span>{pct}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 transition-all duration-700" style={{ width: `${pct}%` }} /></div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-muted"><span>{prog.done.length}/{chapters.length} chapters</span><span>{prog.sims.length}/{SIMS.length} sims tried</span></div>
          </div>
          <nav className="space-y-0.5">
            {NAV.map((n) => (
              <a key={n.to} href={`#${n.to}`}
                className={cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
                  isActive(path, n.to) ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : n.highlight ? 'text-fuchsia-600 hover:bg-fuchsia-500/10 dark:text-fuchsia-400' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')}>
                <n.icon className="h-[18px] w-[18px]" />{n.label}
              </a>
            ))}
          </nav>
          {units.map((u) => (
            <div key={u.num} className="mt-5">
              <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted">Unit {u.num} · {u.title}</div>
              {chapters.filter((c) => c.unit === u.num).map((c) => {
                const active = path === `/chapter/${c.id}`;
                const done = prog.done.includes(c.id);
                return (
                  <a key={c.id} href={`#/chapter/${c.id}`}
                    className={cn('group flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-[13px] font-medium transition', active ? 'bg-surface-2 text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink')}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: palette[c.color].hex }}>
                      {done ? <CircleCheck className="h-3.5 w-3.5" /> : c.num}
                    </span>
                    <span className="truncate">{c.short}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: palette[c.color].hex }} />}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export function Header({ onMenu, onSearch, path }: { onMenu: () => void; onSearch: () => void; path: string }) {
  const [dark, setDark] = useTheme();
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setScroll(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [path]);
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
        <button className="icon-btn lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        <div className="lg:hidden"><Logo /></div>
        <button onClick={onSearch} className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-line bg-surface-2/70 px-3 py-2 text-sm text-muted transition hover:border-indigo-300 sm:flex lg:max-w-lg">
          <Search className="h-4 w-4" /><span className="flex-1 text-left">Search chapters, simulations, terms…</span>
          <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] font-bold">Ctrl K</kbd>
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button className="icon-btn sm:hidden" onClick={onSearch} aria-label="Search"><Search className="h-5 w-5" /></button>
          <button className="icon-btn" title="Print this page / Save as PDF" onClick={printPage} aria-label="Print"><Printer className="h-5 w-5" /></button>
          <button className="icon-btn" title="Toggle dark mode" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <a href="#/guide" className="btn btn-primary ml-1 hidden !py-1.5 md:inline-flex"><FileDown className="h-4 w-4" /> Get the PDF</a>
        </div>
      </div>
      <div className="h-[3px] bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${scroll * 100}%` }} />
    </header>
  );
}

interface Item { group: string; label: string; sub?: string; to: string; scroll?: string; icon?: string; }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const all = useMemo<Item[]>(() => [
    ...NAV.map((n) => ({ group: 'Pages', label: n.label, to: n.to, icon: 'Sparkles' })),
    ...chapters.map((c) => ({ group: 'Chapters', label: `${c.num}. ${c.title}`, sub: c.tagline, to: `/chapter/${c.id}`, icon: c.icon })),
    ...chapters.flatMap((c) => chapterSections(c).map((s) => ({ group: 'Sections', label: s, sub: `Chapter ${c.num} · ${c.short}`, to: `/chapter/${c.id}`, scroll: slugify(s), icon: 'BookOpen' }))),
    ...SIMS.map((s) => ({ group: 'Simulations', label: s.title, sub: s.desc, to: `/lab/${s.id}`, icon: s.icon })),
    ...glossary.map((g) => ({ group: 'Glossary', label: g.term, sub: g.def, to: '/glossary', scroll: 'term-' + slugify(g.term), icon: 'Hash' })),
  ], []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all.filter((i) => i.group === 'Pages' || i.group === 'Chapters');
    return all.filter((i) => `${i.label} ${i.sub ?? ''}`.toLowerCase().includes(s)).slice(0, 40);
  }, [q, all]);

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => { setIdx(0); }, [q]);
  useEffect(() => { listRef.current?.querySelector(`[data-i="${idx}"]`)?.scrollIntoView({ block: 'nearest' }); }, [idx]);

  if (!open) return null;

  const go = (it: Item) => {
    onClose();
    const same = (decodeURIComponent(window.location.hash.replace(/^#/, '')) || '/') === it.to;
    if (it.scroll) {
      if (same) setTimeout(() => scrollToId(it.scroll!), 60);
      else setPendingScroll(it.scroll);
    }
    navigate(it.to);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' && results[idx]) go(results[idx]);
    else if (e.key === 'Escape') onClose();
  };

  return (
    <div className="no-print fixed inset-0 z-[90] flex items-start justify-center bg-slate-900/50 p-4 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div className="animate-pop w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-5 w-5 text-muted" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search anything… e.g. flexbox, alt, DNS"
            className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted" />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-bold text-muted">ESC</kbd>
        </div>
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="p-8 text-center text-sm text-muted">No results for "{q}"</div>}
          {results.map((it, i) => (
            <div key={`${it.group}-${it.label}-${i}`}>
              {(i === 0 || results[i - 1].group !== it.group) && <div className="px-3 pb-1 pt-3 text-[10px] font-extrabold uppercase tracking-widest text-muted">{it.group}</div>}
              <button data-i={i} onMouseEnter={() => setIdx(i)} onClick={() => go(it)}
                className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition', i === idx ? 'bg-indigo-500/10' : '')}>
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', i === idx ? 'bg-indigo-600 text-white' : 'bg-surface-2 text-muted')}><Icon name={it.icon} className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{it.label}</span>
                  {it.sub && <span className="block truncate text-xs text-muted">{it.sub}</span>}
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-4 border-t border-line px-4 py-2 text-[11px] text-muted"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>
  );
}

export function Toaster() {
  const { items } = useToasts();
  return (
    <div className="no-print pointer-events-none fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((t) => (
        <div key={t.id} className="animate-pop pointer-events-auto flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-2xl dark:bg-white dark:text-slate-900">
          {t.kind === 'success' ? <CircleCheck className="h-4 w-4 text-emerald-400" /> : <Info className="h-4 w-4 text-sky-400" />}{t.msg}
        </div>
      ))}
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
      className="no-print animate-pop fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30 transition hover:scale-110">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
