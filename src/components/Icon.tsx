import type { CSSProperties } from 'react';
import {
  Atom, BookOpen, Box, Braces, Brain, CircleCheck, ClipboardList, CodeXml, Eye, FileCode, FileText, FlaskConical, Globe,
  Hash, Image, Layers, LayoutGrid, LayoutTemplate, Link, ListChecks, Minus, MonitorSmartphone, MousePointerClick,
  Network, Paintbrush, Palette, PenTool, Puzzle, RefreshCw, Server, Sparkles, Table, Target, Type, Zap, Gauge, Terminal,
  type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  Atom, BookOpen, Box, Braces, Brain, CircleCheck, ClipboardList, CodeXml, Eye, FileCode, FileText, FlaskConical, Globe,
  Hash, Image, Layers, LayoutGrid, LayoutTemplate, Link, ListChecks, Minus, MonitorSmartphone, MousePointerClick,
  Network, Paintbrush, Palette, PenTool, Puzzle, RefreshCw, Server, Sparkles, Table, Target, Type, Zap, Gauge, Terminal,
};

export function Icon({ name, className, style }: { name?: string; className?: string; style?: CSSProperties }) {
  const C = (name && map[name]) || Sparkles;
  return <C className={className} style={style} />;
}
