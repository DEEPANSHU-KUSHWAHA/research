export const palette = {
  sky: { grad: 'from-sky-500 to-blue-600', text: 'text-sky-600 dark:text-sky-400', soft: 'bg-sky-500/10', hex: '#0ea5e9' },
  orange: { grad: 'from-orange-500 to-amber-500', text: 'text-orange-600 dark:text-orange-400', soft: 'bg-orange-500/10', hex: '#f97316' },
  rose: { grad: 'from-rose-500 to-pink-600', text: 'text-rose-600 dark:text-rose-400', soft: 'bg-rose-500/10', hex: '#f43f5e' },
  emerald: { grad: 'from-emerald-500 to-teal-600', text: 'text-emerald-600 dark:text-emerald-400', soft: 'bg-emerald-500/10', hex: '#10b981' },
  amber: { grad: 'from-amber-500 to-orange-600', text: 'text-amber-600 dark:text-amber-400', soft: 'bg-amber-500/10', hex: '#f59e0b' },
  violet: { grad: 'from-violet-500 to-purple-600', text: 'text-violet-600 dark:text-violet-400', soft: 'bg-violet-500/10', hex: '#8b5cf6' },
  pink: { grad: 'from-pink-500 to-fuchsia-600', text: 'text-pink-600 dark:text-pink-400', soft: 'bg-pink-500/10', hex: '#ec4899' },
  fuchsia: { grad: 'from-fuchsia-500 to-purple-600', text: 'text-fuchsia-600 dark:text-fuchsia-400', soft: 'bg-fuchsia-500/10', hex: '#d946ef' },
  teal: { grad: 'from-teal-500 to-cyan-600', text: 'text-teal-600 dark:text-teal-400', soft: 'bg-teal-500/10', hex: '#14b8a6' },
  cyan: { grad: 'from-cyan-500 to-sky-600', text: 'text-cyan-600 dark:text-cyan-400', soft: 'bg-cyan-500/10', hex: '#06b6d4' },
  yellow: { grad: 'from-yellow-400 to-amber-500', text: 'text-yellow-600 dark:text-yellow-400', soft: 'bg-yellow-500/10', hex: '#eab308' },
  indigo: { grad: 'from-indigo-500 to-violet-600', text: 'text-indigo-600 dark:text-indigo-400', soft: 'bg-indigo-500/10', hex: '#6366f1' },
} as const;

export type ColorKey = keyof typeof palette;
