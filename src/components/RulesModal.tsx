import { X, Award, Sparkles, Cpu, Keyboard } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold font-display text-white">
            Como Jogar & Modos
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>Modo Clássico (3×3)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O objetivo clássico: seja o primeiro a alinhar 3 de seus símbolos em uma linha horizontal, vertical ou diagonal. Se todas as 9 casas forem preenchidas sem vencedor, ocorre empate (a famosa "deu velha").
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Modo Infinito (Limite de 3 Peças)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uma variação dinâmica e moderna! Cada jogador pode ter no máximo <strong>3 peças</strong> ativas no tabuleiro. Ao colocar sua 4ª peça, a peça mais antiga que você colocou desaparece automaticamente. Nunca há empate!
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <Cpu className="w-4 h-4" />
              <span>Níveis da Inteligência Artificial (IA)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong>Fácil:</strong> Joga de forma descontraída com lances casuais.<br />
              • <strong>Médio:</strong> Tenta bloquear suas vitórias e aproveita erros evidentes.<br />
              • <strong>Imbatível:</strong> Usa o algoritmo matemático <em>Minimax</em>. É impossível vencer se ela não cometer falha lógica; seu desafio é conseguir um empate!
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Keyboard className="w-4 h-4" />
              <span>Atalhos do Teclado</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Você pode usar as teclas de <strong>1 a 9</strong> do teclado numérico ou da linha numérica superior para jogar rapidamente nas casas correspondentes. Pressione <strong>R</strong> para reiniciar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Entendi, vamos jogar!
          </button>
        </div>
      </div>
    </div>
  );
}
