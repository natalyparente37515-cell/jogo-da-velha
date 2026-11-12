import { GameMode, AIDifficulty, BoardSize } from '../types/game';
import { RotateCcw, HelpCircle, History, Sparkles } from 'lucide-react';

interface GameControlsProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  difficulty: AIDifficulty;
  onSelectDifficulty: (diff: AIDifficulty) => void;
  boardSize: BoardSize;
  onToggleBoardSize: (size: BoardSize) => void;
  onRestartRound: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
}

export function GameControls({
  mode,
  onSelectMode,
  difficulty,
  onSelectDifficulty,
  boardSize,
  onToggleBoardSize,
  onRestartRound,
  onOpenRules,
  onOpenHistory,
}: GameControlsProps) {
  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      {/* Game Mode Segmented Bar */}
      <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => onSelectMode('pvp')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            mode === 'pvp'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2 Jogadores
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('ai')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            mode === 'ai'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Contra Robô IA
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('infinite')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer ${
            mode === 'infinite'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Infinito (3 pcs)</span>
        </button>
      </div>

      {/* Sub-controls: AI Difficulty or Board Size */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {mode === 'ai' ? (
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl text-xs">
            <span className="text-[11px] text-slate-400 font-medium px-2">Dificuldade:</span>
            <button
              type="button"
              onClick={() => onSelectDifficulty('easy')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fácil
            </button>
            <button
              type="button"
              onClick={() => onSelectDifficulty('medium')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Médio
            </button>
            <button
              type="button"
              onClick={() => onSelectDifficulty('hard')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                difficulty === 'hard'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Imbatível
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl text-xs">
            <span className="text-[11px] text-slate-400 font-medium px-2">Grade:</span>
            <button
              type="button"
              onClick={() => onToggleBoardSize(3)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                boardSize === 3
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3×3 Clássico
            </button>
            {mode !== 'infinite' && (
              <button
                type="button"
                onClick={() => onToggleBoardSize(4)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  boardSize === 4
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                4×4 Avançado
              </button>
            )}
          </div>
        )}

        {/* Secondary actions: Reset, History, Rules */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={onRestartRound}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Reiniciar rodada atual"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Ver histórico de partidas"
          >
            <History className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Regras e como jogar"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
