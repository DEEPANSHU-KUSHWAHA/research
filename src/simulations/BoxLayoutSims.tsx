import { useMemo, useState } from 'react';
import { CodeBlock } from '../components/Code';
import { Hint, ITEM_COLORS, Seg, Slider, Stepper, Tabs, Toggle } from './kit';

/* ================================================================== */
/* Box model                                                           */
/* ================================================================== */
export function BoxModelSim() {
  const [w, setW] = useState(180);
  const [h, setH] = useState(80);
  const [pad, setPad] = useState(20);
  const [bor, setBor] = useState(8);
  const [mar, setMar] = useState(24);
  const [style, setStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double'>('solid');
  const [sizing, setSizing] = useState<'content-box' | 'border-box'>('content-box');

  const cb = sizing === 'content-box';
  const visW = cb ? w + 2 * pad + 2 * bor : w;
  const visH = cb ? h + 2 * pad + 2 * bor : h;
  const cw = cb ? w : Math.max(0, w - 2 * pad - 2 * bor);
  const ch = cb ? h : Math.max(0, h - 2 * pad - 2 * bor);

  const css = `.box {\n  box-sizing: ${sizing};\n  width: ${w}px;\n  height: ${h}px;\n  padding: ${pad}px;\n  border: ${bor}px ${style} orange;\n  margin: ${mar}px;\n}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
      <div className="space-y-3">
        <Seg label="box-sizing" options={['content-box', 'border-box'] as const} value={sizing} onChange={setSizing} />
        <Slider label="width" value={w} min={60} max={300} onChange={setW} />
        <Slider label="height" value={h} min={40} max={160} onChange={setH} />
        <Slider label="padding" value={pad} min={0} max={50} onChange={setPad} />
        <Slider label="border-width" value={bor} min={0} max={30} onChange={setBor} />
        <Slider label="margin" value={mar} min={0} max={60} onChange={setMar} />
        <Seg label="border-style" options={['solid', 'dashed', 'dotted', 'double'] as const} value={style} onChange={setStyle} />
      </div>
      <div className="min-w-0 space-y-3">
        <div className="flex min-h-[300px] items-center justify-center overflow-auto rounded-xl border border-line bg-surface-2/60 bg-dots p-4">
          <div className="hatch relative rounded transition-all duration-300" style={{ padding: mar }}>
            {mar >= 14 && <span className="absolute left-1 top-0 text-[10px] font-bold text-orange-700 dark:text-orange-300">margin {mar}</span>}
            <div className="relative flex items-center justify-center transition-all duration-300"
              style={{ width: w, height: h, padding: pad, border: `${bor}px ${style} #f59e0b`, boxSizing: sizing, background: 'linear-gradient(#93c5fd, #93c5fd) content-box, #86efac padding-box' }}>
              {pad >= 14 && <span className="absolute left-1 top-0 text-[10px] font-bold text-emerald-800">padding {pad}</span>}
              <span className="text-center text-[11px] font-bold leading-tight text-sky-900">content<br />{cw} × {ch}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          {[['margin', '#fb923c'], ['border', '#f59e0b'], ['padding', '#86efac'], ['content', '#93c5fd']].map(([l, c]) => (
            <span key={l} className="flex items-center gap-1.5 text-ink-2"><i className="h-3 w-3 rounded" style={{ background: c }} />{l}</span>
          ))}
        </div>
        <Hint>
          {cb ? (
            <>With <b>content-box</b>, padding and border are <b>added</b> to the width.<br />
              Visible width = {w} + {pad}×2 + {bor}×2 = <b>{visW}px</b> · visible height = <b>{visH}px</b><br />
              Total space taken (with margin) = {visW} + {mar}×2 = <b>{visW + 2 * mar}px</b></>
          ) : (
            <>With <b>border-box</b>, padding and border fit <b>inside</b> the width, so the box stays exactly <b>{w}px</b> wide; the content shrinks to <b>{cw}px</b>.<br />
              Total space taken (with margin) = {w} + {mar}×2 = <b>{w + 2 * mar}px</b></>
          )}
        </Hint>
        <CodeBlock code={css} lang="css" className="!my-0" />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Layout lab: Flexbox · Grid · Position                               */
/* ================================================================== */
type LTab = 'flex' | 'grid' | 'position';
export function LayoutLabSim() {
  const [tab, setTab] = useState<LTab>('flex');
  return (
    <div>
      <Tabs<LTab> tabs={[{ id: 'flex', label: 'Flexbox' }, { id: 'grid', label: 'CSS Grid' }, { id: 'position', label: 'Position' }]} value={tab} onChange={setTab} />
      {tab === 'flex' && <FlexLab />}
      {tab === 'grid' && <GridLab />}
      {tab === 'position' && <PositionLab />}
    </div>
  );
}

function FlexLab() {
  const [dir, setDir] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [jc, setJc] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start');
  const [ai, setAi] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>('center');
  const [wrap, setWrap] = useState<'nowrap' | 'wrap'>('nowrap');
  const [gap, setGap] = useState(10);
  const [n, setN] = useState(4);
  const [grow, setGrow] = useState(false);
  const col = dir.startsWith('column');
  const css = `.container {\n  display: flex;\n  flex-direction: ${dir};\n  justify-content: ${jc};\n  align-items: ${ai};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}${grow ? '\n.item1 { flex-grow: 1; }' : ''}`;
  return (
    <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
      <div className="space-y-3">
        <Seg label="flex-direction" options={['row', 'row-reverse', 'column', 'column-reverse'] as const} value={dir} onChange={setDir} />
        <Seg label="justify-content (main axis)" options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const} value={jc} onChange={setJc} />
        <Seg label="align-items (cross axis)" options={['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const} value={ai} onChange={setAi} />
        <Seg label="flex-wrap" options={['nowrap', 'wrap'] as const} value={wrap} onChange={setWrap} />
        <Slider label="gap" value={gap} min={0} max={40} onChange={setGap} />
        <div className="flex items-end justify-between"><Stepper label="Items" value={n} min={1} max={10} onChange={setN} /><Toggle label="item 1: flex-grow" checked={grow} onChange={setGrow} /></div>
      </div>
      <div className="min-w-0 space-y-3">
        <div className="h-[260px] overflow-auto rounded-xl border-2 border-dashed border-teal-400/60 bg-teal-500/[.04] p-2 transition-all"
          style={{ display: 'flex', flexDirection: dir, justifyContent: jc, alignItems: ai, flexWrap: wrap, gap }}>
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-md transition-all duration-300"
              style={{
                background: ITEM_COLORS[i % 10], flexGrow: grow && i === 0 ? 1 : 0,
                minWidth: col ? undefined : 56, width: col && ai !== 'stretch' ? 60 + (i % 3) * 30 : undefined,
                minHeight: 36, height: !col && ai !== 'stretch' ? 40 + (i % 3) * 18 : undefined, padding: '0 10px', fontSize: 14 + (i % 2) * 4,
              }}>{i + 1}</div>
          ))}
        </div>
        <Hint>Main axis = <b>{col ? 'vertical ↕' : 'horizontal ↔'}</b> (set by flex-direction). <b>justify-content</b> works along the main axis; <b>align-items</b> works across it. Add more items and switch on <b>wrap</b> to see them flow onto new lines.</Hint>
        <CodeBlock code={css} lang="css" className="!my-0" />
      </div>
    </div>
  );
}

