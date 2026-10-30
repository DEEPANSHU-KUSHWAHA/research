import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, Clock, FlaskConical, GraduationCap, House, Lightbulb, ListChecks, Printer, Target } from 'lucide-react';
import { AccentCtx, Blocks } from '../components/Blocks';
import { Icon } from '../components/Icon';
import { Inline } from '../components/ui';
import { chapterById, chapterSections, chapters } from '../data';
import { palette } from '../lib/palette';
import { printPage, progress, scrollToId, slugify, takePendingScroll, toast, useProgress } from '../lib/store';
import { cn } from "/utils/cn";

export default function ChapterPage({ id }: { id: string }) {
  const ch = chapterById(id);
  const prog = useProgress();
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [activeSec, setActiveSec] = useState('');
  const sections = ch ? chapterSections(ch) : [];

  useEffect(() => {
    const t = takePendingScroll();
    if (t) setTimeout(() => scrollToId(t), 150);
  }, [id]);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(slugify(s))).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSec(e.target.id); });
    }, { rootMargin: '-90px 0px -70% 0px' });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!ch) {
    return <div className="card p-10 text-center"><h1 className="text-2xl font-bold">Chapter not found</h1><a href="#/" className="btn btn-primary mt-4">Go home</a></div>;
  }

  const pal = palette[ch.color];
  const idx = chapters.indexOf(ch);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const done = prog.done.includes(ch.id);
  const simCount = ch.blocks.filter((b) => b.type === 'sim').length;
  const tryCount = ch.blocks.filter((b) => b.type === 'tryit').length;
  const toggleDone = () => {
    const now = progress.toggleDone(ch.id);
    toast(now ? `Chapter ${ch.num} marked as complete 🎉` : 'Marked as not complete', now ? 'success' : 'info');
  };

  return (
    <AccentCtx.Provider value={pal.hex}>
      <article className="animate-fade-up">
        <nav className="no-print mb-4 flex items-center gap-1.5 text-xs font-semibold text-muted">
          <a href="#/" className="flex items-center gap-1 hover:text-ink"><House className="h-3.5 w-3.5" /> Home</a><span>/</span>
          <span>Unit {ch.unit}</span><span>/</span><span className="text-ink">Chapter {ch.num}</span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl text-white shadow-xl print:rounded-none print:border-b-2 print:border-line print:text-ink print:shadow-none">
          <img src={ch.image} alt="" className="absolute inset-0 h-full w-full object-cover print:hidden" />
          <div className={cn('absolute inset-0 bg-linear-to-r opacity-[.88] print:hidden', pal.grad)} />
          <div className="absolute inset-0 bg-linear-to-tr from-black/55 via-black/20 to-black/5 print:hidden" />
          <div className="relative p-6 [text-shadow:0_2px_14px_rgba(0,0,0,.35)] sm:p-10 print:px-0 print:py-4 print:[text-shadow:none]">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur print:bg-transparent print:px-0">Chapter {ch.num} · Unit {ch.unit}</span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur print:hidden"><Clock className="h-3.5 w-3.5" /> {ch.minutes} min</span>
              {done && <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-emerald-600 print:hidden"><CircleCheck className="h-3.5 w-3.5" /> Completed</span>}
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{ch.title}</h1>
            <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg print:text-muted">{ch.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2 print:hidden">
              <span className="chip border-white/30 bg-white/15 text-white"><BookOpen className="h-3.5 w-3.5" /> {sections.length} sections</span>
              {tryCount > 0 && <span className="chip border-white/30 bg-white/15 text-white"><Lightbulb className="h-3.5 w-3.5" /> {tryCount} live editors</span>}
              {simCount > 0 && <span className="chip border-white/30 bg-white/15 text-white"><FlaskConical className="h-3.5 w-3.5" /> {simCount} simulations</span>}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 print:hidden">
              <button onClick={toggleDone} className={cn('btn', done ? 'bg-white text-emerald-600' : 'bg-white/15 text-white backdrop-blur hover:bg-white/25')}>
                <CircleCheck className="h-4 w-4" /> {done ? 'Completed' : 'Mark as complete'}
              </button>
              <button onClick={printPage} className="btn bg-white/15 text-white backdrop-blur hover:bg-white/25"><Printer className="h-4 w-4" /> Print / PDF</button>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_230px]">
          <div className="min-w-0">
            <section className="card avoid-break mb-10 p-5 sm:p-6" style={{ borderTop: `4px solid ${pal.hex}` }}>
              <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider" style={{ color: pal.hex }}><Target className="h-4 w-4" /> Learning objectives</h2>
              <p className="mt-1 text-sm text-muted">After this chapter you will be able to:</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {ch.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: pal.hex }} /><span><Inline text={o} /></span></li>
                ))}
              </ul>
            </section>

            <Blocks blocks={ch.blocks} />

            <section className="avoid-break mt-14 rounded-3xl border-2 p-6 sm:p-7" style={{ borderColor: pal.hex + '55', background: pal.hex + '0d' }}>
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink"><ListChecks className="h-6 w-6" style={{ color: pal.hex }} /> Chapter summary</h2>
              <ul className="mt-4 space-y-2.5">
                {ch.summary.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: pal.hex }}>{i + 1}</span>
                    <span><Inline text={s} /></span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink"><GraduationCap className="h-6 w-6" style={{ color: pal.hex }} /> Practice questions</h2>
                <button onClick={() => setShowAll((s) => !s)} className="btn btn-ghost no-print !py-1.5 text-xs">{showAll ? 'Hide all answers' : 'Show all answers'}</button>
              </div>
              <div className="space-y-3">
                {ch.exercises.map((e, i) => {
                  const shown = showAll || open[i];
                  return (
                    <div key={i} className="card avoid-break p-4 sm:p-5">
                      <div className="flex gap-3">
                        <span className="font-extrabold" style={{ color: pal.hex }}>Q{i + 1}.</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-ink">{e.q}</div>
                          <button className="no-print mt-2 text-xs font-bold hover:underline" style={{ color: pal.hex }} onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
                            {shown ? 'Hide answer ▲' : 'Show answer ▼'}
                          </button>
                          <div className={cn('animate-fade-up mt-2 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-ink-2', !shown && 'hidden print:block')}>
                            <b className="text-ink">Answer: </b>{e.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="no-print mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white">
              <div>
                <div className="text-lg font-extrabold">Ready to test yourself?</div>
                <div className="text-sm text-white/80">Take the Chapter {ch.num} quiz and get instant feedback.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`#/quiz?ch=${ch.id}`} className="btn bg-white text-indigo-700"><GraduationCap className="h-4 w-4" /> Take the quiz</a>
                <button onClick={toggleDone} className="btn bg-white/15 text-white hover:bg-white/25"><CircleCheck className="h-4 w-4" /> {done ? 'Completed ✓' : 'Mark complete'}</button>
              </div>
            </section>

            <nav className="no-print mt-8 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <a href={`#/chapter/${prev.id}`} className="card group p-5 transition hover:shadow-lg">
                  <div className="flex items-center gap-1 text-xs font-bold text-muted"><ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" /> Previous</div>
                  <div className="mt-1 font-bold text-ink">{prev.num}. {prev.title}</div>
                </a>
              ) : <span />}
              {next && (
                <a href={`#/chapter/${next.id}`} className="card group p-5 text-right transition hover:shadow-lg">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-muted">Next <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></div>
                  <div className="mt-1 font-bold text-ink">{next.num}. {next.title}</div>
                </a>
              )}
            </nav>
          </div>

          <aside className="no-print hidden xl:block">
            <div className="sticky top-24 space-y-4">
              <div className="card p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-muted"><Icon name={ch.icon} className="h-3.5 w-3.5" /> On this page</div>
                <ul className="space-y-0.5">
                  {sections.map((s) => {
                    const sid = slugify(s);
                    const active = activeSec === sid;
                    return (
                      <li key={sid}>
                        <button onClick={() => scrollToId(sid)} className={cn('w-full rounded-lg border-l-2 px-2.5 py-1.5 text-left text-xs font-medium transition', active ? 'bg-surface-2 font-bold text-ink' : 'border-transparent text-muted hover:text-ink')}
                          style={{ borderColor: active ? pal.hex : 'transparent' }}>{s}</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button onClick={toggleDone} className={cn('btn w-full', done ? 'bg-emerald-500/10 text-emerald-600' : 'btn-primary')}><CircleCheck className="h-4 w-4" /> {done ? 'Completed' : 'Mark complete'}</button>
            </div>
          </aside>
        </div>
      </article>
    </AccentCtx.Provider>
  );
}
