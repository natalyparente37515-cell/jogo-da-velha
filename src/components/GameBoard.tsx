import { useState } from 'react';
import { Player, CellValue, BoardSize, SymbolPack } from '../types/game';
import { motion, AnimatePresence } from 'motion/react';

interface GameBoardProps {
  board: CellValue[];
  size: BoardSize;
  currentTurn: Player;
  winnerLine: number[] | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
  symbols: SymbolPack;
  oldestXPieceIndex: number | null;
  oldestOPieceIndex: number | null;
  isInfiniteMode: boolean;
}

export function GameBoard({
  board,
  size,
  currentTurn,
  winnerLine,
  disabled,
  onCellClick,
  symbols,
  oldestXPieceIndex,
  oldestOPieceIndex,
  isInfiniteMode,
}: GameBoardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getSymbol = (val: Player) => (val === 'X' ? symbols.x : symbols.o);

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto aspect-square p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm">
      {/* Grid container */}
      <div
        className={`w-full h-full grid gap-2.5 sm:gap-3 ${
          size === 4 ? 'grid-cols-4 grid-rows-4' : 'grid-cols-3 grid-rows-3'
        }`}
      >
        {board.map((cell, idx) => {
          const isWinningCell = winnerLine?.includes(idx);
          const isOldestX = isInfiniteMode && idx === oldestXPieceIndex;
          const isOldestO = isInfiniteMode && idx === oldestOPieceIndex;
          const isOldest = isOldestX || isOldestO;
          const isCellEmpty = cell === null;
          const canClick = isCellEmpty && !disabled;

          return (
            <button
              key={idx}
              type="button"
              disabled={!canClick}
              onClick={() => onCellClick(idx)}
              onMouseEnter={() => canClick && setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`Casa ${idx + 1}, ${cell ? `marcada com ${cell}` : 'vazia'}`}
              className={`relative flex items-center justify-center rounded-2xl transition-all duration-150 select-none outline-none group ${
                isWinningCell
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.03]'
                  : isOldest
                  ? 'bg-amber-950/20 border-2 border-dashed border-amber-500/50 hover:bg-slate-800/80'
                  : 'bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
              } ${
                canClick ? 'cursor-pointer active:scale-95' : 'cursor-default'
              }`}
            >
              {/* Infinite mode indicator: warns which piece is oldest */}
              {isOldest && !winnerLine && (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1 rounded tracking-tighter">
                  expira
                </span>
              )}

              {/* Placed symbol */}
              <AnimatePresence mode="wait">
                {cell && (
                  <motion.span
                    key={`${idx}-${cell}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 24,
                    }}
                    className={`font-display font-black leading-none ${
                      size === 4 ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'
                    } ${
                      cell === 'X'
                        ? isWinningCell
                          ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                          : isOldestX
                          ? 'text-indigo-400/60'
                          : 'text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                        : isWinningCell
                        ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                        : isOldestO
                        ? 'text-rose-400/60'
                        : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    }`}
                  >
                    {getSymbol(cell)}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Ghost preview on hover */}
              {!cell && hoveredIndex === idx && canClick && (
                <span
                  className={`font-display font-bold leading-none opacity-30 transition-opacity pointer-events-none ${
                    size === 4 ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'
                  } ${currentTurn === 'X' ? 'text-indigo-400' : 'text-rose-400'}`}
                >
                  {getSymbol(currentTurn)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
