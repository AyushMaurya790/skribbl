export interface Player {
  socketId: string;
  name: string;
  score: number;
  isDrawer: boolean;
  hasGuessed?: boolean;
}

export interface DrawData {
  x: number;
  y: number;
  color?: string;
  size?: number;
  type?: "start" | "move" | "end";
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  timestamp?: number;
  system?: boolean;
  text?: string;
  name?: string;
}

export interface GameState {
  phase: "lobby" | "choosing" | "drawing" | "roundEnd" | "gameOver";
  round: number;
  drawerId: string | null;
  word: string;
  hints: string;
  timeLeft: number;
}

export interface RoundData {
  drawer: string;
  drawerId: string;
  round: number;
}

export interface RoundEndData {
  word: string;
  scores: Player[];
  nextDrawer: string;
}

export interface GameOverData {
  winner: Player;
  leaderboard: Player[];
}

export interface CorrectGuessData {
  playerId: string;
  playerName: string;
  players: Player[];
}

export interface WinnerDeclaredData {
  winnerId: string;
  winnerName: string;
  word: string;
  score: number;
}
