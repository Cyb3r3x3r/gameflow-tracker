"use client";

import { motion } from "framer-motion";
import { Game } from "@/types/game";
import { GameCard } from "@/components/game-card";

interface GameGridProps {
  games: Game[];
  checkingGameId: string | null;
  deletingGameId: string | null;
  clearingUpdateGameId: string | null;
  onCheckUpdate: (game: Game) => void;
  onEditGame: (game: Game) => void;
  onDeleteGame: (game: Game) => void;
  onClearUpdateGame: (game: Game) => void;
}

export function GameGrid({
  games,
  checkingGameId,
  deletingGameId,
  clearingUpdateGameId,
  onCheckUpdate,
  onEditGame,
  onDeleteGame,
  onClearUpdateGame
}: GameGridProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
        >
          <GameCard
            game={game}
            checking={checkingGameId === game.id}
            deleting={deletingGameId === game.id}
            clearingUpdate={clearingUpdateGameId === game.id}
            onCheckUpdate={onCheckUpdate}
            onEdit={onEditGame}
            onDelete={onDeleteGame}
            onClearUpdate={onClearUpdateGame}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}
