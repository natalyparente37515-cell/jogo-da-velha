import { ThemeConfig, SymbolPack } from '../types/game';

export const THEMES: ThemeConfig[] = [
  {
    id: 'nebula',
    name: 'Nebula',
    xColor: 'text-indigo-400 dark:text-indigo-400',
    oColor: 'text-rose-400 dark:text-rose-400',
    accentBg: 'bg-indigo-600',
    boardBg: 'bg-slate-900/80 border-slate-800/80',
    cellBg: 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60',
    hoverCellBg: 'hover:border-indigo-500/50',
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    xColor: 'text-emerald-400 dark:text-emerald-400',
    oColor: 'text-amber-400 dark:text-amber-400',
    accentBg: 'bg-emerald-600',
    boardBg: 'bg-zinc-900/80 border-zinc-800/80',
    cellBg: 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700/60',
    hoverCellBg: 'hover:border-emerald-500/50',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    xColor: 'text-cyan-400 dark:text-cyan-400',
    oColor: 'text-fuchsia-400 dark:text-fuchsia-400',
    accentBg: 'bg-cyan-500',
    boardBg: 'bg-neutral-950 border-cyan-950/80',
    cellBg: 'bg-neutral-900/90 hover:bg-neutral-800 border-cyan-900/40',
    hoverCellBg: 'hover:border-cyan-400/60',
  },
];

export const SYMBOL_PACKS: SymbolPack[] = [
  { id: 'classic', name: 'X / O', x: '✕', o: '◯' },
  { id: 'elements', name: 'Fogo & Gelo', x: '🔥', o: '❄️' },
  { id: 'celestial', name: 'Sol & Lua', x: '☀️', o: '🌙' },
  { id: 'arcade', name: 'Gamer', x: '👾', o: '🚀' },
  { id: 'spark', name: 'Coração & Estrela', x: '💖', o: '⭐' },
];
