import { ch1, ch2, ch3, ch4 } from './chapters-a';
import { ch5, ch6, ch7, ch8 } from './chapters-b';
import { ch9, ch10, ch11, ch12 } from './chapters-c';
import type { Chapter } from './types';

export const chapters: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12];

export const units = [
  { num: 1, title: 'Web Basics & HTML', desc: 'How the web works and how to structure content with HTML.' },
  { num: 2, title: 'Styling with CSS', desc: 'Colours, typography, the box model, layouts and responsive design.' },
  { num: 3, title: 'Interactivity & Design', desc: 'JavaScript behaviour, UI/UX principles and the design process.' },
];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);

export const chapterSections = (c: Chapter) =>
  c.blocks.filter((b): b is { type: 'h2'; text: string } => b.type === 'h2').map((b) => b.text);

export const totalMinutes = chapters.reduce((s, c) => s + c.minutes, 0);
