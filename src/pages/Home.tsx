import { ArrowRight, BookOpen, CircleCheck, Clock, CodeXml, FlaskConical, GraduationCap, MousePointerClick, Printer, Rocket, Sparkles, Trophy } from 'lucide-react';
import { chapters, totalMinutes, units } from '../data';
import { practicals } from '../data/practicals';
import { questions } from '../data/quiz';
import { palette } from '../lib/palette';
import { useProgress } from '../lib/store';
import { Icon } from '../components/Icon';
import { ProgressRing } from '../components/ui';
import { SIMS } from '../simulations/registry';
import { cn } from "/utils/cn";

const tryCount = chapters.reduce((n, c) => n + c.blocks.filter((b) => b.type === 'tryit').length, 0);

const FLOW = [
  { icon: BookOpen, title: 'Read', text: 'Fully explained lessons with diagrams, tables and examples.', color: '#0ea5e9' },
  { icon: CodeXml, title: 'Try', text: `${tryCount} live editors — change code and see results instantly.`, color: '#10b981' },
  { icon: MousePointerClick, title: 'Simulate', text: `${SIMS.length} interactive labs that make concepts visible.`, color: '#8b5cf6' },
  { icon: GraduationCap, title: 'Test', text: `${questions.length} quiz questions with instant explanations.`, color: '#f59e0b' },
  { icon: Printer, title: 'Print', text: 'Build your own study guide and save it as a PDF.', color: '#ec4899' },
];

const TRIO = [
  { lang: 'HTML', role: 'Structure', analogy: 'The skeleton & walls of a house', code: '<h1>Hello!</h1>\n<button>Click</button>', grad: 'from-orange-500 to-amber-500' },
  { lang: 'CSS', role: 'Style', analogy: 'The paint, furniture & decoration', code: 'h1 { color: purple; }\nbutton { border-radius: 8px; }', grad: 'from-pink-500 to-fuchsia-600' },
  { lang: 'JavaScript', role: 'Behaviour', analogy: 'The electricity that makes it work', code: 'button.onclick = () =>\n  alert("Hello, world!");', grad: 'from-yellow-400 to-amber-500' },
];

