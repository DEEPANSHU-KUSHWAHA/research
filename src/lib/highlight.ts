// Lightweight syntax highlighter for HTML, CSS and JavaScript (no dependencies).
export type Lang = 'html' | 'css' | 'js';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (c: string, s: string) => `<span class="t-${c}">${s}</span>`;

const JS_KW = new Set([
  'var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'new', 'this',
  'class', 'extends', 'import', 'export', 'from', 'default', 'switch', 'case', 'try', 'catch', 'finally', 'throw',
  'typeof', 'instanceof', 'in', 'of', 'async', 'await', 'true', 'false', 'null', 'undefined',
]);

export function highlightJS(src: string): string {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;
  let out = '';
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[1]) out += span('cm', esc(m[1]));
    else if (m[2]) out += span('str', esc(m[2]));
    else if (m[3]) out += span('num', m[3]);
    else if (m[4]) {
      const w = m[4];
      if (JS_KW.has(w)) out += span('kw', w);
      else if (src[re.lastIndex] === '(') out += span('fn', w);
      else if (src[m.index - 1] === '.') out += span('prop', w);
      else out += w;
    } else if (m[5]) out += m[5];
    else out += esc(m[6]);
  }
  return out;
}

function cssMode(src: string, from: number): 'sel' | 'prop' {
  for (let i = from; i < src.length; i++) {
    const c = src[i];
    if (c === '{') return 'sel';
    if (c === ';' || c === '}') return 'prop';
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      if (e === -1) break;
      i = e + 1;
    }
  }
  return 'prop';
}

export function highlightCSS(src: string): string {
  const re = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([{}:;,()])|(\s+)|([^\s{}:;,()"']+)/g;
  let out = '';
  let mode: 'sel' | 'prop' | 'val' = cssMode(src, 0);
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const [, cm, str, pn, ws, word] = m;
    if (cm) out += span('cm', esc(cm));
    else if (ws) out += ws;
    else if (str) out += span('str', esc(str));
    else if (pn) {
      if (pn === '{' || pn === '}' || pn === ';') {
        out += span('pn', pn);
        mode = cssMode(src, re.lastIndex);
      } else if (pn === ':' && mode === 'prop') {
        out += span('pn', pn);
        mode = 'val';
      } else out += mode === 'sel' ? span('sel', esc(pn)) : span('pn', esc(pn));
    } else if (word) {
      if (mode === 'sel') out += word.startsWith('@') ? span('kw', esc(word)) : span('sel', esc(word));
      else if (mode === 'prop') out += span('prop', esc(word));
      else if (/^(#[0-9a-fA-F]{3,8}|-?\.?\d[\d.]*[a-z%]*)$/.test(word)) out += span('num', esc(word));
      else if (word === '!important') out += span('kw', word);
      else out += span('val', esc(word));
    }
  }
  return out;
}

function renderTag(tok: string): string {
  const m = /^<(\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)$/.exec(tok);
  if (!m) return esc(tok);
  const attrs = m[3].replace(
    /(\s+)|([^\s=]+)(\s*=\s*)?("[^"]*"|'[^']*'|[^\s"']+)?/g,
    (_all: string, ws?: string, name?: string, eq?: string, val?: string) => {
      if (ws) return ws;
      if (!name) return '';
      return span('attr', esc(name)) + (eq ? esc(eq) + span('str', esc(val ?? '')) : '');
    },
  );
  return span('tag', esc('<' + m[1])) + span('name', m[2]) + attrs + span('tag', esc(m[4]));
}

export function highlightHTML(src: string): string {
  const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][\w-]*(?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>/gi;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('<!-')) out += span('cm', esc(tok));
    else if (tok[1] === '!') out += span('dt', esc(tok));
    else {
      out += renderTag(tok);
      const nm = /^<([a-zA-Z][\w-]*)/.exec(tok);
      const name = nm ? nm[1].toLowerCase() : '';
      if (name === 'style' || name === 'script') {
        const close = src.toLowerCase().indexOf('</' + name, re.lastIndex);
        const end = close === -1 ? src.length : close;
        const inner = src.slice(re.lastIndex, end);
        out += name === 'style' ? highlightCSS(inner) : highlightJS(inner);
        re.lastIndex = end;
      }
    }
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

export function highlight(code: string, lang: Lang): string {
  if (lang === 'html') return highlightHTML(code);
  if (lang === 'css') return highlightCSS(code);
  return highlightJS(code);
}
