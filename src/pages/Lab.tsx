import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, FlaskConical } from 'lucide-react';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/ui';
import { chapterById } from '../data';
import { palette } from '../lib/palette';
import { progress, useProgress } from '../lib/store';
import { SIMS, simById } from '../simulations/registry';
import { cn } from "/utils/cn";

export default function Lab({ simId }: { simId?: string }) {
  const prog = useProgress();
  useEffect(() => { if (simId && simById(simId)) progress.markSim(simId); }, [simId]);

  if (simId) {
    const s = simById(simId);
    if (!s) return <div className="card p-10 text-center"><h1 className="text-2xl font-bold">Simulation not found</h1><a href="#/lab" className="btn btn-primary mt-4">Back to the Lab</a></div>;
    const i = SIMS.indexOf(s);
    const prev = SIMS[i - 1];
    const next = SIMS[i + 1];
    const ch = chapterById(s.chapter);
    const C = s.Component;
    return (
      <div className="animate-fade-up">
        <a href="#/lab" className="no-print mb-4 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> All simulations</a>
        <PageHeader icon={<Icon name={s.icon} className="h-7 w-7" />} title={s.title} subtitle={s.desc} gradient={palette[s.color].grad}>
          {ch && <a href={`#/chapter/${ch.id}`} className="btn bg-white/15 text-white backdrop-blur hover:bg-white/25"><BookOpen className="h-4 w-4" /> Chapter {ch.num}: {ch.short}</a>}
        </PageHeader>
        <div className="card p-4 sm:p-6"><C /></div>
        <nav className="mt-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <a href={`#/lab/${prev.id}`} className="card group p-5 transition hover:shadow-lg">
              <div className="flex items-center gap-1 text-xs font-bold text-muted"><ArrowLeft className="h-3.5 w-3.5" /> Previous simulation</div>
              <div className="mt-1 font-bold text-ink">{prev.title}</div>
            </a>
          ) : <span />}
          {next && (
            <a href={`#/lab/${next.id}`} className="card group p-5 text-right transition hover:shadow-lg">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-muted">Next simulation <ArrowRight className="h-3.5 w-3.5" /></div>
              <div className="mt-1 font-bold text-ink">{next.title}</div>
            </a>
          )}
        </nav>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader icon={<FlaskConical className="h-7 w-7" />} title="Simulation Lab" subtitle={`${SIMS.length} interactive simulations that turn abstract web concepts into things you can see, touch and experiment with.`} />
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 transition-all" style={{ width: `${(prog.sims.length / SIMS.length) * 100}%` }} /></div>
        <span className="text-sm font-bold text-ink">{prog.sims.length}/{SIMS.length} explored</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SIMS.map((s, i) => {
          const tried = prog.sims.includes(s.id);
          const ch = chapterById(s.chapter);
          return (
            <a key={s.id} href={`#/lab/${s.id}`} className="card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={cn('absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br opacity-15 transition group-hover:scale-125 group-hover:opacity-25', palette[s.color].grad)} />
              <div className="relative flex items-start justify-between">
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg', palette[s.color].grad)}><Icon name={s.icon} className="h-6 w-6" /></span>
                {tried ? <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600"><CircleCheck className="h-3.5 w-3.5" /> Explored</span>
                  : <span className="rounded-full bg-surface-2 px-2 py-1 text-[11px] font-bold text-muted">#{i + 1}</span>}
              </div>
              <h3 className="relative mt-4 text-lg font-extrabold text-ink">{s.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
              <div className="relative mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted">{ch ? `Chapter ${ch.num} · ${ch.short}` : ''}</span>
                <span className="flex items-center gap-1 font-bold transition group-hover:gap-2" style={{ color: palette[s.color].hex }}>Launch <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
