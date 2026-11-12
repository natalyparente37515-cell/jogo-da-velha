import { SymbolPack } from '../types/game';
import { SYMBOL_PACKS, THEMES } from '../utils/themes';
import { X, Volume2, VolumeX, RotateCcw, Palette, Smile } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedThemeId: string;
  onSelectTheme: (id: string) => void;
  selectedSymbolId: string;
  onSelectSymbol: (symbol: SymbolPack) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onResetStats: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  selectedThemeId,
  onSelectTheme,
  selectedSymbolId,
  onSelectSymbol,
  isMuted,
  onToggleSound,
  onResetStats,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold font-display text-white">
            Personalização & Ajustes
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-sm">
          {/* Symbols Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2.5">
              <Smile className="w-4 h-4 text-indigo-400" />
              <span>Estilo dos Símbolos</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SYMBOL_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => onSelectSymbol(pack)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    selectedSymbolId === pack.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-medium">{pack.name}</span>
                  <span className="text-sm font-bold flex items-center gap-1">
                    <span>{pack.x}</span>
                    <span className="text-slate-500 text-xs">/</span>
                    <span>{pack.o}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2.5">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Tema de Cores</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    selectedThemeId === theme.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-medium text-slate-200">Efeitos Sonoros</span>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                isMuted
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isMuted ? 'Mudo' : 'Ativo'}
            </button>
          </div>

          {/* Danger zone: Reset Stats */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Deseja realmente zerar todo o placar e histórico?')) {
                  onResetStats();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-3 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zerar Placar e Histórico</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
