export type GameStatus = "Playing" | "Completed" | "Backlog";

export interface Game {
  id: string;
  title: string;
  status: GameStatus;
  version: string;
  latest_version: string | null;
  has_update: boolean;
  cover_url: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
  progress?: number;
  cover?: string;
}

export interface NewGameInput {
  title: string;
  status: GameStatus;
  version: string;
  link: string;
  notes: string;
}

export interface UpdateGameInput extends NewGameInput {
  id: string;
}
