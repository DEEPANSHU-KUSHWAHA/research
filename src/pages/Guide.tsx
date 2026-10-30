import { memo, useMemo, type ReactNode } from 'react';
import { Award, CircleCheck, FileDown, Printer, RotateCcw, Settings, User } from 'lucide-react';
import { AccentCtx, Blocks } from '../components/Blocks';
import { CodeBlock } from '../components/Code';
import { Inline, PageHeader } from '../components/ui';
import { chapters } from '../data';
import { practicals, type Practical } from '../data/practicals';
import { glossary } from '../data/reference';
import type { Chapter } from '../data/types';
import { palette } from '../lib/palette';
import { buildDoc, printPage, useLocalStorage, useProgress } from '../lib/store';
import { SIMS } from '../simulations/registry';
import { cn } from '../utils/cn';

interface Info { name: string; title: string; }
interface Opts {
  cover: boolean; certificate: boolean; contents: boolean; about: boolean; setup: boolean; projects: boolean;
  glossary: boolean; next: boolean; resources: boolean; notes: boolean; answers: boolean; chapters: string[];
}
type SectionKey = Exclude<keyof Opts, 'chapters' | 'answers'>;

const DEFAULT_INFO: Info = { name: '', title: 'The Web Design Handbook: HTML, CSS, JavaScript & UI/UX' };
const DEFAULT_OPTS: Opts = {
  cover: true, certificate: true, contents: true, about: true, setup: true, projects: true,
  glossary: true, next: true, resources: true, notes: false, answers: true, chapters: chapters.map((c) => c.id),
};
const SECTIONS: [SectionKey, string][] = [
  ['cover', 'Cover page'], ['certificate', 'Certificate'], ['contents', 'Contents'], ['about', 'About this guide'],
  ['setup', 'Getting started'], ['projects', 'Hands-on projects'], ['glossary', 'Glossary'], ['next', 'Next steps'],
  ['resources', 'Resources'], ['notes', 'Notes page'],
];

const SKELETON = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Website</title>
</head>
<body>
  <h1>Hello, World! 👋</h1>
  <p>This is my very first web page.</p>
