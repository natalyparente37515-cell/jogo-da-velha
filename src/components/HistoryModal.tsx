import { RoundHistory, Player } from '../types/game';
import { X, Trophy, Trash2, Clock } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RoundHistory[];
  onClearHistory: () => void;
  p1Name: string;
  p2Name: string;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onClearHistory,
  p1Name,
  p2Name,
}: HistoryModalProps) {
  if (!isOpen) return null;

  const getWinnerLabel = (winner: Player | 'draw') => {
    if (winner === 'draw') return 'Empate';
    return winner === 'X' ? p1Name : p2Name;
  };

  const getModeLabel = (mode: string) => {
    if (mode === 'ai') return 'Robô IA';
    if (mode === 'infinite') return 'Modo Infinito';
    return '2 Jogadores';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">
              Histórico de Partidas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Nenhuma partida concluída ainda.</p>
              <p className="text-xs text-slate-600 mt-1">Jogue uma rodada para ver o histórico aqui!</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">
                    {item.winner === 'draw' ? (
                      <span className="text-slate-400">Deu Empate!</span>
                    ) : (
                      <span className={item.winner === 'X' ? 'text-indigo-400' : 'text-rose-400'}>
                        Vitória: {getWinnerLabel(item.winner)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{getModeLabel(item.mode)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.boardSize}×{item.boardSize}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.totalMoves} jogadas</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 tabular-nums">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
