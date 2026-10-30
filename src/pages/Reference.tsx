import { useEffect, useMemo, useState } from 'react';
import { Library, ListChecks, Printer, Search } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { cssCheat, glossary, htmlCheat, jsCheat, type CheatGroup, type GlossCat } from '../data/reference';
import { printPage, scrollToId, slugify, takePendingScroll } from '../lib/store';
import { cn } from '../utils/cn';

const CAT_COLOR: Record<GlossCat, string> = { Web: '#0ea5e9', HTML: '#f97316', CSS: '#ec4899', JS: '#eab308', Design: '#6366f1' };

export function Glossary() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'All' | GlossCat>('All');
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const t = takePendingScroll();
    if (t) setTimeout(() => { scrollToId(t); setFlash(t); setTimeout(() => setFlash(null), 1800); }, 150);
  }, []);

  const list = useMemo(() => glossary
    .filter((g) => (cat === 'All' || g.cat === cat) && `${g.term} ${g.def}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term)), [q, cat]);
  const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))];

  return (
    <div className="animate-fade-up">
      <PageHeader icon={<Library className="h-7 w-7" />} title="Glossary" gradient="from-sky-600 via-blue-600 to-indigo-600"
        subtitle={`${glossary.length} important web design terms explained in simple language.`}>
        <button className="btn bg-white text-blue-700" onClick={printPage}><Printer className="h-4 w-4" /> Print</button>
      </PageHeader>
      <div className="no-print sticky top-[4.25rem] z-20 mb-6 space-y-3 rounded-2xl border border-line bg-surface/90 p-3 backdrop-blur">
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="input !pl-9" placeholder="Search terms…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Web', 'HTML', 'CSS', 'JS', 'Design'] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn('chip transition', cat === c && 'border-transparent text-white')} style={cat === c ? { background: c === 'All' ? '#6366f1' : CAT_COLOR[c] } : undefined}>{c}</button>
          ))}
          <span className="ml-auto hidden gap-0.5 md:flex">
            {letters.map((l) => <button key={l} onClick={() => scrollToId('letter-' + l)} className="h-6 w-6 rounded-md text-[11px] font-bold text-muted hover:bg-surface-2 hover:text-ink">{l}</button>)}
          </span>
        </div>
      </div>
      {list.length === 0 && <div className="card p-10 text-center text-muted">No terms match your search.</div>}
      <div className="space-y-8">
        {letters.map((l) => (
          <section key={l} id={'letter-' + l} className="scroll-mt-48">
            <div className="mb-3 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-lg font-extrabold text-surface">{l}</span><div className="h-px flex-1 bg-line" /></div>
            <div className="grid gap-3 md:grid-cols-2">
              {list.filter((g) => g.term[0].toUpperCase() === l).map((g) => {
                const id = 'term-' + slugify(g.term);
                return (
                  <div key={g.term} id={id} className={cn('card avoid-break scroll-mt-48 p-4 transition', flash === id && 'ring-4 ring-indigo-500/40')}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-ink">{g.term}</h3>
                      <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: CAT_COLOR[g.cat] }}>{g.cat}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{g.def}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function CheatColumn({ title, groups, color }: { title: string; groups: CheatGroup[]; color: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl px-4 py-2.5 text-lg font-extrabold text-white" style={{ background: color }}>{title}</div>
      {groups.map((g) => (
        <div key={g.title} className="card avoid-break overflow-hidden">
          <div className="border-b border-line px-4 py-2 text-xs font-extrabold uppercase tracking-wider" style={{ color, background: color + '12' }}>{g.title}</div>
          <table className="w-full text-sm">
            <tbody>
              {g.rows.map(([k, v]) => (
                <tr key={k} className="border-b border-line last:border-0">
                  <td className="w-1/2 px-4 py-1.5 align-top font-mono text-[12px] font-semibold text-ink">{k}</td>
                  <td className="px-4 py-1.5 text-[13px] text-ink-2">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export function CheatSheet() {
  return (
    <div className="animate-fade-up">
      <PageHeader icon={<ListChecks className="h-7 w-7" />} title="Cheat Sheet" gradient="from-emerald-600 via-teal-600 to-cyan-600"
        subtitle="A one-stop quick reference of the most important HTML tags, CSS properties and JavaScript statements. Print it and keep it on your desk!">
        <button className="btn bg-white text-teal-700" onClick={printPage}><Printer className="h-4 w-4" /> Print cheat sheet</button>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-3">
        <CheatColumn title="HTML" groups={htmlCheat} color="#f97316" />
        <CheatColumn title="CSS" groups={cssCheat} color="#ec4899" />
        <CheatColumn title="JavaScript" groups={jsCheat} color="#ca8a04" />
      </div>
    </div>
  );
}
