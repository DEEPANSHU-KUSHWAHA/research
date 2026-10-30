import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CircleCheck, CircleX, Clock, GraduationCap, Play, Printer, RotateCcw, Trophy } from 'lucide-react';
import { PageHeader, ProgressRing } from '../components/ui';
import { chapterById, chapters } from '../data';
import { questions, type Question } from '../data/quiz';
import { palette } from '../lib/palette';
import { printPage, progress, useProgress } from '../lib/store';
import { cn } from '../utils/cn';

type Phase = 'setup' | 'play' | 'result';
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Quiz({ query }: { query: string }) {
  const initial = new URLSearchParams(query).get('ch') ?? 'all';
  const [scope, setScope] = useState(chapterById(initial) ? initial : 'all');
  const [count, setCount] = useState(10);
  const [phase, setPhase] = useState<Phase>('setup');
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [start, setStart] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const prog = useProgress();

  useEffect(() => {
    if (phase !== 'play') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    return () => clearInterval(t);
  }, [phase, start]);

  const begin = () => {
    const pool = scope === 'all' ? questions : questions.filter((q) => q.ch === scope);
    const picked = shuffle(pool).slice(0, scope === 'all' ? count : pool.length).map((q) => {
      const order = shuffle(q.options.map((_, k) => k));
      return { ...q, options: order.map((k) => q.options[k]), answer: order.indexOf(q.answer) };
    });
    setQs(picked); setAnswers(Array(picked.length).fill(null)); setI(0); setStart(Date.now()); setElapsed(0); setPhase('play');
  };

  const score = useMemo(() => answers.filter((a, k) => a === qs[k]?.answer).length, [answers, qs]);
  const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;

  const finish = () => { progress.saveQuiz(scope, Math.round((answers.filter((a, k) => a === qs[k]?.answer).length / qs.length) * 100)); setPhase('result'); };

  if (phase === 'setup') {
    return (
      <div className="animate-fade-up">
        <PageHeader icon={<GraduationCap className="h-7 w-7" />} title="Quiz Arena" gradient="from-amber-500 via-orange-500 to-rose-500"
          subtitle={`${questions.length} multiple-choice questions with instant feedback and explanations. Choose a chapter or take a mixed test.`} />
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ id: 'all', title: 'All chapters (mixed)', sub: 'Random questions from every chapter', color: '#6366f1', num: '★' }, ...chapters.map((c) => ({ id: c.id, title: c.title, sub: `${questions.filter((q) => q.ch === c.id).length} questions`, color: palette[c.color].hex, num: String(c.num) }))].map((o) => {
              const best = prog.quiz[o.id];
              return (
                <button key={o.id} onClick={() => setScope(o.id)}
                  className={cn('card flex items-center gap-3 p-4 text-left transition hover:shadow-md', scope === o.id && 'ring-2 ring-indigo-500')}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white" style={{ background: o.color }}>{o.num}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-ink">{o.title}</span><span className="text-xs text-muted">{o.sub}</span></span>
                  {best !== undefined && <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', best >= 80 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600')}>{best}%</span>}
                </button>
              );
            })}
          </div>
          <div className="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
            <div className="text-sm font-bold text-ink">Quiz settings</div>
            <div className="text-sm text-ink-2">Selected: <b>{scope === 'all' ? 'All chapters' : chapterById(scope)?.title}</b></div>
            {scope === 'all' && (
              <div>
                <div className="label">Number of questions</div>
                <div className="flex gap-1.5">{[10, 20, questions.length].map((n) => <button key={n} onClick={() => setCount(n)} className={cn('btn flex-1 !px-2 !py-1.5 text-xs', count === n ? 'btn-primary' : 'btn-ghost')}>{n === questions.length ? `All ${n}` : n}</button>)}</div>
              </div>
            )}
            <ul className="space-y-1.5 text-xs text-muted">
              <li>✔ Options are shuffled every time</li><li>✔ Instant feedback with explanation</li><li>✔ Your best score is saved</li>
            </ul>
            <button onClick={begin} className="btn btn-primary w-full !py-3 text-base"><Play className="h-5 w-5" /> Start quiz</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    const q = qs[i];
    const chosen = answers[i];
    const ch = chapterById(q.ch);
    return (
      <div className="animate-fade-up mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold text-muted">
          <span>Question {i + 1} of {qs.length}</span>
          <span className="flex items-center gap-3"><span className="flex items-center gap-1"><Clock className="h-4 w-4" />{fmt(elapsed)}</span><span className="flex items-center gap-1 text-emerald-600"><CircleCheck className="h-4 w-4" />{score}</span></span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-linear-to-r from-amber-400 to-rose-500 transition-all duration-500" style={{ width: `${((i + (chosen !== null ? 1 : 0)) / qs.length) * 100}%` }} /></div>
        <div key={i} className="card animate-pop p-6 sm:p-8">
          {ch && <span className="chip mb-3" style={{ color: palette[ch.color].hex, borderColor: palette[ch.color].hex + '66' }}>Chapter {ch.num} · {ch.short}</span>}
          <h2 className="text-xl font-extrabold leading-snug text-ink sm:text-2xl">{q.q}</h2>
          <div className="mt-6 space-y-2.5">
            {q.options.map((o, k) => {
              const isAns = k === q.answer;
              const isChosen = k === chosen;
              const state = chosen === null ? 'idle' : isAns ? 'right' : isChosen ? 'wrong' : 'dim';
              return (
                <button key={k} disabled={chosen !== null} onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? k : x)))}
                  className={cn('flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold transition',
                    state === 'idle' && 'border-line text-ink-2 hover:border-indigo-400 hover:bg-indigo-500/5',
                    state === 'right' && 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                    state === 'wrong' && 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300',
                    state === 'dim' && 'border-line text-muted opacity-60')}>
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', state === 'right' ? 'bg-emerald-500 text-white' : state === 'wrong' ? 'bg-rose-500 text-white' : 'bg-surface-2 text-muted')}>{'ABCD'[k]}</span>
                  <span className="flex-1">{o}</span>
                  {state === 'right' && <CircleCheck className="h-5 w-5" />}{state === 'wrong' && <CircleX className="h-5 w-5" />}
                </button>
              );
            })}
          </div>
          {chosen !== null && (
            <div className={cn('animate-fade-up mt-5 rounded-2xl p-4 text-sm', chosen === q.answer ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'bg-rose-500/10 text-rose-800 dark:text-rose-200')}>
              <b>{chosen === q.answer ? '🎉 Correct!' : '❌ Not quite.'}</b> {q.explain}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button className="btn btn-ghost" onClick={() => setPhase('setup')}>Quit</button>
            <button className="btn btn-primary" disabled={chosen === null} onClick={() => (i < qs.length - 1 ? setI(i + 1) : finish())}>
              {i < qs.length - 1 ? 'Next question' : 'See results'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const msg = pct >= 90 ? ['Outstanding! 🏆', 'You are a web design pro.'] : pct >= 70 ? ['Great job! 🎉', 'You have a strong understanding.'] : pct >= 50 ? ['Good effort 👍', 'Revise the chapters and try again.'] : ['Keep learning 📚', 'Read the chapters again and retry — you can do it!'];
  return (
    <div className="animate-fade-up mx-auto max-w-3xl">
      <div className="card overflow-hidden">
        <div className="bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-center text-white print:bg-none print:text-ink">
          <Trophy className="mx-auto h-10 w-10 text-amber-300 print:hidden" />
          <h1 className="mt-2 text-3xl font-extrabold">{msg[0]}</h1>
          <p className="text-white/85 print:text-muted">{msg[1]}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 p-6">
          <ProgressRing value={pct / 100} size={140} stroke={12} color={pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e'}>
            <span className="text-3xl font-extrabold text-ink">{pct}%</span><span className="text-xs font-semibold text-muted">score</span>
          </ProgressRing>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['Correct', score, 'text-emerald-600'], ['Wrong', qs.length - score, 'text-rose-600'], ['Time', fmt(elapsed), 'text-sky-600']].map(([l, v, c]) => (
              <div key={l as string} className="rounded-2xl bg-surface-2 px-4 py-3"><div className={cn('text-2xl font-extrabold', c as string)}>{v}</div><div className="text-[11px] font-semibold uppercase text-muted">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="no-print flex flex-wrap justify-center gap-2 border-t border-line p-4">
          <button className="btn btn-primary" onClick={begin}><RotateCcw className="h-4 w-4" /> Try again</button>
          <button className="btn btn-ghost" onClick={() => setPhase('setup')}>Choose another quiz</button>
          <button className="btn btn-ghost" onClick={printPage}><Printer className="h-4 w-4" /> Print result</button>
        </div>
      </div>
      <h2 className="mb-3 mt-8 text-lg font-extrabold text-ink">Review your answers</h2>
      <div className="space-y-3">
        {qs.map((q, k) => {
          const ok = answers[k] === q.answer;
          return (
            <div key={k} className="card avoid-break p-4">
              <div className="flex gap-3">
                {ok ? <CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" /> : <CircleX className="h-5 w-5 shrink-0 text-rose-500" />}
                <div className="text-sm">
                  <div className="font-bold text-ink">{k + 1}. {q.q}</div>
                  {!ok && <div className="mt-1 text-rose-600 dark:text-rose-400">Your answer: {answers[k] !== null ? q.options[answers[k]!] : '—'}</div>}
                  <div className="mt-1 text-emerald-700 dark:text-emerald-400">Correct answer: {q.options[q.answer]}</div>
                  <div className="mt-1 text-muted">{q.explain}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