export default function Home() {
  const prog = useProgress();
  const next = chapters.find((c) => !prog.done.includes(c.id)) ?? chapters[0];
  const pct = prog.done.length / chapters.length;
  const bestQuiz = Math.max(0, ...Object.values(prog.quiz));

  return (
    <div className="animate-fade-up space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-700 via-violet-700 to-fuchsia-600 text-white shadow-2xl shadow-indigo-500/25">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur"><Sparkles className="h-4 w-4" /> Free · Interactive · For everyone</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
              Learn Web Design<br />by <span className="bg-linear-to-r from-amber-200 via-pink-200 to-sky-200 bg-clip-text text-transparent">doing it.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              A free, hands-on course on <b>HTML</b>, <b>CSS</b>, <b>JavaScript</b> and <b>UI/UX</b> — with clearly explained lessons, live code editors, interactive simulations, quizzes, real projects and a printable PDF guide. No experience needed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`#/chapter/${next.id}`} className="btn bg-white !px-5 !py-2.5 text-indigo-700 shadow-xl hover:bg-indigo-50"><Rocket className="h-4 w-4" /> {prog.done.length ? `Continue: Ch. ${next.num}` : 'Start learning'}</a>
              <a href="#/lab" className="btn bg-white/15 !py-2.5 text-white backdrop-blur hover:bg-white/25"><FlaskConical className="h-4 w-4" /> Simulation Lab</a>
              <a href="#/guide" className="btn bg-white/15 !py-2.5 text-white backdrop-blur hover:bg-white/25"><Printer className="h-4 w-4" /> PDF Guide</a>
            </div>
            <div className="mt-9 grid max-w-lg grid-cols-4 gap-2">
              {[[chapters.length, 'Chapters'], [SIMS.length, 'Simulations'], [tryCount, 'Live editors'], [practicals.length, 'Projects']].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                  <div className="text-2xl font-extrabold">{v}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-white/75">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="images/hero.jpg" alt="A person designing a website on a laptop" className="animate-float aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/25" />
            <div className="absolute -left-3 top-6 hidden rounded-xl bg-slate-900/90 px-3 py-2 font-mono text-xs shadow-xl sm:block">
              <span className="text-slate-400">&lt;</span><span className="text-emerald-300">h1</span><span className="text-slate-400">&gt;</span>Hello Web!<span className="text-slate-400">&lt;/</span><span className="text-emerald-300">h1</span><span className="text-slate-400">&gt;</span>
            </div>
            <div className="absolute -bottom-3 right-4 hidden rounded-xl bg-white px-3 py-2 font-mono text-xs text-slate-800 shadow-xl sm:block">
              <span className="text-sky-600">color</span>: <span className="text-orange-600">#7c3aed</span>;
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESS + FLOW */}
      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card flex items-center gap-5 p-6">
          <ProgressRing value={pct} size={110} color="#7c3aed">
            <span className="text-2xl font-extrabold text-ink">{Math.round(pct * 100)}%</span>
            <span className="text-[10px] font-semibold uppercase text-muted">complete</span>
          </ProgressRing>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-ink-2"><CircleCheck className="h-4 w-4 text-emerald-500" /> {prog.done.length} of {chapters.length} chapters</div>
            <div className="flex items-center gap-2 text-ink-2"><FlaskConical className="h-4 w-4 text-violet-500" /> {prog.sims.length} of {SIMS.length} simulations</div>
            <div className="flex items-center gap-2 text-ink-2"><Trophy className="h-4 w-4 text-amber-500" /> Best quiz: {bestQuiz ? `${bestQuiz}%` : '—'}</div>
            <div className="flex items-center gap-2 text-ink-2"><Clock className="h-4 w-4 text-sky-500" /> ~{Math.round(totalMinutes / 60)} hours of learning</div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink"><Sparkles className="h-5 w-5 text-fuchsia-500" /> How WebCraft works</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {FLOW.map((f, i) => (
              <div key={f.title} className="relative rounded-2xl bg-surface-2/70 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ background: f.color }}><f.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-sm font-extrabold text-ink">{i + 1}. {f.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted">{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRIO */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Three languages, one website</h2>
          <p className="mt-2 text-muted">Every web page you have ever visited is built with these three technologies working together.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TRIO.map((t) => (
            <div key={t.lang} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
              <div className={cn('bg-linear-to-br p-5 text-white', t.grad)}>
                <div className="text-xs font-bold uppercase tracking-widest text-white/80">{t.role}</div>
                <div className="text-2xl font-extrabold">{t.lang}</div>
                <div className="mt-1 text-sm text-white/90">{t.analogy}</div>
              </div>
              <pre className="code-surface m-0 p-4 font-mono text-[12.5px] leading-relaxed text-slate-200">{t.code}</pre>
            </div>
          ))}
        </div>
      </section>

      {/* COURSE MAP */}
      <section id="course">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Course map</h2>
            <p className="mt-1 text-muted">12 chapters in 3 units — from "what is the Internet?" to building interactive, beautiful websites.</p>
          </div>
        </div>
        <div className="space-y-10">
          {units.map((u) => (
            <div key={u.num}>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-xl bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-surface">Unit {u.num}</span>
                <div><div className="font-extrabold text-ink">{u.title}</div><div className="text-xs text-muted">{u.desc}</div></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {chapters.filter((c) => c.unit === u.num).map((c) => {
                  const p = palette[c.color];
                  const done = prog.done.includes(c.id);
                  const sims = c.blocks.filter((b) => b.type === 'sim').length;
                  return (
                    <a key={c.id} href={`#/chapter/${c.id}`} className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-36 overflow-hidden">
                        <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        <div className={cn('absolute inset-0 bg-linear-to-t opacity-80', p.grad)} />
                        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-sm font-extrabold shadow" style={{ color: p.hex }}>{c.num}</div>
                        {done && <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-emerald-600 shadow"><CircleCheck className="h-3.5 w-3.5" /> Done</div>}
                        <Icon name={c.icon} className="absolute bottom-3 right-4 h-9 w-9 text-white/90" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold leading-snug text-ink">{c.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{c.tagline}</p>
                        <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-muted">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.minutes} min</span>
                          {sims > 0 && <span className="flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" />{sims} sim{sims > 1 ? 's' : ''}</span>}
                          <span className="ml-auto flex items-center gap-1 font-bold transition group-hover:gap-2" style={{ color: p.hex }}>Open <ArrowRight className="h-3.5 w-3.5" /></span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMULATIONS */}
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Hands-on simulations</h2>
            <p className="mt-1 text-muted">Don't just read about it — see it, drag it, break it and fix it.</p>
          </div>
          <a href="#/lab" className="btn btn-ghost">All {SIMS.length} simulations <ArrowRight className="h-4 w-4" /></a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIMS.slice(0, 6).map((s) => (
            <a key={s.id} href={`#/lab/${s.id}`} className="card group flex gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md', palette[s.color].grad)}><Icon name={s.icon} className="h-6 w-6" /></span>
              <div>
                <div className="font-bold text-ink">{s.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* REPORT CTA */}
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="chip border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-300"><Printer className="h-3.5 w-3.5" /> Printable · PDF ready</span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Your own printable study guide</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Choose the chapters you want and WebCraft turns them into a beautifully formatted handbook — cover page, contents, explained chapters, hands-on projects with outputs, glossary, resources and even a certificate of completion with your name. Then simply <b className="text-ink">Save as PDF</b> to read offline or print.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#/guide" className="btn btn-primary !px-6 !py-3 text-base"><Printer className="h-5 w-5" /> Create my PDF</a>
            <a href="#/projects" className="btn btn-ghost">Browse projects</a>
          </div>
        </div>
      </section>
    </div>
  );
}
