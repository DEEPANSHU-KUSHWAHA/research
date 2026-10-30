import { useEffect, useState, useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------ */
/* Hash router                                                         */
/* ------------------------------------------------------------------ */
const getPath = () => decodeURIComponent(window.location.hash.replace(/^#/, '')) || '/';

export function useRoute() {
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const on = () => setPath(getPath());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return path;
}

export const navigate = (to: string) => {
  if (getPath() !== to) window.location.hash = to;
};

let pendingScroll: string | null = null;
export const setPendingScroll = (id: string | null) => { pendingScroll = id; };
export const takePendingScroll = () => { const id = pendingScroll; pendingScroll = null; return id; };

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ------------------------------------------------------------------ */
/* Persistent state                                                    */
/* ------------------------------------------------------------------ */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue] as const;
}

function createStore<T extends object>(key: string | null, initial: T) {
  let state: T = initial;
  if (key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch { /* ignore */ }
  }
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(next: T) {
      state = next;
      if (key) { try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ } }
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => { listeners.delete(l); };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Learning progress                                                   */
/* ------------------------------------------------------------------ */
export interface Progress { done: string[]; sims: string[]; quiz: Record<string, number>; }
const progressStore = createStore<Progress>('wc-progress', { done: [], sims: [], quiz: {} });
export const useProgress = () => useSyncExternalStore(progressStore.subscribe, progressStore.get);
export const progress = {
  toggleDone(id: string) {
    const s = progressStore.get();
    const done = s.done.includes(id) ? s.done.filter((d) => d !== id) : [...s.done, id];
    progressStore.set({ ...s, done });
    return done.includes(id);
  },
  markSim(id: string) {
    const s = progressStore.get();
    if (!s.sims.includes(id)) progressStore.set({ ...s, sims: [...s.sims, id] });
  },
  saveQuiz(key: string, pct: number) {
    const s = progressStore.get();
    if ((s.quiz[key] ?? -1) < pct) progressStore.set({ ...s, quiz: { ...s.quiz, [key]: pct } });
  },
  reset() { progressStore.set({ done: [], sims: [], quiz: {} }); },
};

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */
export interface Toast { id: number; msg: string; kind: 'success' | 'info'; }
const toastStore = createStore<{ items: Toast[] }>(null, { items: [] });
export const useToasts = () => useSyncExternalStore(toastStore.subscribe, toastStore.get);
export function toast(msg: string, kind: Toast['kind'] = 'success') {
  const id = Date.now() + Math.random();
  toastStore.set({ items: [...toastStore.get().items, { id, msg, kind }] });
  setTimeout(() => toastStore.set({ items: toastStore.get().items.filter((t) => t.id !== id) }), 2600);
}

/* ------------------------------------------------------------------ */
/* Theme (dark mode) — always prints in light mode                     */
/* ------------------------------------------------------------------ */
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('wc-theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);
  useEffect(() => {
    const before = () => document.documentElement.classList.remove('dark');
    const after = () => {
      let d = false;
      try { d = localStorage.getItem('wc-theme') === 'dark'; } catch { /* ignore */ }
      document.documentElement.classList.toggle('dark', d);
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);
  return [dark, setDark] as const;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export const slugify = (s: string) => s.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function copyText(text: string, msg = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  toast(msg);
}

export function printPage() {
  toast('Tip: choose "Save as PDF" as the destination', 'info');
  setTimeout(() => window.print(), 350);
}

export function downloadFile(name: string, content: string, type = 'text/html') {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export interface CodeSet { html: string; css?: string; js?: string; }
export function openInPlayground(code: CodeSet) {
  try { localStorage.setItem('wc-playground-incoming', JSON.stringify(code)); } catch { /* ignore */ }
  navigate('/playground');
}

/* Build a full HTML document for an <iframe srcDoc> preview. */
const SCRIPT_OPEN = '<scr' + 'ipt>';
const SCRIPT_CLOSE = '</scr' + 'ipt>';
const BASE_STYLE = 'body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:12px;line-height:1.5;color:#1e293b}';
const CONSOLE_BRIDGE =
  SCRIPT_OPEN +
  "(function(){function s(t,a){try{parent.postMessage({__wc:1,type:t,args:Array.prototype.map.call(a,function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}})},'*')}catch(e){}}" +
  "['log','info','warn','error'].forEach(function(t){var o=console[t];console[t]=function(){s(t,arguments);o.apply(console,arguments)}});" +
  "window.addEventListener('error',function(e){s('error',[e.message+(e.lineno?' (line '+e.lineno+')':'')])});})();" +
  SCRIPT_CLOSE;

export function buildDoc(html: string, css = '', js = '', withConsole = false) {
  const bridge = withConsole ? CONSOLE_BRIDGE : '';
  const style = css.trim() ? `<style>\n${css}\n</style>` : '';
  const script = js.trim() ? `${SCRIPT_OPEN}\n${js}\n${SCRIPT_CLOSE}` : '';
  if (/<html[\s>]/i.test(html)) {
    let doc = html;
    const head = bridge + style;
    if (head) {
      doc = /<\/head>/i.test(doc)
        ? doc.replace(/<\/head>/i, () => head + '</head>')
        : doc.replace(/<html[^>]*>/i, (m) => m + head);
    }
    if (script) doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, () => script + '</body>') : doc + script;
    return doc;
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${bridge}<style>${BASE_STYLE}</style>${style}</head><body>${html}${script}</body></html>`;
}
