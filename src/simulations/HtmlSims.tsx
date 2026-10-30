import { useMemo, useState } from 'react';
import { ChevronRight, Combine, RotateCcw } from 'lucide-react';
import { CodeBlock, CodeEditor } from '../components/Code';
import { cn } from "/utils/cn";
import { Hint, Slider, Stepper, Toggle } from './kit';

/* ================================================================== */
/* DOM tree visualiser                                                 */
/* ================================================================== */
interface TNode { id: string; kind: 'el' | 'text' | 'comment'; tag: string; attrs: [string, string][]; text?: string; children: TNode[]; parent?: string; siblings: number; depth: number; }

function build(node: Node, id: string, depth: number, parent?: string): TNode | null {
  if (node.nodeType === 3) {
    const t = (node.textContent || '').replace(/\s+/g, ' ').trim();
    return t ? { id, kind: 'text', tag: '#text', attrs: [], text: t.length > 34 ? t.slice(0, 34) + '…' : t, children: [], parent, siblings: 0, depth } : null;
  }
  if (node.nodeType === 8) return { id, kind: 'comment', tag: '#comment', attrs: [], text: (node.textContent || '').trim().slice(0, 34), children: [], parent, siblings: 0, depth };
  if (node.nodeType !== 1) return null;
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const children: TNode[] = [];
  el.childNodes.forEach((c, i) => { const n = build(c, `${id}.${i}`, depth + 1, tag); if (n) children.push(n); });
  children.forEach((c) => { c.siblings = children.length - 1; });
  return { id, kind: 'el', tag, attrs: Array.from(el.attributes).map((a) => [a.name, a.value] as [string, string]), children, parent, siblings: 0, depth };
}

function stats(n: TNode, acc = { els: 0, texts: 0, depth: 0 }) {
  if (n.kind === 'el') acc.els++; else if (n.kind === 'text') acc.texts++;
  acc.depth = Math.max(acc.depth, n.depth);
  n.children.forEach((c) => stats(c, acc));
  return acc;
}

const TAG_COLOR: Record<string, string> = { html: '#f97316', head: '#0ea5e9', body: '#10b981', title: '#0ea5e9', meta: '#0ea5e9' };

function TreeNode({ n, sel, onSel, collapsed, toggle }: { n: TNode; sel: string | null; onSel: (n: TNode) => void; collapsed: Set<string>; toggle: (id: string) => void }) {
  const open = !collapsed.has(n.id);
  const color = n.kind === 'el' ? TAG_COLOR[n.tag] ?? '#8b5cf6' : '#64748b';
  return (
    <li>
      <div className="flex items-center gap-1 py-0.5">
        {n.kind === 'el' && n.children.length > 0 ? (
          <button onClick={() => toggle(n.id)} className="flex h-4 w-4 items-center justify-center text-muted hover:text-ink" aria-label="Toggle children">
            <ChevronRight className={cn('h-3.5 w-3.5 transition', open && 'rotate-90')} />
          </button>
        ) : <span className="w-4" />}
        <button onClick={() => onSel(n)}
          className={cn('max-w-full truncate rounded-md border px-2 py-0.5 text-left font-mono text-xs transition hover:shadow-sm', sel === n.id ? 'ring-2 ring-offset-1 ring-offset-surface' : '')}
          style={{ borderColor: color + '55', background: color + (n.kind === 'el' ? '14' : '08'), color, ['--tw-ring-color' as string]: color }}>
          {n.kind === 'el' ? (
            <>&lt;{n.tag}{n.attrs.map(([k, v]) => <span key={k} className="text-sky-600 dark:text-sky-400"> {k}="{v}"</span>)}&gt;</>
          ) : n.kind === 'text' ? <span className="italic text-ink-2">"{n.text}"</span> : <span className="italic">💬 {n.text}</span>}
        </button>
      </div>
      {n.kind === 'el' && open && n.children.length > 0 && (
        <ul className="ml-[7px] border-l-2 border-dashed border-line pl-3">
          {n.children.map((c) => <TreeNode key={c.id} n={c} sel={sel} onSel={onSel} collapsed={collapsed} toggle={toggle} />)}
        </ul>
      )}
    </li>
  );
}

const DOM_DEFAULT = `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>Learning <b>HTML</b> is fun!</p>
  <ul>
    <li>HTML</li>
    <li>CSS</li>
  </ul>
  <img src="logo.png" alt="Logo">
</body>
</html>`;

