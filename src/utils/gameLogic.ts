import { Player, CellValue, BoardSize, AIDifficulty } from '../types/game';

// Pre-calculate winning lines for 3x3
export const WINNING_LINES_3X3: number[][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// Pre-calculate winning lines for 4x4 (connect 4)
export const WINNING_LINES_4X4: number[][] = [
  // Rows
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  // Columns
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  // Diagonals
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

export function getWinningLines(size: BoardSize): number[][] {
  return size === 4 ? WINNING_LINES_4X4 : WINNING_LINES_3X3;
}

export function checkWinner(
  board: CellValue[],
  size: BoardSize = 3
): { winner: Player; line: number[] } | null {
  const lines = getWinningLines(size);

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;

    const allMatch = line.every((index) => board[index] === first);
    if (allMatch) {
      return { winner: first, line };
    }
  }

  return null;
}

export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableMoves(board: CellValue[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Minimax algorithm implementation for 3x3 Tic-Tac-Toe
 */
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  const winInfo = checkWinner(board, 3);
  if (winInfo) {
    return winInfo.winner === aiPlayer ? 10 - depth : depth - 10;
  }
  if (isBoardFull(board) || depth >= 7) {
    return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    const available = getAvailableMoves(board);
    for (const move of available) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const available = getAvailableMoves(board);
    for (const move of available) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Calculate best AI move based on difficulty and mode
 */
export function getAIMove(
  board: CellValue[],
  aiPlayer: Player,
  difficulty: AIDifficulty,
  size: BoardSize = 3,
  isInfiniteMode: boolean = false,
  aiPieces: number[] = [],
  humanPieces: number[] = []
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';

  // 1. Easy Difficulty: mostly random moves
  if (difficulty === 'easy') {
    // 20% chance to check winning move
    if (Math.random() < 0.25) {
      for (const move of availableMoves) {
        board[move] = aiPlayer;
        if (checkWinner(board, size)) {
          board[move] = null;
          return move;
        }
        board[move] = null;
      }
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 2. Medium Difficulty: check immediate win and block, otherwise balanced
  if (difficulty === 'medium') {
    // Check if AI can win immediately
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      if (checkWinner(board, size)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    // Check if human is about to win and block 75% of the time
    if (Math.random() < 0.75) {
      for (const move of availableMoves) {
        board[move] = humanPlayer;
        if (checkWinner(board, size)) {
          board[move] = null;
          return move;
        }
        board[move] = null;
      }
    }

    // Prefer center in 3x3 if free
    if (size === 3 && board[4] === null && Math.random() < 0.6) {
      return 4;
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 3. Hard (Impossível) Difficulty:
  // For infinite mode:
  if (isInfiniteMode) {
    // In infinite mode, if AI has 3 pieces, placing a move removes the oldest
    for (const move of availableMoves) {
      const tempBoard = [...board];
      if (aiPieces.length >= 3) {
        tempBoard[aiPieces[0]] = null;
      }
      tempBoard[move] = aiPlayer;
      if (checkWinner(tempBoard, size)) {
        return move;
      }
    }

    // Block opponent's immediate winning move
    for (const move of availableMoves) {
      const tempBoard = [...board];
      if (humanPieces.length >= 3) {
        tempBoard[humanPieces[0]] = null;
      }
      tempBoard[move] = humanPlayer;
      if (checkWinner(tempBoard, size)) {
        return move;
      }
    }

    // Prefer center or corners
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((c) => board[c] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // For 4x4 Grid
  if (size === 4) {
    // Immediate win
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      if (checkWinner(board, 4)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // Immediate block
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      if (checkWinner(board, 4)) {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // Prefer inner center squares: 5, 6, 9, 10
    const centers = [5, 6, 9, 10].filter((idx) => board[idx] === null);
    if (centers.length > 0) {
      return centers[Math.floor(Math.random() * centers.length)];
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Classic 3x3 Standard Minimax (Unbeatable)
  // If first move and center is available, center is best
  if (availableMoves.length === 9) {
    // 50% center, 50% corner for variety
    const openings = [4, 0, 2, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  if (availableMoves.length === 8 && board[4] === null) {
    return 4;
  }

  let bestScore = -Infinity;
  const bestMoves: number[] = [];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, humanPlayer);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves.length = 0;
      bestMoves.push(move);
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  // Pick randomly among moves that yield the best score for organic human-like play
  const selectedIndex = Math.floor(Math.random() * bestMoves.length);
  return bestMoves[selectedIndex];
}
