import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Database, Pause, Play, RefreshCw, RotateCcw, Server, StepBack, StepForward, type LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { Hint } from './kit';

/* ================================================================== */
/* How the web works — animated client / DNS / server simulation      */
/* ================================================================== */
type NodeKey = 'client' | 'dns' | 'server';
const POS: Record<NodeKey, { x: number; y: number }> = { client: { x: 22, y: 50 }, dns: { x: 80, y: 20 }, server: { x: 80, y: 78 } };
interface Step { title: string; text: string; from?: NodeKey; to?: NodeKey; msg?: string; actor?: NodeKey; }

function NodeCard({ k, icon: I, title, sub, color, active }: { k: NodeKey; icon: LucideIcon; title: string; sub: string; color: string; active: boolean }) {
  return (
    <div className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${POS[k].x}%`, top: `${POS[k].y}%` }}>
      <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition duration-300 sm:h-16 sm:w-16', active && 'scale-110 animate-pulse-ring')} style={{ background: color }}>
        <I className="h-7 w-7" />
      </div>
      <div className="mt-1.5 whitespace-nowrap text-xs font-bold text-ink">{title}</div>
      <div className="whitespace-nowrap text-[10px] text-muted">{sub}</div>
    </div>
  );
}

export function WebWorksSim() {
  const [url, setUrl] = useState('https://www.example.com/index.html');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const parsed = useMemo(() => {
    try {
      const u = new URL(url);
      return { host: u.hostname, path: u.pathname || '/', secure: u.protocol === 'https:' };
    } catch {
      return { host: 'example.com', path: '/', secure: true };
    }
  }, [url]);
  const ip = useMemo(() => {
    let h = 7;
    for (const ch of parsed.host) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return `${(h % 200) + 20}.${(h >>> 8) % 256}.${(h >>> 16) % 256}.${((h >>> 24) % 250) + 1}`;
  }, [parsed.host]);

  const steps: Step[] = [
    { title: 'Ready', text: 'Type any web address above and press Play (or the ▶| button) to watch, step by step, how your browser fetches a web page.' },
    { title: 'You enter a URL', actor: 'client', text: `You type ${url} and press Enter. The browser reads the protocol (${parsed.secure ? 'https — secure, encrypted' : 'http — not encrypted'}) and the domain name "${parsed.host}".` },
    { title: 'DNS query', from: 'client', to: 'dns', msg: `Where is ${parsed.host}?`, text: 'Computers communicate using numeric IP addresses, so the browser asks a DNS server to look up the domain name — just like searching a phone book for a number.' },
    { title: 'DNS response', from: 'dns', to: 'client', msg: `IP = ${ip}`, text: `The DNS server replies: "${parsed.host} lives at ${ip}". The browser remembers (caches) this answer to save time on the next visit.` },
    { title: 'HTTP request', from: 'client', to: 'server', msg: `GET ${parsed.path}`, text: `The browser connects to ${ip}${parsed.secure ? ' (performing an encrypted TLS handshake for HTTPS)' : ''} and sends an HTTP request: "GET ${parsed.path}".` },
    { title: 'Server processing', actor: 'server', text: 'The web server finds the requested file on its disk — or runs a program (PHP, Python, Node.js) that builds the page using data from a database.' },
    { title: 'HTTP response', from: 'server', to: 'client', msg: '200 OK + HTML', text: 'The server replies with a status code (200 OK) followed by the HTML document. The CSS files, images and scripts it mentions are fetched with more requests in the same way.' },
    { title: 'Rendering', actor: 'client', text: 'The browser parses the HTML into the DOM tree, applies the CSS, runs the JavaScript and paints the finished page on your screen — usually in well under a second!' },
  ];
  const cur = steps[step];
  const last = steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 2400);
    return () => clearTimeout(t);
  }, [playing, step, last]);

  const involved = (k: NodeKey) => cur.actor === k || cur.from === k || cur.to === k;
  const lineActive = (k: NodeKey) => (cur.from === 'client' && cur.to === k) || (cur.from === k && cur.to === 'client');

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input min-w-[220px] flex-1 font-mono" value={url} onChange={(e) => { setUrl(e.target.value); setStep(0); setPlaying(false); }} aria-label="URL" />
        <button className="btn btn-primary" onClick={() => { if (step >= last) setStep(0); setPlaying((p) => !p); }}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? 'Pause' : 'Play'}
        </button>
        <button className="btn btn-ghost !px-3" title="Previous step" onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}><StepBack className="h-4 w-4" /></button>
        <button className="btn btn-ghost !px-3" title="Next step" onClick={() => { setPlaying(false); setStep((s) => Math.min(last, s + 1)); }}><StepForward className="h-4 w-4" /></button>
        <button className="btn btn-ghost !px-3" title="Reset" onClick={() => { setStep(0); setPlaying(false); }}><RotateCcw className="h-4 w-4" /></button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        <div className="relative h-[300px] overflow-hidden rounded-2xl border border-line bg-surface-2/60 bg-dots sm:h-[330px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {(['dns', 'server'] as NodeKey[]).map((k) => (
              <line key={k} x1={POS.client.x} y1={POS.client.y} x2={POS[k].x} y2={POS[k].y} vectorEffect="non-scaling-stroke"
                stroke={lineActive(k) ? '#6366f1' : '#94a3b8'} strokeWidth={lineActive(k) ? 3 : 1.5} className={lineActive(k) ? 'animate-dash' : ''} strokeDasharray="6 6" />
            ))}
          </svg>

          {/* Browser (client) */}
          <div className="absolute z-10 w-[42%] max-w-[220px] -translate-x-1/2 -translate-y-1/2" style={{ left: `${POS.client.x}%`, top: `${POS.client.y}%` }}>
            <div className={cn('overflow-hidden rounded-xl border-2 bg-surface shadow-xl transition', involved('client') ? 'border-indigo-500 animate-pulse-ring' : 'border-line')}>
              <div className="flex items-center gap-1 border-b border-line bg-surface-2 px-2 py-1.5">
                <i className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" /><i className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" /><i className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                <div className="ml-1 flex-1 truncate rounded bg-surface px-1.5 py-0.5 font-mono text-[9px] text-muted">{parsed.secure ? '🔒 ' : ''}{parsed.host}{parsed.path}</div>
              </div>
              <div className="h-20 p-2 sm:h-24">
                {step === last ? (
                  <div className="animate-pop space-y-1.5">
                    <div className="h-3 w-2/3 rounded bg-indigo-500" />
                    <div className="h-2 w-full rounded bg-line" />
                    <div className="h-2 w-5/6 rounded bg-line" />
                    <div className="flex gap-1.5"><div className="h-7 flex-1 rounded bg-fuchsia-300" /><div className="h-7 flex-1 rounded bg-sky-300" /></div>
                  </div>
                ) : step > 0 ? (
                  <div className="flex h-full items-center justify-center gap-2 text-[10px] font-semibold text-muted"><RefreshCw className="h-4 w-4 animate-spin" /> Loading…</div>
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted">New tab</div>
                )}
              </div>
            </div>
            <div className="mt-1.5 text-center text-xs font-bold text-ink">Your browser (client)</div>
          </div>

          <NodeCard k="dns" icon={Database} title="DNS Server" sub="name → IP address" color="#8b5cf6" active={involved('dns')} />
          <NodeCard k="server" icon={Server} title="Web Server" sub={ip} color="#10b981" active={involved('server')} />

          {cur.from && cur.to && (
            <div key={step} className="absolute z-20"
              style={{ '--x1': `${POS[cur.from].x}%`, '--y1': `${POS[cur.from].y}%`, '--x2': `${POS[cur.to].x}%`, '--y2': `${POS[cur.to].y}%`, animation: 'travel 1.6s cubic-bezier(.4,0,.2,1) forwards' } as CSSProperties}>
              <div className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg shadow-indigo-500/40">📦 {cur.msg}</div>
            </div>
          )}
        </div>

        <ol className="space-y-1">
          {steps.slice(1).map((s, i) => (
            <li key={i}>
              <button onClick={() => { setPlaying(false); setStep(i + 1); }}
                className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition',
                  step === i + 1 ? 'bg-indigo-600 text-white shadow-md' : step > i + 1 ? 'text-emerald-600 hover:bg-surface-2 dark:text-emerald-400' : 'text-muted hover:bg-surface-2')}>
                <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]', step === i + 1 ? 'border-white/60' : 'border-current')}>{step > i + 1 ? '✓' : i + 1}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4">
        <Hint><b className="text-indigo-700 dark:text-indigo-300">{step === 0 ? 'Ready to start' : `Step ${step} of ${last}: ${cur.title}`}</b><br />{cur.text}</Hint>
      </div>
    </div>
  );
}

/* ================================================================== */
/* URL anatomy                                                         */
/* ================================================================== */
const PART_INFO = {
  protocol: { label: 'Protocol (scheme)', color: '#ef4444', desc: 'The set of rules used to fetch the resource. https:// is secure (encrypted) HTTP; http:// is not encrypted.' },
  sub: { label: 'Subdomain', color: '#f59e0b', desc: 'An optional section before the main domain, such as www, mail or en. It can point to a different part of the site.' },
  domain: { label: 'Domain name', color: '#10b981', desc: 'The unique, registered name of the website — the part people remember.' },
  tld: { label: 'Top-level domain (TLD)', color: '#06b6d4', desc: 'Shows the type or country of the site: .com (commercial), .org, .edu, .gov, .in (India), .co.in, .nic.in…' },
  port: { label: 'Port', color: '#64748b', desc: 'The "door number" on the server. Usually hidden because browsers use 80 for http and 443 for https by default.' },
  path: { label: 'Path', color: '#6366f1', desc: 'The location of the file or page on the server, similar to a folder path on your computer.' },
  query: { label: 'Query string', color: '#d946ef', desc: 'Extra data sent to the server as key=value pairs. It starts with ? and pairs are separated by &.' },
  fragment: { label: 'Fragment (anchor)', color: '#ec4899', desc: 'Jumps to an element with a matching id on the page. It starts with # and is never sent to the server.' },
} as const;
type PartKey = keyof typeof PART_INFO;

const PRESETS = [
  'https://www.example.com:443/blog/index.html?id=42&lang=en#comments',
  'https://www.bbc.co.uk/news/technology',
  'http://shop.mysite.co.in/products/shoes?color=red&size=8',
  'https://en.wikipedia.org/wiki/HTML#History',
];

const safeDecode = (s: string) => { try { return decodeURIComponent(s.replace(/\+/g, ' ')); } catch { return s; } };

function parseUrl(input: string): { key: PartKey; text: string }[] | null {
  const m = /^([a-z][a-z0-9+.-]*:\/\/)([^/?#:\s]+)(:\d+)?([^?#\s]*)(\?[^#\s]*)?(#\S*)?$/i.exec(input.trim());
  if (!m) return null;
  const [, protocol, host, port, path, query, fragment] = m;
  const parts: { key: PartKey; text: string }[] = [{ key: 'protocol', text: protocol }];
  const labels = host.split('.');
  if (/^\d+(\.\d+){3}$/.test(host) || labels.length < 2) {
    parts.push({ key: 'domain', text: host });
  } else {
    const compound = labels.length >= 3 && /^(co|ac|gov|org|net|edu|nic|res|gen|firm|ind)$/.test(labels[labels.length - 2]) && labels[labels.length - 1].length === 2;
    const n = compound ? 2 : 1;
    const sub = labels.slice(0, labels.length - n - 1).join('.');
    if (sub) parts.push({ key: 'sub', text: sub + '.' });
    parts.push({ key: 'domain', text: labels[labels.length - n - 1] });
    parts.push({ key: 'tld', text: '.' + labels.slice(-n).join('.') });
  }
  if (port) parts.push({ key: 'port', text: port });
  if (path) parts.push({ key: 'path', text: path });
  if (query) parts.push({ key: 'query', text: query });
  if (fragment) parts.push({ key: 'fragment', text: fragment });
  return parts;
}

export function UrlAnatomySim() {
  const [url, setUrl] = useState(PRESETS[0]);
  const [active, setActive] = useState<PartKey | null>(null);
  const parts = parseUrl(url);
  const params = parts?.find((p) => p.key === 'query')?.text.slice(1).split('&').filter(Boolean).map((kv) => kv.split('=')) ?? [];

  return (
    <div>
      <input className="input font-mono" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="URL to analyse" />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((p, i) => <button key={p} onClick={() => setUrl(p)} className={cn('chip transition hover:border-indigo-400', url === p && 'border-indigo-500 text-indigo-600 dark:text-indigo-300')}>Example {i + 1}</button>)}
      </div>

      {!parts ? (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300">
          ⚠ That doesn't look like a complete URL. It should start with a protocol such as <b>https://</b> followed by a domain name.
        </div>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface-2/60 p-4 text-center">
            <div className="inline-flex whitespace-nowrap font-mono text-base font-bold sm:text-xl">
              {parts.map((p, i) => (
                <span key={i} onMouseEnter={() => setActive(p.key)} onMouseLeave={() => setActive(null)} onClick={() => setActive(p.key)}
                  className="cursor-pointer rounded-md px-0.5 py-1 transition"
                  style={{ color: PART_INFO[p.key].color, background: active === p.key ? PART_INFO[p.key].color + '22' : undefined, boxShadow: `inset 0 -3px 0 ${PART_INFO[p.key].color}${active === p.key ? '' : '55'}` }}>
                  {p.text}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {parts.map((p, i) => {
              const info = PART_INFO[p.key];
              return (
                <div key={i} onMouseEnter={() => setActive(p.key)} onMouseLeave={() => setActive(null)}
                  className={cn('rounded-xl border p-3 transition', active === p.key ? 'shadow-md' : 'border-line')} style={{ borderColor: active === p.key ? info.color : undefined }}>
                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: info.color }}><i className="h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />{info.label}</div>
                  <div className="mt-1 truncate font-mono text-sm font-semibold text-ink">{p.text}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted">{info.desc}</div>
                </div>
              );
            })}
          </div>
          {params.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              <div className="bg-fuchsia-500/10 px-3 py-2 text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300">Query parameters sent to the server</div>
              <table className="w-full text-sm">
                <tbody>
                  {params.map(([k, v], i) => (
                    <tr key={i} className="border-t border-line"><td className="px-3 py-1.5 font-mono font-bold text-ink">{safeDecode(k || '')}</td><td className="px-3 py-1.5 font-mono text-ink-2">{safeDecode(v ?? '')}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
