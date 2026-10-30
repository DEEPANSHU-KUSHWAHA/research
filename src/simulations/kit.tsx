import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from "/utils/cn";

export function Slider({ label, value, min, max, step = 1, unit = 'px', onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted">
        <span>{label}</span><span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-ink">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  );
}

export function Seg<T extends string>({ label, options, value, onChange, className }: {
  label?: string; options: readonly T[]; value: T; onChange: (v: T) => void; className?: string;
}) {
  return (
    <div className={className}>
      {label && <div className="label">{label}</div>}
      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className={cn('rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition', value === o ? 'bg-surface text-indigo-600 shadow-sm ring-1 ring-line dark:text-indigo-300' : 'text-muted hover:text-ink')}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2.5 text-left text-sm font-semibold text-ink-2">
      <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition', checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </span>
      {label}
    </button>
  );
}

export function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex items-center gap-1">
        <button className="icon-btn h-8 w-8 border border-line" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}><Minus className="h-3.5 w-3.5" /></button>
        <span className="w-8 text-center font-mono text-sm font-bold text-ink">{value}</span>
        <button className="icon-btn h-8 w-8 border border-line" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}><Plus className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={cn('rounded-full px-4 py-1.5 text-sm font-semibold transition', value === t.id ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25' : 'bg-surface-2 text-muted hover:text-ink')}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[.06] p-3 text-sm leading-relaxed text-ink-2">{children}</div>;
}

export const ITEM_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];
