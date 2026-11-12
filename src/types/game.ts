export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type GameMode = 'pvp' | 'ai' | 'infinite';
export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type BoardSize = 3 | 4;

export interface MoveRecord {
  player: Player;
  index: number;
  step: number;
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  streak: {
    player: Player | null;
    count: number;
  };
}

export interface RoundHistory {
  id: string;
  timestamp: number;
  winner: Player | 'draw';
  mode: GameMode;
  totalMoves: number;
  boardSize: BoardSize;
}

export interface ThemeConfig {
  id: string;
  name: string;
  xColor: string;
  oColor: string;
  accentBg: string;
  boardBg: string;
  cellBg: string;
  hoverCellBg: string;
}

export interface SymbolPack {
  id: string;
  name: string;
  x: string;
  o: string;
}
