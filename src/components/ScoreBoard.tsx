import { useState } from 'react';
import { Player, GameStats, GameMode, SymbolPack } from '../types/game';
import { Bot, User, Flame, Edit2, Check } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
  turn: Player;
  mode: GameMode;
  p1Name: string;
  p2Name: string;
  onUpdateNames: (p1: string, p2: string) => void;
  symbols: SymbolPack;
  isAiThinking: boolean;
  themeId: string;
}

export function ScoreBoard({
  stats,
  turn,
  mode,
  p1Name,
  p2Name,
  onUpdateNames,
  symbols,
  isAiThinking,
}: ScoreBoardProps) {
  const [editing, setEditing] = useState(false);
  const [tempP1, setTempP1] = useState(p1Name);
  const [tempP2, setTempP2] = useState(p2Name);

  const saveNames = () => {
    onUpdateNames(tempP1.trim() || 'Jogador 1', tempP2.trim() || (mode === 'ai' ? 'Robô IA' : 'Jogador 2'));
    setEditing(false);
  };

  const isP1Turn = turn === 'X';
  const isP2Turn = turn === 'O';

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Name editor inline */}
      {editing ? (
        <div className="flex items-center gap-2 mb-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-sm">
          <input
            type="text"
            maxLength={14}
            value={tempP1}
            onChange={(e) => setTempP1(e.target.value)}
            className="flex-1 bg-slate-800 text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-indigo-500"
            placeholder="Nome do Jogador 1"
          />
          <span className="text-slate-500 text-xs font-bold">VS</span>
          <input
            type="text"
            maxLength={14}
            value={tempP2}
            onChange={(e) => setTempP2(e.target.value)}
            disabled={mode === 'ai'}
            className="flex-1 bg-slate-800 text-slate-100 px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            placeholder={mode === 'ai' ? 'Robô IA' : 'Nome do Jogador 2'}
          />
          <button
            onClick={saveNames}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Salvar
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end mb-1">
          <button
            onClick={() => {
              setTempP1(p1Name);
              setTempP2(p2Name);
              setEditing(true);
            }}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" /> Editar nomes
          </button>
        </div>
      )}

      {/* Main HUD Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 items-stretch">
        {/* Player 1 Card */}
        <div
          className={`relative p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            isP1Turn
              ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10 scale-[1.02]'
              : 'bg-slate-900/60 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <User className="w-3 h-3" />
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate">
                {p1Name}
              </span>
            </div>
            <span className="text-base font-bold text-indigo-400 leading-none">
              {symbols.x}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tabular-nums">
              {stats.xWins}
            </span>
            {isP1Turn && (
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Sua vez
              </span>
            )}
          </div>
        </div>

        {/* Center Draw / Streak info */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-slate-400 font-medium">Empates</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-display tabular-nums">
            {stats.draws}
          </span>
          {stats.streak.count >= 2 && stats.streak.player && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400 font-medium mt-1">
              <Flame className="w-3 h-3 animate-pulse" />
              <span>{stats.streak.count}x vitórias</span>
            </div>
          )}
        </div>

        {/* Player 2 / AI Card */}
        <div
          className={`relative p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
            isP2Turn
              ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-500/10 scale-[1.02]'
              : 'bg-slate-900/60 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                {mode === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate">
                {p2Name}
              </span>
            </div>
            <span className="text-base font-bold text-rose-400 leading-none">
              {symbols.o}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tabular-nums">
              {stats.oWins}
            </span>
            {isP2Turn && (
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                {isAiThinking ? 'Pensando...' : 'Sua vez'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