const TEMPLATES = ['1fr 1fr 1fr', 'repeat(4, 1fr)', '1fr 2fr 1fr', '150px 1fr', 'repeat(auto-fit, minmax(90px, 1fr))'] as const;
function GridLab() {
  const [tpl, setTpl] = useState<(typeof TEMPLATES)[number]>('1fr 1fr 1fr');
  const [gap, setGap] = useState(10);
  const [n, setN] = useState(7);
  const [span, setSpan] = useState(true);
  const [rowSpan, setRowSpan] = useState(false);
  const css = `.grid {\n  display: grid;\n  grid-template-columns: ${tpl};\n  gap: ${gap}px;\n}${span || rowSpan ? `\n.item1 {${span ? ' grid-column: span 2;' : ''}${rowSpan ? ' grid-row: span 2;' : ''} }` : ''}`;
  return (
    <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
      <div className="space-y-3">
        <div>
          <div className="label">grid-template-columns</div>
          <div className="space-y-1">
            {TEMPLATES.map((t) => (
              <button key={t} onClick={() => setTpl(t)} className={`block w-full rounded-lg border px-2.5 py-1.5 text-left font-mono text-[11px] font-semibold transition ${tpl === t ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'border-line text-muted hover:text-ink'}`}>{t}</button>
            ))}
          </div>
        </div>
        <Slider label="gap" value={gap} min={0} max={30} onChange={setGap} />
        <Stepper label="Items" value={n} min={1} max={12} onChange={setN} />
        <Toggle label="item 1: grid-column: span 2" checked={span} onChange={setSpan} />
        <Toggle label="item 1: grid-row: span 2" checked={rowSpan} onChange={setRowSpan} />
      </div>
      <div className="min-w-0 space-y-3">
        <div className="min-h-[240px] rounded-xl border-2 border-dashed border-teal-400/60 bg-teal-500/[.04] p-2" style={{ display: 'grid', gridTemplateColumns: tpl, gap }}>
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="flex min-h-[56px] items-center justify-center rounded-lg font-bold text-white shadow-md transition-all"
              style={{ background: ITEM_COLORS[i % 10], gridColumn: i === 0 && span ? 'span 2' : undefined, gridRow: i === 0 && rowSpan ? 'span 2' : undefined }}>{i + 1}</div>
          ))}
        </div>
        <Hint><b>fr</b> = a fraction of the free space. <b>repeat(4, 1fr)</b> makes four equal columns, and <b>auto-fit + minmax()</b> creates as many columns as fit — a responsive grid without media queries!</Hint>
        <CodeBlock code={css} lang="css" className="!my-0" />
      </div>
    </div>
  );
}