</body>
</html>`;

const LEARN = [
  'How the Internet and the World Wide Web deliver pages to your screen.',
  'How to structure content with HTML5 — text, lists, links, images, tables and forms.',
  'How to style pages with CSS — colours, typography, the box model, Flexbox and Grid.',
  'How to make websites responsive so they work on phones, tablets and computers.',
  'How to add interactivity with JavaScript events and DOM manipulation.',
  'How to apply UI/UX, usability and accessibility principles to design better websites.',
];
const HOW_TO: [string, string][] = [
  ['Read', 'Work through one chapter at a time. Each starts with clear learning goals and ends with a summary.'],
  ['Type it yourself', "Don't just copy and paste — typing the code out is the fastest way to remember it."],
  ['Experiment', 'Change values, break things and fix them again. Mistakes are the best teachers.'],
  ['Build & review', 'Complete the hands-on projects, then answer the practice questions to check your understanding.'],
];
const NEEDS: [string, string][] = [
  ['A computer', 'Any laptop or desktop running Windows, macOS, Linux or ChromeOS. A tablet is fine for reading and quick experiments.'],
  ['A web browser', 'Google Chrome, Mozilla Firefox, Microsoft Edge or Safari — kept up to date. Press F12 to open the developer tools.'],
  ['A code editor', 'Visual Studio Code is free and the most popular choice. Any plain-text editor such as Notepad or TextEdit also works.'],
  ['An Internet connection', 'Only needed for web fonts, online images and publishing — you can write and test code offline.'],
  ['Design tools (optional)', 'Figma, Penpot or Canva for sketching wireframes and mockups before you start coding.'],
  ['Free hosting (optional)', 'GitHub Pages, Netlify or Cloudflare Pages to publish your website online at no cost.'],
];
const SETUP_STEPS = [
  'Create a new folder on your computer called `my-website`.',
  'Open your code editor and create a file inside that folder named `index.html`.',
  'Type the code below and save the file (Ctrl + S on Windows/Linux, ⌘ + S on Mac).',
  'Double-click `index.html` — it opens in your web browser. 🎉',
  'Change some text, save again and refresh the browser (F5) to see your update.',
];
const ROADMAP: [string, string][] = [
  ['Build your portfolio', 'Create a personal website that showcases your projects. It is the best way to practise — and to show others what you can do.'],
  ['Learn Git & GitHub', 'Track changes to your code, collaborate with others and publish websites for free with GitHub Pages.'],
  ['Level up your CSS', 'Explore custom properties (variables), transitions, animations and advanced Flexbox and Grid layouts.'],
  ['Go deeper with JavaScript', 'Master arrays and objects, fetch live data from APIs and save information with localStorage.'],
  ['Try a framework', 'Once you feel confident, explore React, Vue or Svelte to build larger, app-like websites.'],
  ['Make it fast & accessible', 'Audit your pages with Lighthouse, optimise images and follow WCAG so everyone can use your sites.'],
  ['Explore the back-end', 'Learn how servers and databases work with Node.js, Python or PHP to build fully dynamic websites.'],
];
const IDEAS: [string, string, string][] = [
  ['📝', 'Personal blog', 'Articles, images and a comment form'],
  ['🍲', 'Recipe website', 'Lists, tables and a responsive grid'],
  ['🌦️', 'Weather app', 'Fetch live data from a free API'],
  ['✅', 'To-do list', 'JavaScript + localStorage'],
  ['🚀', 'Product landing page', 'Hero, features, pricing and FAQ'],
  ['🎮', 'Quiz game', 'Events, scores and a timer'],
];
const RESOURCES: { title: string; items: [string, string][] }[] = [
  { title: 'Learn online (free)', items: [
    ['MDN Web Docs', 'the most trusted reference for HTML, CSS and JavaScript — developer.mozilla.org'],
    ['web.dev Learn', 'free courses on HTML, CSS, design and accessibility — web.dev/learn'],
    ['freeCodeCamp', 'a free interactive curriculum in responsive web design and JavaScript — freecodecamp.org'],
    ['W3Schools', 'simple tutorials and references with "Try it" examples — w3schools.com'],
    ['Can I use', 'check which browsers support a feature — caniuse.com'],
  ] },
  { title: 'Standards & guidelines', items: [
    ['W3C', 'the World Wide Web Consortium, which develops web standards — w3.org'],
    ['WHATWG HTML Living Standard', 'the official HTML specification — html.spec.whatwg.org'],
    ['WCAG 2.2', 'Web Content Accessibility Guidelines — w3.org/TR/WCAG22'],
    ['Nielsen Norman Group', '10 Usability Heuristics for User Interface Design — nngroup.com'],
  ] },
  { title: 'Recommended books', items: [
    ['HTML and CSS: Design and Build Websites', 'Jon Duckett (Wiley)'],
    ['Eloquent JavaScript', 'Marijn Haverbeke — free to read online at eloquentjavascript.net'],
    ["Don't Make Me Think", 'Steve Krug (New Riders)'],
    ["The Non-Designer's Design Book", 'Robin Williams (Peachpit Press)'],
  ] },
];

function Sheet({ children, fixed, className }: { children: ReactNode; fixed?: boolean; className?: string }) {
  return <section className={cn('print-sheet', fixed && 'fixed-page', className)}>{children}</section>;
}
function SheetTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-6 border-b-2 border-indigo-900 pb-3">
      <h2 className="font-serif text-3xl font-bold text-indigo-950">{children}</h2>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}
const S = ({ children }: { children: ReactNode }) => <b className="text-slate-900">{children}</b>;
const H3 = ({ children }: { children: ReactNode }) => <h3 className="mb-3 mt-8 font-serif text-xl font-bold text-indigo-950">{children}</h3>;
const Logo = ({ light }: { light?: boolean }) => (
  <span className="flex items-center gap-2">
    <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold', light ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white')}>&lt;/&gt;</span>
    <span className={cn('text-lg font-extrabold tracking-tight', light ? 'text-white' : 'text-indigo-700')}>WebCraft</span>
  </span>
);

/** Memoised so typing in the form doesn't re-render every chapter. */
const ChapterSheet = memo(function ChapterSheet({ c, answers }: { c: Chapter; answers: boolean }) {
  const hex = palette[c.color].hex;
  return (
    <Sheet>
      <AccentCtx.Provider value={hex}>
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
          <img src={c.image} alt="" className="h-36 w-full object-cover" />
          <div className="p-5" style={{ background: hex + '14' }}>
            <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: hex }}>Chapter {c.num} · Unit {c.unit}</div>
            <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.tagline}</p>
          </div>
        </div>
        <div className="avoid-break mb-6 rounded-xl border border-slate-200 p-4">
          <div className="mb-2 text-xs font-extrabold uppercase tracking-wider" style={{ color: hex }}>Learning objectives</div>
          <ul className="grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">{c.objectives.map((o) => <li key={o} className="flex gap-2"><span style={{ color: hex }}>✔</span><span><Inline text={o} /></span></li>)}</ul>
        </div>
        <Blocks blocks={c.blocks} print />
        <div className="avoid-break mt-8 rounded-xl border-2 p-5" style={{ borderColor: hex + '66', background: hex + '0d' }}>
          <div className="mb-2 font-serif text-lg font-bold text-slate-900">Summary</div>
          <ul className="space-y-1.5 text-sm text-slate-700">{c.summary.map((s) => <li key={s} className="flex gap-2"><span style={{ color: hex }}>•</span><span><Inline text={s} /></span></li>)}</ul>
        </div>
        <div className="mt-8">
          <div className="mb-3 font-serif text-lg font-bold text-slate-900">Practice questions</div>
          <ol className="space-y-3 text-sm text-slate-700">
            {c.exercises.map((e, i) => (
              <li key={i} className="avoid-break">
                <div className="font-semibold text-slate-900">Q{i + 1}. {e.q}</div>
                {answers ? <div className="mt-1 rounded-lg bg-slate-50 p-2.5"><b>Ans.</b> {e.a}</div> : <div className="mt-2 space-y-4">{[0, 1].map((k) => <div key={k} className="border-b border-dotted border-slate-400" />)}</div>}
              </li>
            ))}
          </ol>
        </div>
      </AccentCtx.Provider>
    </Sheet>
  );
});

const ProjectSheet = memo(function ProjectSheet({ p, n }: { p: Practical; n: number }) {
  const doc = useMemo(() => buildDoc(p.html), [p.html]);
  return (
    <Sheet>
      {n === 1 && <SheetTitle sub="Each project lists its goal, the complete source code and the output it produces in the browser.">Hands-on Projects</SheetTitle>}
      <div className="text-xs font-extrabold uppercase tracking-widest text-violet-600">Project {n}</div>
      <h3 className="font-serif text-2xl font-bold text-slate-900">{p.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-700"><S>Goal:</S> {p.aim}</p>
      <p className="mt-1 text-sm text-slate-700"><S>Concepts used:</S> {p.concepts.join(', ')}</p>
      <div className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Source code</div>
      <CodeBlock code={p.html} lang="html" title={`project-${n}.html`} light compact className="!mt-1" />
      <div className="avoid-break">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Output</div>
        <iframe title={p.title} srcDoc={doc} sandbox="allow-scripts" className="mt-1 block w-full rounded-lg border border-slate-300 bg-white" style={{ height: Math.min(p.height ?? 360, 420) }} />
      </div>
    </Sheet>
  );
});

export default function Guide() {
  const [storedInfo, setInfo] = useLocalStorage<Info>('wc-guide-info', DEFAULT_INFO);
  const [storedOpts, setOpts] = useLocalStorage<Opts>('wc-guide-opts', DEFAULT_OPTS);
  const info = { ...DEFAULT_INFO, ...storedInfo };
  const opts = { ...DEFAULT_OPTS, ...storedOpts };
  const prog = useProgress();
  const date = useMemo(() => new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }), []);
  const best = Math.max(0, ...Object.values(prog.quiz));
  const hasProgress = prog.done.length > 0 || prog.sims.length > 0 || best > 0;
  const name = info.name.trim();

  const setField = (k: keyof Info, v: string) => setInfo({ ...info, [k]: v });
  const toggle = (k: SectionKey | 'answers') => setOpts({ ...opts, [k]: !opts[k] });
  const toggleChapter = (id: string) => setOpts({ ...opts, chapters: opts.chapters.includes(id) ? opts.chapters.filter((c) => c !== id) : [...opts.chapters, id] });

  const [mainTitle, subTitle] = useMemo(() => { const i = info.title.indexOf(':'); return i > 0 ? [info.title.slice(0, i), info.title.slice(i + 1).trim()] : [info.title, '']; }, [info.title]);
  const selected = chapters.filter((c) => opts.chapters.includes(c.id));
  const chapterPhrase = selected.length === chapters.length ? `all ${chapters.length} chapters` : `${selected.length} chapter${selected.length === 1 ? '' : 's'}`;
  const nameLine = (w = 'w-52') => (name ? <S>{name}</S> : <span className={cn('inline-block border-b border-dotted border-slate-500 align-bottom', w)}>&nbsp;</span>);
  const stats: [string, string][] = [['Chapters completed', `${prog.done.length}/${chapters.length}`], ['Simulations explored', `${prog.sims.length}/${SIMS.length}`], ['Best quiz score', best ? `${best}%` : '—']];
  const empty = !SECTIONS.some(([k]) => opts[k]) && selected.length === 0;

  const contents: { title: string; sub?: string }[] = [
    ...(opts.about ? [{ title: 'About this guide', sub: 'What you will learn and how to use this guide' }] : []),
    ...(opts.setup ? [{ title: 'Getting started', sub: 'The tools you need and your first page in 5 minutes' }] : []),
    ...selected.map((c) => ({ title: `Chapter ${c.num} · ${c.title}`, sub: c.tagline })),
    ...(opts.projects ? [{ title: 'Hands-on projects', sub: `${practicals.length} projects with complete code and output` }] : []),
    ...(opts.glossary ? [{ title: 'Glossary', sub: `${glossary.length} key terms in plain language` }] : []),
    ...(opts.next ? [{ title: 'Next steps', sub: 'Your roadmap and project ideas for what comes next' }] : []),
    ...(opts.resources ? [{ title: 'Resources', sub: 'Further reading, tools and references' }] : []),
    ...(opts.notes ? [{ title: 'My notes' }] : []),
  ];

  return (
    <div className="animate-fade-up">
      <div className="no-print">
        <PageHeader icon={<FileDown className="h-7 w-7" />} title="PDF Study Guide" gradient="from-fuchsia-600 via-pink-600 to-rose-500"
          subtitle="Turn WebCraft into your own beautifully formatted handbook. Pick chapters and extras, then print it or save it as a PDF to read anywhere — the preview below shows exactly how the pages will look.">
          <button className="btn bg-white !px-5 text-pink-700 shadow-lg" onClick={printPage}><Printer className="h-4 w-4" /> Print / Save as PDF</button>
        </PageHeader>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold text-ink"><User className="h-5 w-5 text-pink-500" /> 1 · Personalise</h2>
            <div className="space-y-3">
              <label className="block"><span className="label">Your name (optional — appears on the cover and certificate)</span>
                <input className="input" value={info.name} placeholder="e.g. Alex Morgan" onChange={(e) => setField('name', e.target.value)} /></label>
              <label className="block"><span className="label">Guide title (use ":" to add a subtitle)</span>
                <input className="input" value={info.title} onChange={(e) => setField('title', e.target.value)} /></label>
            </div>
            <div className="mt-5 rounded-2xl border border-line bg-surface-2/60 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-ink"><Award className="h-4 w-4 text-amber-500" /> Your achievements</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {stats.map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-surface px-2 py-2 shadow-sm">
                    <div className="text-lg font-extrabold text-ink">{v}</div>
                    <div className="text-[10px] font-semibold uppercase leading-tight text-muted">{l}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">These appear on your certificate. Mark chapters as complete, explore simulations and take quizzes to grow them.</p>
            </div>
            <button className="mt-4 text-xs font-bold text-pink-600 hover:underline" onClick={() => setInfo(DEFAULT_INFO)}><RotateCcw className="mr-1 inline h-3 w-3" />Reset name & title</button>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold text-ink"><Settings className="h-5 w-5 text-pink-500" /> 2 · Choose what to include</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {SECTIONS.map(([k, label]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-2 hover:bg-surface-2">
                  <input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} />{label}
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="label !mb-0">Chapters ({selected.length}/{chapters.length})</span>
              <span className="flex gap-2 text-xs font-bold">
                <button className="text-indigo-600 hover:underline dark:text-indigo-300" onClick={() => setOpts({ ...opts, chapters: chapters.map((c) => c.id) })}>All</button>
                <button className="text-indigo-600 hover:underline dark:text-indigo-300" onClick={() => setOpts({ ...opts, chapters: [] })}>None</button>
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chapters.map((c) => {
                const on = opts.chapters.includes(c.id);
                return (
                  <button key={c.id} onClick={() => toggleChapter(c.id)} className={cn('chip transition', on && 'border-transparent text-white')} style={on ? { background: palette[c.color].hex } : undefined}>
                    {on && <CircleCheck className="h-3 w-3" />}{c.num}. {c.short}
                  </button>
                );
              })}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-2"><input type="checkbox" checked={opts.answers} onChange={() => toggle('answers')} /> Include answers to practice questions</label>
            <div className="mt-4 rounded-xl border border-pink-500/30 bg-pink-500/[.06] p-3 text-xs leading-relaxed text-ink-2">
              <b className="text-ink">How to save as PDF:</b> click <b>Print / Save as PDF</b> → set <b>Destination: Save as PDF</b> → <b>Paper: A4</b>, Margins: Default → under "More settings" tick <b>Background graphics</b> → <b>Save</b>.
            </div>
            <button className="btn btn-primary mt-4 w-full !py-3" onClick={printPage}><Printer className="h-5 w-5" /> Print / Save as PDF</button>
          </div>
        </div>

        <div className="my-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted"><div className="h-px flex-1 bg-line" />Live print preview (A4)<div className="h-px flex-1 bg-line" /></div>
      </div>

      <div className="rounded-3xl bg-slate-300/50 p-2 sm:p-8 dark:bg-slate-950/60 print:rounded-none print:bg-transparent print:p-0">
        {empty && <div className="no-print card mx-auto max-w-md p-8 text-center text-sm text-muted">Nothing selected yet — choose at least one section or chapter above.</div>}

        {opts.cover && (
          <Sheet fixed>
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200">
              <div className="relative overflow-hidden bg-linear-to-br from-indigo-700 via-violet-700 to-fuchsia-600 px-10 pb-12 pt-10 text-white">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10" />
                <div className="relative"><Logo light /></div>
                <div className="relative mt-14 text-xs font-bold uppercase tracking-[0.35em] text-white/75">Study guide</div>
                <h1 className="relative mt-3 font-serif text-5xl font-extrabold leading-[1.1]">{mainTitle}</h1>
                {subTitle && <p className="relative mt-3 text-xl font-semibold text-pink-100">{subTitle}</p>}
              </div>
              <img src="images/hero.jpg" alt="" className="h-[92mm] w-full object-cover" />
              <div className="mt-auto grid grid-cols-2 gap-6 px-10 py-7 text-sm">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Prepared by</div>
                  <div className="mt-1.5 text-lg">{nameLine()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Edition</div>
                  <div className="mt-1.5 text-lg font-bold text-slate-900">{date}</div>
                </div>
              </div>
              <div className="border-t border-slate-200 bg-slate-50 px-10 py-3 text-center text-xs font-semibold text-slate-500">
                {selected.length} chapters · {opts.projects ? `${practicals.length} projects · ` : ''}{glossary.length} glossary terms · Learn → Try → Build
              </div>
            </div>
          </Sheet>
        )}

        {opts.certificate && (
          <Sheet fixed>
            <div className="flex flex-1 flex-col border-[6px] border-double border-amber-600 p-1.5">
              <div className="flex flex-1 flex-col items-center border border-amber-300 bg-linear-to-b from-amber-50 to-white px-8 py-10 text-center">
                <Logo />
                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500 bg-amber-100 text-4xl">🏆</div>
                <h1 className="mt-5 font-serif text-5xl font-extrabold tracking-wide text-amber-800">Certificate</h1>
                <div className="mt-1 text-sm font-extrabold uppercase tracking-[0.45em] text-amber-700">of completion</div>
                <p className="mt-10 text-[15px] text-slate-600">This certificate is proudly presented to</p>
                <div className="mt-3 w-4/5 border-b-2 border-amber-500 pb-2 font-serif text-4xl font-bold text-slate-900">{name || '\u00A0'}</div>
                <p className="mx-auto mt-8 max-w-xl text-[16px] leading-[1.9] text-slate-700">
                  {selected.length ? <>for studying <S>{chapterPhrase}</S> of</> : <>for learning with</>} <S>"{info.title}"</S> — discovering how the web works and how to build beautiful, accessible and interactive websites with HTML, CSS and JavaScript.
                </p>
                {hasProgress && (
                  <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-3">
                    {stats.map(([l, v]) => (
                      <div key={l} className="rounded-xl border border-amber-200 bg-white px-3 py-2.5">
                        <div className="text-2xl font-extrabold text-amber-700">{v}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-auto grid w-full grid-cols-2 gap-12 pt-10 text-sm text-slate-700">
                  <div><div className="flex h-9 items-end justify-center text-base font-semibold text-slate-900">{date}</div><div className="mt-1 border-t border-slate-400 pt-1.5 font-bold">Date</div></div>
                  <div><div className="flex h-9 items-end justify-center font-serif text-2xl italic text-indigo-800">WebCraft</div><div className="mt-1 border-t border-slate-400 pt-1.5 font-bold">Signature</div></div>
                </div>
              </div>
            </div>
          </Sheet>
        )}

        {opts.contents && (
          <Sheet>
            <SheetTitle sub={`${contents.length} sections`}>Contents</SheetTitle>
            <ol>
              {contents.map((row, i) => (
                <li key={row.title} className="avoid-break flex items-baseline gap-4 border-b border-dotted border-slate-300 py-2.5">
                  <span className="w-8 shrink-0 font-mono text-sm font-bold text-indigo-600">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">{row.title}</span>
                    {row.sub && <span className="block text-xs text-slate-500">{row.sub}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </Sheet>
        )}

        {opts.about && (
          <Sheet>
            <SheetTitle>About this guide</SheetTitle>
            <div className="space-y-4 text-[15px] leading-[1.85] text-slate-700">
              <p>Welcome! The <S>World Wide Web</S> is part of everyday life — we use it to learn, work, shop, chat and share ideas. Every website you visit was planned, designed and built by someone, and with a little practice that someone can be <S>you</S>.</p>
              <p>This guide is a friendly, step-by-step introduction to <S>web design</S>. It explains how the Internet delivers web pages, how <S>HTML</S> structures content, how <S>CSS</S> styles and arranges it, how <S>JavaScript</S> makes it interactive, and how the principles of <S>UI/UX design</S> make websites pleasant and easy to use. No previous experience is needed — just curiosity.</p>
              <p>It was created with <S>WebCraft</S>, an interactive learning app with live code editors, {SIMS.length} simulations, {practicals.length} hands-on projects and quizzes. Keep the app open while you read: every example here can be edited and run there.</p>
            </div>
            <H3>What you will learn</H3>
            <ul className="space-y-2 text-[15px] text-slate-700">
              {LEARN.map((o) => <li key={o} className="flex gap-2"><span className="text-indigo-600">✔</span>{o}</li>)}
            </ul>
            <H3>How to use this guide</H3>
            <ol className="grid gap-3 sm:grid-cols-2 print:grid-cols-2">
              {HOW_TO.map(([t, d], i) => (
                <li key={t} className="avoid-break rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">{i + 1}</span>{t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
                </li>
              ))}
            </ol>
          </Sheet>
        )}

        {opts.setup && (
          <Sheet>
            <SheetTitle>Getting started</SheetTitle>
            <p className="text-[15px] leading-[1.85] text-slate-700">Good news: building websites needs nothing expensive. If you can read this, you probably already have almost everything you need.</p>
            <H3>What you need</H3>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {NEEDS.map(([k, v]) => (
                  <tr key={k}><td className="w-1/3 border border-slate-300 bg-slate-50 px-3 py-2.5 align-top font-bold text-slate-800">{k}</td><td className="border border-slate-300 px-3 py-2.5 text-slate-700">{v}</td></tr>
                ))}
              </tbody>
            </table>
            <H3>Your first web page in 5 minutes</H3>
            <ol className="space-y-2 text-[15px] text-slate-700">
              {SETUP_STEPS.map((s, i) => (
                <li key={s} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{i + 1}</span><span><Inline text={s} /></span></li>
              ))}
            </ol>
            <CodeBlock code={SKELETON} lang="html" title="index.html" light />
          </Sheet>
        )}

        {selected.map((c) => <ChapterSheet key={c.id} c={c} answers={opts.answers} />)}

        {opts.projects && practicals.map((p, i) => <ProjectSheet key={p.id} p={p} n={i + 1} />)}

        {opts.glossary && (
          <Sheet>
            <SheetTitle sub="Important terms used in this guide, in alphabetical order.">Glossary</SheetTitle>
            <div className="columns-1 gap-8 text-[13px] leading-relaxed text-slate-700 sm:columns-2 print:columns-2">
              {[...glossary].sort((a, b) => a.term.localeCompare(b.term)).map((g) => (
                <p key={g.term} className="mb-2 break-inside-avoid"><S>{g.term}</S> — {g.def}</p>
              ))}
            </div>
          </Sheet>
        )}

        {opts.next && (
          <Sheet>
            <SheetTitle>Next steps</SheetTitle>
            <p className="text-[15px] leading-[1.85] text-slate-700">Congratulations on working through this guide! 🎉 You now know how the web works, and you can structure pages with HTML, style them with CSS, make them interactive with JavaScript and design them with real people in mind. Here is a roadmap for what to learn next:</p>
            <ol className="mt-6 space-y-3">
              {ROADMAP.map(([t, d], i) => (
                <li key={t} className="avoid-break flex gap-4 rounded-xl border border-slate-200 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">{i + 1}</span>
                  <div><div className="font-bold text-slate-900">{t}</div><p className="text-sm leading-relaxed text-slate-600">{d}</p></div>
                </li>
              ))}
            </ol>
            <H3>Project ideas to practise</H3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3">
              {IDEAS.map(([e, t, d]) => (
                <div key={t} className="avoid-break rounded-xl border border-slate-200 p-3">
                  <div className="text-2xl">{e}</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{t}</div>
                  <div className="text-xs text-slate-500">{d}</div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center font-serif text-lg italic text-slate-600">"The best way to learn to build websites is to build websites." — Happy coding! 💜</p>
          </Sheet>
        )}

        {opts.resources && (
          <Sheet>
            <SheetTitle>Resources</SheetTitle>
            {RESOURCES.map((g) => (
              <div key={g.title} className="avoid-break mb-6">
                <h3 className="mb-2 font-serif text-lg font-bold text-indigo-950">{g.title}</h3>
                <ul className="space-y-1.5 text-[14.5px] text-slate-700">
                  {g.items.map(([t, d]) => <li key={t} className="flex gap-2"><span className="text-indigo-600">▸</span><span><S>{t}</S> — {d}</span></li>)}
                </ul>
              </div>
            ))}
            <h3 className="mb-2 mt-8 font-serif text-lg font-bold text-indigo-950">Image credits</h3>
            <p className="text-sm text-slate-600">Illustrations were generated for WebCraft; photographs are from Pexels (free to use). Demo images in examples are served by picsum.photos.</p>
            <div className="mt-16 text-center font-serif text-lg italic text-slate-500">— End of guide —</div>
          </Sheet>
        )}

        {opts.notes && (
          <Sheet fixed>
            <SheetTitle>My notes</SheetTitle>
            <div>{Array.from({ length: 24 }, (_, i) => <div key={i} className="h-[9mm] border-b border-slate-300" />)}</div>
          </Sheet>
        )}
      </div>
    </div>
  );
}
