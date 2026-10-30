import type { Lang } from '../lib/highlight';
import type { ColorKey } from '../lib/palette';

export type SimId =
  | 'web-works' | 'url-anatomy' | 'dom-tree' | 'table-builder' | 'form-builder' | 'selector-lab' | 'color-lab'
  | 'typography' | 'box-model' | 'layout-lab' | 'responsive' | 'js-dom' | 'design-principles';

export type DiagramId = 'client-server' | 'element-anatomy' | 'html-structure' | 'css-syntax' | 'box-model' | 'semantic-layout' | 'web-process';

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; lang: Lang; code: string; title?: string }
  | { type: 'tryit'; title: string; html: string; css?: string; js?: string; height?: number }
  | { type: 'callout'; variant: 'info' | 'tip' | 'warning' | 'fact'; title?: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'sim'; id: SimId }
  | { type: 'cards'; items: { title: string; text: string; icon?: string }[] }
  | { type: 'compare'; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'diagram'; id: DiagramId; caption?: string };

export interface Chapter {
  id: string;
  num: number;
  unit: number;
  title: string;
  short: string;
  tagline: string;
  color: ColorKey;
  icon: string;
  image: string;
  minutes: number;
  objectives: string[];
  blocks: Block[];
  summary: string[];
  exercises: { q: string; a: string }[];
}

/* ---------- Compact content builders ---------- */
export const h2 = (text: string): Block => ({ type: 'h2', text });
export const h3 = (text: string): Block => ({ type: 'h3', text });
export const p = (text: string): Block => ({ type: 'p', text });
export const ul = (...items: string[]): Block => ({ type: 'list', items });
export const ol = (...items: string[]): Block => ({ type: 'list', items, ordered: true });
export const code = (lang: Lang, src: string, title?: string): Block => ({ type: 'code', lang, code: src.trim(), title });
export const tryit = (title: string, html: string, css?: string, js?: string, height?: number): Block => ({
  type: 'tryit', title, html: html.trim(), css: css?.trim(), js: js?.trim(), height,
});
export const note = (variant: 'info' | 'tip' | 'warning' | 'fact', text: string, title?: string): Block => ({ type: 'callout', variant, text, title });
export const table = (headers: string[], ...rows: string[][]): Block => ({ type: 'table', headers, rows });
export const sim = (id: SimId): Block => ({ type: 'sim', id });
export const cards = (...items: [string, string, string?][]): Block => ({
  type: 'cards', items: items.map(([title, text, icon]) => ({ title, text, icon })),
});
export const compare = (lt: string, li: string[], rt: string, ri: string[]): Block => ({
  type: 'compare', left: { title: lt, items: li }, right: { title: rt, items: ri },
});
export const steps = (...items: [string, string][]): Block => ({ type: 'steps', items: items.map(([title, text]) => ({ title, text })) });
export const diagram = (id: DiagramId, caption?: string): Block => ({ type: 'diagram', id, caption });
export const img = (src: string, alt: string, caption?: string): Block => ({ type: 'image', src, alt, caption });

export const PEXELS = {
  code: 'https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  laptop: 'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  team: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  desk: 'https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  coffee: 'https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};