const POS_INFO = {
  static: 'Default. The box sits in the normal flow; top and left are ignored.',
  relative: 'The box moves from its normal position, but its original space is kept (notice the gap).',
  absolute: 'The box leaves the flow (others close the gap) and is placed relative to the nearest positioned ancestor. It scrolls with the content.',
  fixed: 'The box is pinned to the viewport (here: the frame). Scroll inside the frame — it does not move!',
  sticky: 'The box behaves normally until you scroll it to top: ' + '…px, then it sticks. Scroll inside the frame to see.',
} as const;
type PosT = keyof typeof POS_INFO;

function PositionLab() {
  const [pos, setPos] = useState<PosT>('relative');
  const [top, setTop] = useState(20);
  const [left, setLeft] = useState(40);
  const info = useMemo(() => (pos === 'sticky' ? `The box behaves normally until it is scrolled to ${top}px from the top of its container — then it sticks. Scroll inside the frame to see.` : POS_INFO[pos]), [pos, top]);
  const css = `.box {\n  position: ${pos};\n  top: ${top}px;${pos === 'sticky' ? '' : `\n  left: ${left}px;`}\n  z-index: 10;\n}`;
  return (
    <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
      <div className="space-y-3">
        <Seg label="position" options={['static', 'relative', 'absolute', 'fixed', 'sticky'] as const} value={pos} onChange={setPos} />
        <Slider label="top" value={top} min={0} max={120} onChange={setTop} />
        {pos !== 'sticky' && <Slider label="left" value={left} min={0} max={200} onChange={setLeft} />}
        <Hint>{info}</Hint>
      </div>
      <div className="min-w-0 space-y-3">
        <div className="relative h-[280px] overflow-hidden rounded-xl border border-line bg-white" style={{ transform: 'translateZ(0)' }}>
          <div className="h-full overflow-y-auto">
            <div className="relative space-y-2 p-3 text-sm text-slate-600" style={{ minHeight: 640 }}>
              <div className="rounded-lg bg-slate-200 p-3 font-semibold">Box A (static)</div>
              <div className="rounded-lg bg-violet-600 p-3 font-bold text-white shadow-lg ring-4 ring-violet-300 transition-all duration-300"
                style={{ position: pos, top, left: pos === 'sticky' ? undefined : left, zIndex: 10, width: 170 }}>🎯 .box ({pos})</div>
              <div className="rounded-lg bg-slate-200 p-3 font-semibold">Box C (static)</div>
              {Array.from({ length: 8 }, (_, i) => <p key={i} className="rounded bg-slate-100 p-2">Scroll down ↓ — filler paragraph {i + 1} to make this frame scrollable.</p>)}
            </div>
          </div>
        </div>
        <CodeBlock code={css} lang="css" className="!my-0" />
      </div>
    </div>
  );
}
