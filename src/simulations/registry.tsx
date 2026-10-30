import type { ComponentType } from 'react';
import type { SimId } from '../data/types';
import type { ColorKey } from '../lib/palette';
import { BoxModelSim, LayoutLabSim } from './BoxLayoutSims';
import { ColorLabSim } from './ColorLab';
import { SelectorLabSim, TypographySim } from './CssSims';
import { DesignPrinciplesSim } from './DesignSim';
import { FormBuilderSim } from './FormBuilder';
import { DomTreeSim, TableBuilderSim } from './HtmlSims';
import { JsDomSim, ResponsiveSim } from './ResponsiveJsSims';
import { UrlAnatomySim, WebWorksSim } from './WebSims';

export interface SimInfo { id: SimId; title: string; desc: string; icon: string; color: ColorKey; chapter: string; Component: ComponentType; }

export const SIMS: SimInfo[] = [
  { id: 'web-works', title: 'How the Web Works', desc: 'Watch a request travel from your browser to a DNS server and a web server, step by step.', icon: 'Network', color: 'sky', chapter: 'intro', Component: WebWorksSim },
  { id: 'url-anatomy', title: 'URL Anatomy Explorer', desc: 'Break any web address into protocol, domain, path, query and fragment with colour coding.', icon: 'Link', color: 'sky', chapter: 'intro', Component: UrlAnatomySim },
  { id: 'dom-tree', title: 'DOM Tree Visualiser', desc: 'Type HTML and see the live Document Object Model tree with parents, children and siblings.', icon: 'Network', color: 'orange', chapter: 'html-basics', Component: DomTreeSim },
  { id: 'table-builder', title: 'Table Builder', desc: 'Build a table visually, merge cells with colspan and rowspan and copy the generated HTML.', icon: 'Table', color: 'amber', chapter: 'tables', Component: TableBuilderSim },
  { id: 'form-builder', title: 'Form Builder & Submit Simulator', desc: 'Add form controls, submit the form and see exactly what GET or POST sends to the server.', icon: 'ClipboardList', color: 'violet', chapter: 'forms', Component: FormBuilderSim },
  { id: 'selector-lab', title: 'CSS Selector Lab', desc: 'Type any CSS selector to highlight matching elements and calculate its specificity.', icon: 'Target', color: 'pink', chapter: 'css-basics', Component: SelectorLabSim },
  { id: 'color-lab', title: 'Colour Lab', desc: 'Mix RGB colours, explore colour harmonies, check contrast for accessibility and make gradients.', icon: 'Palette', color: 'fuchsia', chapter: 'colors-type', Component: ColorLabSim },
  { id: 'typography', title: 'Typography Tester', desc: 'Experiment with fonts, sizes, weights, spacing and alignment and copy the CSS.', icon: 'Type', color: 'fuchsia', chapter: 'colors-type', Component: TypographySim },
  { id: 'box-model', title: 'Box Model Simulator', desc: 'Adjust width, padding, border and margin and watch the total size being calculated.', icon: 'Box', color: 'teal', chapter: 'box-layout', Component: BoxModelSim },
  { id: 'layout-lab', title: 'Layout Lab: Flexbox, Grid & Position', desc: 'Play with every Flexbox, Grid and position property and see the layout update instantly.', icon: 'LayoutGrid', color: 'teal', chapter: 'box-layout', Component: LayoutLabSim },
  { id: 'responsive', title: 'Responsive Device Simulator', desc: 'Preview one page on mobile, tablet, laptop and desktop and see which media query is active.', icon: 'MonitorSmartphone', color: 'cyan', chapter: 'responsive', Component: ResponsiveSim },
  { id: 'js-dom', title: 'JavaScript DOM Playground', desc: 'Run real JavaScript on a mini page: change text, styles and elements and log events.', icon: 'Braces', color: 'yellow', chapter: 'javascript', Component: JsDomSim },
  { id: 'design-principles', title: 'Design Principles Studio', desc: 'Switch on contrast, hierarchy, alignment, proximity, repetition and white space to fix a bad design.', icon: 'Sparkles', color: 'indigo', chapter: 'ui-ux', Component: DesignPrinciplesSim },
];

export const simById = (id: string) => SIMS.find((s) => s.id === id);
