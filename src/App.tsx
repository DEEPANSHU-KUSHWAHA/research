import { useEffect, useState } from 'react';
import { BackToTop, CommandPalette, Header, Sidebar, Toaster } from './components/Layout';
import { chapterById } from './data';
import { useRoute } from './lib/store';
import ChapterPage from './pages/ChapterPage';
import Guide from './pages/Guide';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Playground from './pages/Playground';
import Projects from './pages/Projects';
import Quiz from './pages/Quiz';
import { CheatSheet, Glossary } from './pages/Reference';
import { cn } from './utils/cn';

const TITLES: Record<string, string> = {
  lab: 'Simulation Lab', playground: 'Code Playground', projects: 'Hands-on Projects', quiz: 'Quiz Arena',
  glossary: 'Glossary', cheatsheet: 'Cheat Sheet', guide: 'PDF Study Guide',
};
/** Old addresses from earlier versions keep working. */
const REDIRECTS: Record<string, string> = { practicals: '/projects', report: '/guide' };

export default function App() {
  const path = useRoute();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [pathname, query = ''] = path.split('?');
  const seg = pathname.split('/').filter(Boolean);

  useEffect(() => {
    const to = seg[0] ? REDIRECTS[seg[0]] : undefined;
    if (to) { window.location.replace('#' + to); return; }
    setMenu(false);
    window.scrollTo({ top: 0 });
    const ch = seg[0] === 'chapter' ? chapterById(seg[1] ?? '') : undefined;
    document.title = ch ? `${ch.title} · WebCraft` : seg[0] ? `${TITLES[seg[0]] ?? 'WebCraft'} · WebCraft` : 'WebCraft — Learn Web Design Interactively';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch((s) => !s); }
      else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  let page;
  switch (seg[0]) {
    case undefined: page = <Home />; break;
    case 'chapter': page = <ChapterPage key={seg[1]} id={seg[1] ?? ''} />; break;
    case 'lab': page = <Lab key={seg[1] ?? 'hub'} simId={seg[1]} />; break;
    case 'playground': page = <Playground />; break;
    case 'projects': case 'practicals': page = <Projects />; break;
    case 'quiz': page = <Quiz key={query} query={query} />; break;
    case 'glossary': page = <Glossary />; break;
    case 'cheatsheet': page = <CheatSheet />; break;
    case 'guide': case 'report': page = <Guide />; break;
    default:
      page = (
        <div className="card p-12 text-center">
          <div className="text-6xl">🧭</div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">404 — Page not found</h1>
          <p className="mt-2 text-muted">Even the best websites have broken links sometimes!</p>
          <a href="#/" className="btn btn-primary mt-6">Back to home</a>
        </div>
      );
  }
  const wide = seg[0] === 'playground' || seg[0] === 'guide' || seg[0] === 'report';

  return (
    <div className="min-h-screen">
      <Sidebar path={pathname} open={menu} onClose={() => setMenu(false)} />
      <div className="lg:pl-72 print:pl-0">
        <Header onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} path={path} />
        <main className={cn('mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8', wide ? 'max-w-[1500px]' : 'max-w-6xl')}>{page}</main>
        <footer className="no-print border-t border-line px-6 py-8 text-center text-xs text-muted">
          <div className="font-bold text-ink-2">WebCraft · Learn web design by doing — free for everyone</div>
          <div className="mt-1">Learn → Try → Simulate → Build → Print. Made with HTML, CSS & JavaScript (React + Tailwind).</div>
          <div className="mt-2">Press <kbd className="rounded border border-line px-1">Ctrl K</kbd> or <kbd className="rounded border border-line px-1">/</kbd> to search anything.</div>
        </footer>
      </div>
      <CommandPalette open={search} onClose={() => setSearch(false)} />
      <Toaster />
      <BackToTop />
    </div>
  );
}
