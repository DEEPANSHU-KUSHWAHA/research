import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Plus, Send, Trash2 } from 'lucide-react';
import { CodeBlock } from '../components/Code';
import { cn } from '../utils/cn';
import { Seg } from './kit';

type FType = 'text' | 'email' | 'password' | 'number' | 'date' | 'color' | 'range' | 'radio' | 'checkbox' | 'select' | 'textarea';
interface Field { id: number; type: FType; label: string; name: string; required: boolean; options: string[]; }

const DEFAULTS: Record<FType, { label: string; name: string; options?: string[] }> = {
  text: { label: 'Full name', name: 'fullname' },
  email: { label: 'E-mail', name: 'email' },
  password: { label: 'Password', name: 'password' },
  number: { label: 'Age', name: 'age' },
  date: { label: 'Date of birth', name: 'dob' },
  color: { label: 'Favourite colour', name: 'colour' },
  range: { label: 'Rate us (1–10)', name: 'rating' },
  radio: { label: 'Experience', name: 'level', options: ['Beginner', 'Intermediate', 'Advanced'] },
  checkbox: { label: 'Hobbies', name: 'hobby', options: ['Coding', 'Music', 'Sports'] },
  select: { label: 'City', name: 'city', options: ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata'] },
  textarea: { label: 'Message', name: 'message' },
};
const TYPES = Object.keys(DEFAULTS) as FType[];

let uid = 10;
const make = (type: FType, required = false): Field => ({ id: uid++, type, label: DEFAULTS[type].label, name: DEFAULTS[type].name, required, options: DEFAULTS[type].options ?? [] });

export function FormBuilderSim() {
  const [fields, setFields] = useState<Field[]>(() => [make('text', true), make('email'), make('radio'), make('select')]);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [result, setResult] = useState<[string, string][] | null>(null);

  const update = (id: number, patch: Partial<Field>) => setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const move = (i: number, d: number) => setFields((fs) => { const a = [...fs]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pairs: [string, string][] = [];
    fd.forEach((v, k) => pairs.push([k, typeof v === 'string' ? v : (v as File).name]));
    setResult(pairs);
  };

  const code = useMemo(() => {
    const L = [`<form action="/submit" method="${method.toLowerCase()}">`];
    fields.forEach((f) => {
      const req = f.required ? ' required' : '';
      if (f.type === 'radio' || f.type === 'checkbox') {
        L.push(`  <p>${f.label}:</p>`);
        f.options.forEach((o, i) => L.push(`  <input type="${f.type}" id="${f.name}${i}" name="${f.name}" value="${o.toLowerCase()}"${f.type === 'radio' && f.required && i === 0 ? ' required' : ''}>`, `  <label for="${f.name}${i}">${o}</label>`));
      } else if (f.type === 'select') {
        L.push(`  <label for="${f.name}">${f.label}:</label>`, `  <select id="${f.name}" name="${f.name}"${req}>`, ...f.options.map((o) => `    <option>${o}</option>`), '  </select>');
      } else if (f.type === 'textarea') {
        L.push(`  <label for="${f.name}">${f.label}:</label>`, `  <textarea id="${f.name}" name="${f.name}" rows="3"${req}></textarea>`);
      } else {
        L.push(`  <label for="${f.name}">${f.label}:</label>`, `  <input type="${f.type}" id="${f.name}" name="${f.name}"${f.type === 'range' ? ' min="1" max="10"' : ''}${req}>`);
      }
      L.push('  <br><br>');
    });
    L.push('  <input type="submit" value="Submit">', '</form>');
    return L.join('\n');
  }, [fields, method]);

  const qs = result ? new URLSearchParams(result).toString() : '';

  return (
    <div className="space-y-5">
      <div>
        <div className="label">Add a field</div>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFields((fs) => [...fs, make(t)])} className="chip transition hover:border-violet-400 hover:text-violet-600">
              <Plus className="h-3 w-3" /> {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between"><div className="label !mb-0">Fields ({fields.length})</div><Seg options={['GET', 'POST'] as const} value={method} onChange={setMethod} /></div>
          {fields.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-line bg-surface-2/50 p-2.5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-700 dark:text-violet-300">{f.type}</span>
                <input className="input !py-1 text-xs" value={f.label} onChange={(e) => update(f.id, { label: e.target.value })} aria-label="Label" />
                <input className="input !w-28 !py-1 font-mono text-xs" value={f.name} onChange={(e) => update(f.id, { name: e.target.value.replace(/\s/g, '') })} aria-label="Name" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <label className="flex items-center gap-1 font-semibold text-ink-2"><input type="checkbox" checked={f.required} onChange={(e) => update(f.id, { required: e.target.checked })} /> required</label>
                {f.options.length > 0 && (
                  <input className="input !w-auto flex-1 !py-1 text-xs" value={f.options.join(', ')} onChange={(e) => update(f.id, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} aria-label="Options" />
                )}
                <span className="ml-auto flex gap-0.5">
                  <button className="icon-btn h-7 w-7" onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button className="icon-btn h-7 w-7" onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button className="icon-btn h-7 w-7 hover:!text-rose-500" onClick={() => setFields((fs) => fs.filter((x) => x.id !== f.id))} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="label">Live preview — fill it in and submit</div>
          <form onSubmit={onSubmit} onReset={() => setResult(null)} className="space-y-3 rounded-xl border border-line bg-white p-4 text-sm text-slate-800">
            {fields.map((f) => (
              <div key={f.id}>
                <div className="mb-1 font-semibold">{f.label}{f.required && <span className="text-rose-500"> *</span>}</div>
                {f.type === 'radio' || f.type === 'checkbox' ? (
                  <div className="flex flex-wrap gap-3">
                    {f.options.map((o, i) => <label key={o} className="flex items-center gap-1"><input type={f.type} name={f.name} value={o.toLowerCase()} required={f.type === 'radio' && f.required && i === 0} /> {o}</label>)}
                  </div>
                ) : f.type === 'select' ? (
                  <select name={f.name} required={f.required} className="w-full rounded-md border border-slate-300 px-2 py-1.5">{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                ) : f.type === 'textarea' ? (
                  <textarea name={f.name} required={f.required} rows={2} className="w-full rounded-md border border-slate-300 px-2 py-1.5" />
                ) : (
                  <input type={f.type} name={f.name} required={f.required} min={f.type === 'range' ? 1 : undefined} max={f.type === 'range' ? 10 : undefined}
                    className={cn(f.type === 'range' || f.type === 'color' ? '' : 'w-full rounded-md border border-slate-300 px-2 py-1.5')} />
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn btn-primary !py-1.5"><Send className="h-4 w-4" /> Submit</button>
              <button type="reset" className="btn btn-ghost !py-1.5">Reset</button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div className="animate-pop rounded-xl border border-emerald-500/30 bg-emerald-500/[.07] p-4">
          <div className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">✅ What the server receives ({method})</div>
          <pre className="code-surface overflow-x-auto rounded-lg p-3 font-mono text-xs leading-relaxed">
            {method === 'GET'
              ? `GET /submit?${qs} HTTP/1.1\nHost: www.example.com\n\n(The data is visible in the URL!)`
              : `POST /submit HTTP/1.1\nHost: www.example.com\nContent-Type: application/x-www-form-urlencoded\n\n${qs}\n\n(The data is hidden inside the request body.)`}
          </pre>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.map(([k, v], i) => <span key={i} className="chip"><b className="font-mono">{k}</b> = {v || <i className="text-muted">(empty)</i>}</span>)}
          </div>
        </div>
      )}

      <CodeBlock code={code} lang="html" title="Generated HTML" className="!my-0" />
    </div>
  );
}