export function DomTreeSim() {
  const [code, setCode] = useState(DOM_DEFAULT);
  const [sel, setSel] = useState<TNode | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const tree = useMemo(() => {
    const doc = new DOMParser().parseFromString(code, 'text/html');
    return build(doc.documentElement, '0', 0);
  }, [code]);
  const st = tree ? stats(tree) : { els: 0, texts: 0, depth: 0 };
  const toggle = (id: string) => setCollapsed((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="label">HTML code (edit me)</div>
        <CodeEditor value={code} onChange={(v) => { setCode(v); setSel(null); }} lang="html" className="rounded-xl border" style={{ height: 330 }} />
        <button onClick={() => setCode(DOM_DEFAULT)} className="btn btn-ghost mt-2 !py-1.5 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Reset code</button>
      </div>
      <div className="min-w-0">
        <div className="label">DOM tree (click a node)</div>
        <div className="h-[330px] overflow-auto rounded-xl border border-line bg-surface-2/50 p-3">
          {tree && <ul><TreeNode n={tree} sel={sel?.id ?? null} onSel={setSel} collapsed={collapsed} toggle={toggle} /></ul>}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {[['Elements', st.els], ['Text nodes', st.texts], ['Max depth', st.depth]].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-line py-1.5"><div className="text-lg font-extrabold text-ink">{v}</div><div className="text-[10px] font-semibold uppercase text-muted">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <Hint>
          {sel ? (
            <>
              <b>{sel.kind === 'el' ? `<${sel.tag}> element` : sel.kind === 'text' ? 'Text node' : 'Comment node'}</b> · parent: <code className="inline-code">{sel.parent ? `<${sel.parent}>` : 'document'}</code> ·
              children: <b>{sel.children.length}</b> · siblings: <b>{sel.siblings}</b> · depth: <b>{sel.depth}</b>
              {sel.attrs.length > 0 && <> · attributes: {sel.attrs.map(([k, v]) => <code key={k} className="inline-code mr-1">{k}="{v}"</code>)}</>}
            </>
          ) : 'Every tag becomes an element node and every piece of text becomes a text node. Notice that the browser automatically adds missing tags (try deleting <head> or <body>)!'}
        </Hint>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Table builder with colspan / rowspan                                */
/* ================================================================== */
const HEADS = ['#', 'Product', 'Q1', 'Q2', 'Q3', 'Q4'];
const NAMES = ['Laptop', 'Phone', 'Tablet', 'Camera', 'Watch', 'Speaker', 'Drone'];

export function TableBuilderSim() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [header, setHeader] = useState(true);
  const [border, setBorder] = useState(1);
  const [pad, setPad] = useState(8);
  const [caption, setCaption] = useState('Quarterly Sales (units)');
  const [cells, setCells] = useState<Record<string, string>>({});
  const [spans, setSpans] = useState<Record<string, { cs: number; rs: number }>>({});
  const [sel, setSel] = useState<[number, number] | null>(null);

  const def = (r: number, c: number) => {
    if (header && r === 0) return HEADS[c] ?? `Head ${c + 1}`;
    const n = header ? r : r + 1;
    if (c === 0) return String(n);
    if (c === 1) return NAMES[(n - 1) % NAMES.length];
    return String(60 + ((n * 7 + c * 13) % 40));
  };
  const text = (r: number, c: number) => cells[`${r}-${c}`] ?? def(r, c);

  const layout = useMemo(() => {
    const occ = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
    const out: { r: number; c: number; cs: number; rs: number }[][] = [];
    for (let r = 0; r < rows; r++) {
      const line: { r: number; c: number; cs: number; rs: number }[] = [];
      for (let c = 0; c < cols; c++) {
        if (occ[r][c]) continue;
        const sp = spans[`${r}-${c}`] ?? { cs: 1, rs: 1 };
        let cs = Math.min(sp.cs, cols - c);
        for (let k = 1; k < cs; k++) if (occ[r][c + k]) { cs = k; break; }
        let rs = Math.min(sp.rs, rows - r);
        outer: for (let rr = 1; rr < rs; rr++) for (let cc = c; cc < c + cs; cc++) if (occ[r + rr][cc]) { rs = rr; break outer; }
        for (let rr = r; rr < r + rs; rr++) for (let cc = c; cc < c + cs; cc++) occ[rr][cc] = true;
        line.push({ r, c, cs, rs });
      }
      out.push(line);
    }
    return out;
  }, [rows, cols, spans]);

  const code = useMemo(() => {
    const L = [`<table border="${border}" cellpadding="${pad}">`];
    if (caption) L.push(`  <caption>${caption}</caption>`);
    layout.forEach((line, r) => {
      L.push('  <tr>');
      line.forEach((cell) => {
        const t = header && r === 0 ? 'th' : 'td';
        const a = (cell.cs > 1 ? ` colspan="${cell.cs}"` : '') + (cell.rs > 1 ? ` rowspan="${cell.rs}"` : '');
        L.push(`    <${t}${a}>${text(cell.r, cell.c)}</${t}>`);
      });
      L.push('  </tr>');
    });
    L.push('</table>');
    return L.join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, border, pad, caption, header, cells]);

  const key = sel ? `${sel[0]}-${sel[1]}` : '';
  const selCell = sel ? layout.flat().find((c) => c.r === sel[0] && c.c === sel[1]) : undefined;
  const setSpan = (dcs: number, drs: number) => {
    if (!sel || !selCell) return;
    setSpans((s) => ({ ...s, [key]: { cs: Math.max(1, Math.min(cols - sel[1], selCell.cs + dcs)), rs: Math.max(1, Math.min(rows - sel[0], selCell.rs + drs)) } }));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
      <div className="space-y-4">
        <div className="flex gap-4"><Stepper label="Rows" value={rows} min={2} max={7} onChange={setRows} /><Stepper label="Columns" value={cols} min={2} max={6} onChange={setCols} /></div>
        <Toggle label="First row is a header (<th>)" checked={header} onChange={setHeader} />
        <Slider label="border" value={border} min={0} max={4} unit="" onChange={setBorder} />
        <Slider label="cellpadding" value={pad} min={0} max={20} unit="" onChange={setPad} />
        <label className="block"><span className="label">caption</span><input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
        <div className="rounded-xl border border-line p-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink"><Combine className="h-4 w-4 text-emerald-500" /> Merge cells</div>
          {selCell ? (
            <div className="space-y-2 text-xs">
              <div className="text-muted">Selected: row {selCell.r + 1}, column {selCell.c + 1}</div>
              <div className="flex items-center justify-between"><span className="font-mono font-semibold">colspan = {selCell.cs}</span><span className="flex gap-1"><button className="btn btn-ghost !px-2 !py-0.5" onClick={() => setSpan(-1, 0)}>−</button><button className="btn btn-ghost !px-2 !py-0.5" onClick={() => setSpan(1, 0)}>+</button></span></div>
              <div className="flex items-center justify-between"><span className="font-mono font-semibold">rowspan = {selCell.rs}</span><span className="flex gap-1"><button className="btn btn-ghost !px-2 !py-0.5" onClick={() => setSpan(0, -1)}>−</button><button className="btn btn-ghost !px-2 !py-0.5" onClick={() => setSpan(0, 1)}>+</button></span></div>
            </div>
          ) : <div className="text-xs text-muted">Click any cell in the table to select it.</div>}
          <button className="mt-2 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300" onClick={() => setSpans({})}>Clear all merges</button>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-x-auto rounded-xl border border-line bg-white p-4 text-slate-800">
          <table className="mx-auto text-sm" style={{ borderCollapse: 'separate', borderSpacing: border ? 2 : 0, border: border ? `${border}px solid #78716c` : 'none' }}>
            {caption && <caption className="mb-2 font-bold">{caption}</caption>}
            <tbody>
              {layout.map((line, r) => (
                <tr key={r}>
                  {line.map((cell) => {
                    const T = header && r === 0 ? 'th' : 'td';
                    const isSel = sel?.[0] === cell.r && sel?.[1] === cell.c;
                    const merged = cell.cs > 1 || cell.rs > 1;
                    return (
                      <T key={cell.c} colSpan={cell.cs} rowSpan={cell.rs} onClick={() => setSel([cell.r, cell.c])}
                        className={cn('cursor-pointer transition', T === 'th' ? 'bg-amber-100' : merged ? 'bg-emerald-50' : 'bg-white', isSel && 'outline-2 -outline-offset-2 outline-indigo-500')}
                        style={{ padding: pad, border: border ? `${border}px solid #a8a29e` : '1px dashed #d6d3d1', outlineStyle: isSel ? 'solid' : undefined }}>
                        <input value={text(cell.r, cell.c)} onFocus={() => setSel([cell.r, cell.c])}
                          onChange={(e) => setCells((s) => ({ ...s, [`${cell.r}-${cell.c}`]: e.target.value }))}
                          className="w-20 min-w-0 bg-transparent text-center outline-none" style={{ fontWeight: T === 'th' ? 700 : 400 }} />
                      </T>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={code} lang="html" title="Generated HTML" className="!my-0" />
      </div>
    </div>
  );
}
