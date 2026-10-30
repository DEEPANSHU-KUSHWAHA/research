import type { ReactNode } from 'react';
import { Info, Lightbulb, Sparkles, TriangleAlert } from 'lucide-react';
import { cn } from "/utils/cn";

/** Renders **bold**, *italic* and `code` inside plain strings. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
        if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}

const VARIANTS = {
  info: { icon: Info, label: 'Note', cls: 'border-sky-500/30 bg-sky-500/[.07]', ic: 'text-sky-500' },
  tip: { icon: Lightbulb, label: 'Tip', cls: 'border-emerald-500/30 bg-emerald-500/[.07]', ic: 'text-emerald-500' },
  warning: { icon: TriangleAlert, label: 'Caution', cls: 'border-amber-500/40 bg-amber-500/[.08]', ic: 'text-amber-500' },
  fact: { icon: Sparkles, label: 'Did you know?', cls: 'border-fuchsia-500/30 bg-fuchsia-500/[.07]', ic: 'text-fuchsia-500' },
} as const;

export function Callout({ variant, title, text }: { variant: keyof typeof VARIANTS; title?: string; text: string }) {
  const v = VARIANTS[variant];
  const I = v.icon;
  return (
    <div className={cn('avoid-break my-6 flex gap-3 rounded-2xl border p-4 sm:p-5', v.cls)}>
      <I className={cn('mt-0.5 h-5 w-5 shrink-0', v.ic)} />
      <div>
        <div className="mb-1 text-sm font-bold text-ink"><Inline text={title ?? v.label} /></div>
        <div className="text-sm leading-relaxed text-ink-2"><Inline text={text} /></div>
      </div>
    </div>
  );
}

export function PageHeader({ icon, title, subtitle, children, gradient = 'from-indigo-600 via-violet-600 to-fuchsia-600' }: {
  icon: ReactNode; title: string; subtitle: string; children?: ReactNode; gradient?: string;
}) {
  return (
    <div className={cn('relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br p-6 text-white shadow-xl sm:p-8 print:rounded-none print:p-0 print:text-ink print:shadow-none print:bg-none', gradient)}>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/30 via-black/5 to-transparent print:hidden" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl print:hidden" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-2xl print:hidden" />
      <div className="relative flex flex-wrap items-center justify-between gap-4 [text-shadow:0_1px_10px_rgba(0,0,0,.25)] print:[text-shadow:none]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur print:hidden">{icon}</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/85 sm:text-base print:text-muted">{subtitle}</p>
          </div>
        </div>
        {children && <div className="flex flex-wrap gap-2 print:hidden">{children}</div>}
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 120, stroke = 10, color = '#6366f1', children }: {
  value: number; size?: number; stroke?: number; color?: string; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-line" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))} style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
