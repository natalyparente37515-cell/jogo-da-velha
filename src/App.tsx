/**
 * Jogo da Velha (Tic-Tac-Toe) - Web Application
 * Includes PvP, AI (with Minimax), Infinite 3-piece mode, audio FX & stats.
 */

import { useState, useEffect, useCallback } from 'react';
import { Player, CellValue, GameMode, AIDifficulty, BoardSize, GameStats, RoundHistory, SymbolPack } from './types/game';
import { checkWinner, isBoardFull, getAIMove } from './utils/gameLogic';
import { sound } from './utils/audio';
import { THEMES, SYMBOL_PACKS } from './utils/themes';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { RulesModal } from './components/RulesModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { Trophy, RefreshCw, Volume2, VolumeX, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Game Configuration State
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('hard');
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [themeId, setThemeId] = useState<string>('nebula');
  const [symbolPack, setSymbolPack] = useState<SymbolPack>(SYMBOL_PACKS[0]);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getIsMuted());

  // Names
  const [p1Name, setP1Name] = useState<string>('Você');
  const [p2Name, setP2Name] = useState<string>('Robô IA');

  // Board State
  const [board, setBoard] = useState<CellValue[]>(() => Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [triggerConfetti, setTriggerConfetti] = useState<boolean>(false);

  // Infinite mode piece queues (stores cell indices)
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);

  // Statistics & History
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('tictactoe_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      xWins: 0,
      oWins: 0,
      draws: 0,
      streak: { player: null, count: 0 },
    };
  });

  const [history, setHistory] = useState<RoundHistory[]>(() => {
    try {
      const saved = localStorage.getItem('tictactoe_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Modals
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Persist stats and history
  useEffect(() => {
    try {
      localStorage.setItem('tictactoe_stats', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('tictactoe_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Adjust default player 2 name when switching modes
  const handleSelectMode = (newMode: GameMode) => {
    sound.playClick();
    setMode(newMode);
    if (newMode === 'ai') {
      setP2Name('Robô IA');
      setBoardSize(3); // Standard 3x3 for AI
    } else {
      if (p2Name === 'Robô IA') setP2Name('Jogador 2');
    }
    resetRound(boardSize, newMode);
  };

  // Reset current round
  const resetRound = useCallback((size: BoardSize = boardSize, currentMode: GameMode = mode) => {
    setBoard(Array(size * size).fill(null));
    setTurn('X');
    setWinnerInfo(null);
    setIsDraw(false);
    setIsAiThinking(false);
    setTriggerConfetti(false);
    setXMoves([]);
    setOMoves([]);
  }, [boardSize, mode]);

  // Handle cell click / move placement
  const handleCellClick = useCallback((index: number) => {
    if (board[index] !== null || winnerInfo !== null || isDraw || isAiThinking) {
      return;
    }

    const currentTurn = turn;
    let nextXMoves = [...xMoves];
    let nextOMoves = [...oMoves];
    const newBoard = [...board];

    // Play move sound
    if (currentTurn === 'X') {
      sound.playMoveX();
    } else {
      sound.playMoveO();
    }

    // Handle Infinite Mode: remove 4th oldest piece
    if (mode === 'infinite') {
      if (currentTurn === 'X') {
        if (nextXMoves.length >= 3) {
          const removedIdx = nextXMoves.shift()!;
          newBoard[removedIdx] = null;
          sound.playExpire();
        }
        nextXMoves.push(index);
      } else {
        if (nextOMoves.length >= 3) {
          const removedIdx = nextOMoves.shift()!;
          newBoard[removedIdx] = null;
          sound.playExpire();
        }
        nextOMoves.push(index);
      }
    }

    newBoard[index] = currentTurn;
    setBoard(newBoard);
    setXMoves(nextXMoves);
    setOMoves(nextOMoves);

    // Check winner
    const win = checkWinner(newBoard, boardSize);
    if (win) {
      setWinnerInfo(win);
      sound.playWin();
      setTriggerConfetti(true);

      // Update stats
      setStats((prev) => {
        const isX = win.winner === 'X';
        const currentStreakCount =
          prev.streak.player === win.winner ? prev.streak.count + 1 : 1;

        return {
          ...prev,
          xWins: isX ? prev.xWins + 1 : prev.xWins,
          oWins: !isX ? prev.oWins + 1 : prev.oWins,
          streak: {
            player: win.winner,
            count: currentStreakCount,
          },
        };
      });

      // Record history
      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          winner: win.winner,
          mode,
          totalMoves: newBoard.filter(Boolean).length,
          boardSize,
        },
        ...prev.slice(0, 24),
      ]);
      return;
    }

    // Check draw
    if (isBoardFull(newBoard) && mode !== 'infinite') {
      setIsDraw(true);
      sound.playDraw();

      setStats((prev) => ({
        ...prev,
        draws: prev.draws + 1,
        streak: { player: null, count: 0 },
      }));

      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          winner: 'draw',
          mode,
          totalMoves: newBoard.filter(Boolean).length,
          boardSize,
        },
        ...prev.slice(0, 24),
      ]);
      return;
    }

    // Switch turn
    const nextTurn = currentTurn === 'X' ? 'O' : 'X';
    setTurn(nextTurn);
  }, [board, winnerInfo, isDraw, isAiThinking, turn, xMoves, oMoves, mode, boardSize]);

  // AI Turn effect
  useEffect(() => {
    if (mode === 'ai' && turn === 'O' && !winnerInfo && !isDraw) {
      setIsAiThinking(true);

      const delay = Math.floor(Math.random() * 200) + 300; // 300-500ms realistic bot response
      const timer = setTimeout(() => {
        const aiMoveIndex = getAIMove(
          [...board],
          'O',
          difficulty,
          boardSize,
          false
        );

        setIsAiThinking(false);
        if (aiMoveIndex !== -1) {
          handleCellClick(aiMoveIndex);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [mode, turn, winnerInfo, isDraw, board, difficulty, boardSize, handleCellClick]);

  // Keyboard shortcut listener (1-9 to play, R to restart)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        sound.playClick();
        resetRound();
        return;
      }

      // Check for space/enter on game over to restart
      if ((winnerInfo || isDraw) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        sound.playClick();
        resetRound();
        return;
      }

      // Map numpad and standard 1-9
      let cellIdx = -1;
      if (boardSize === 3) {
        // Standard top row 1-9
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
          // If numpad code
          if (e.code.startsWith('Numpad')) {
            const numpadMap: Record<string, number> = {
              Numpad7: 0, Numpad8: 1, Numpad9: 2,
              Numpad4: 3, Numpad5: 4, Numpad6: 5,
              Numpad1: 6, Numpad2: 7, Numpad3: 8,
            };
            cellIdx = numpadMap[e.code] ?? -1;
          } else {
            // standard number keys: 1 is top-left (0), 2 is (1)...
            cellIdx = parseInt(e.key, 10) - 1;
          }
        }
      }

      if (cellIdx >= 0 && cellIdx < board.length) {
        handleCellClick(cellIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [boardSize, board.length, handleCellClick, winnerInfo, isDraw, resetRound]);

  // Toggle Sound
  const handleToggleSound = () => {
    const newMute = sound.toggleMute();
    setIsMuted(newMute);
    if (!newMute) sound.playClick();
  };

  // Toggle Board Size
  const handleToggleBoardSize = (size: BoardSize) => {
    sound.playClick();
    setBoardSize(size);
    resetRound(size, mode);
  };

  // Reset Stats & History
  const handleResetStats = () => {
    sound.playClick();
    setStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      streak: { player: null, count: 0 },
    });
    setHistory([]);
    resetRound();
  };

  const activeTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Confetti canvas */}
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Top Bar Contract (1 row, 3 zones: Brand, 4 nav links, 1 primary action) */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark in Display face */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20">
              #
            </span>
            <span className="text-lg font-bold font-display tracking-tight text-white">
              Jogo da Velha
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <button
              onClick={() => handleSelectMode('pvp')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mode === 'pvp' ? 'text-indigo-400 font-semibold' : ''
              }`}
            >
              2 Jogadores
            </button>
            <button
              onClick={() => handleSelectMode('ai')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mode === 'ai' ? 'text-indigo-400 font-semibold' : ''
              }`}
            >
              Contra Robô IA
            </button>
            <button
              onClick={() => handleSelectMode('infinite')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                mode === 'infinite' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Modo Infinito</span>
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Regras do Jogo
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleSound}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              title={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              title="Configurações e temas"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                resetRound();
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nova Partida</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Experience */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center items-center gap-5 sm:gap-6">
        {/* Game Mode Controls */}
        <GameControls
          mode={mode}
          onSelectMode={handleSelectMode}
          difficulty={difficulty}
          onSelectDifficulty={(diff) => {
            sound.playClick();
            setDifficulty(diff);
            resetRound();
          }}
          boardSize={boardSize}
          onToggleBoardSize={handleToggleBoardSize}
          onRestartRound={() => {
            sound.playClick();
            resetRound();
          }}
          onOpenRules={() => setShowRules(true)}
          onOpenHistory={() => setShowHistory(true)}
        />

        {/* ScoreBoard HUD */}
        <ScoreBoard
          stats={stats}
          turn={turn}
          mode={mode}
          p1Name={p1Name}
          p2Name={p2Name}
          onUpdateNames={(p1, p2) => {
            setP1Name(p1);
            setP2Name(p2);
          }}
          symbols={symbolPack}
          isAiThinking={isAiThinking}
          themeId={themeId}
        />

        {/* Status Callout Banner */}
        <div className="w-full max-w-xl flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            {mode === 'infinite' && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Limite de 3 peças por jogador
              </span>
            )}
            {mode === 'ai' && (
              <span className="text-slate-400">
                Nível: <strong className="text-slate-200 capitalize">{difficulty === 'hard' ? 'Imbatível' : difficulty === 'medium' ? 'Médio' : 'Fácil'}</strong>
              </span>
            )}
            {mode === 'pvp' && (
              <span className="text-slate-400">
                Disputa local 1 vs 1
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Dica: use teclas 1 a 9 ou [R] para reiniciar
          </div>
        </div>

        {/* Interactive Board */}
        <div className="relative w-full flex justify-center">
          <GameBoard
            board={board}
            size={boardSize}
            currentTurn={turn}
            winnerLine={winnerInfo ? winnerInfo.line : null}
            disabled={winnerInfo !== null || isDraw || isAiThinking}
            onCellClick={handleCellClick}
            symbols={symbolPack}
            oldestXPieceIndex={mode === 'infinite' && xMoves.length >= 3 ? xMoves[0] : null}
            oldestOPieceIndex={mode === 'infinite' && oMoves.length >= 3 ? oMoves[0] : null}
            isInfiniteMode={mode === 'infinite'}
          />

          {/* End Match Overlay Card */}
          <AnimatePresence>
            {(winnerInfo || isDraw) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute inset-0 m-auto w-[90%] max-w-[340px] h-fit p-6 bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-md z-30 flex flex-col items-center text-center"
              >
                {winnerInfo ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-1">
                      Vitória!
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mb-1">
                      {winnerInfo.winner === 'X' ? p1Name : p2Name} venceu!
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Excelente jogada! Pronto para a próxima?
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center mb-3 text-2xl font-bold">
                      🤝
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Deu Velha!
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mb-1">
                      Empate técnico
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Nenhum jogador conseguiu alinhar a vitória.
                    </p>
                  </>
                )}

                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    sound.playClick();
                    resetRound();
                  }}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Jogar Novamente (Espaço)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-3 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Jogo da Velha Web · Modos Clássico, Infinito & IA Minimax</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowRules(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Regras
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowHistory(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Histórico ({history.length})
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowSettings(true)}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Aparência
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        p1Name={p1Name}
        p2Name={p2Name}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedThemeId={themeId}
        onSelectTheme={setThemeId}
        selectedSymbolId={symbolPack.id}
        onSelectSymbol={setSymbolPack}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
