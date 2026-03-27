"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { GameGrid } from "@/components/game-grid";
import { AddGameModal } from "@/components/add-game-modal";
import { EditGameModal } from "@/components/edit-game-modal";
import { createGame, deleteGame, fetchGames, updateGame } from "@/lib/games";
import { Game, GameStatus, NewGameInput, UpdateGameInput } from "@/types/game";

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingGameId, setCheckingGameId] = useState<string | null>(null);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null);
  const [checkUpdateError, setCheckUpdateError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [lastCheckByGameId, setLastCheckByGameId] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<"All" | GameStatus>("All");

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGames();
      setGames(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch games.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCheckUpdate = async (game: Game) => {
    if (!game.link) return;
    if (checkingGameId) return;

    const now = Date.now();
    const lastCheck = lastCheckByGameId[game.id] ?? 0;
    if (now - lastCheck < 3000) {
      return;
    }

    try {
      setCheckUpdateError(null);
      setCheckingGameId(game.id);
      setLastCheckByGameId((prev) => ({ ...prev, [game.id]: now }));

      const response = await fetch("/api/check-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameId: game.id,
          link: game.link,
          currentVersion: game.version
        })
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to check update.");
      }

      await loadGames();
    } catch (checkError) {
      setCheckUpdateError(
        checkError instanceof Error ? checkError.message : "Failed to check update."
      );
    } finally {
      setCheckingGameId(null);
    }
  };

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return games.filter((game) => {
      const matchesFilter = statusFilter === "All" || game.status === statusFilter;
      if (!matchesFilter) return false;
      if (!normalizedSearch) return true;

      const haystack =
        `${game.title} ${game.status} ${game.version} ${game.link ?? ""} ${game.notes ?? ""} ${game.latest_version ?? ""}`
          .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [games, searchQuery, statusFilter]);

  const handleDeleteGame = async (game: Game) => {
    const confirmed = window.confirm(`Delete "${game.title}"?`);
    if (!confirmed) return;

    try {
      setMutationError(null);
      setDeletingGameId(game.id);
      await deleteGame(game.id);
      setGames((prev) => prev.filter((item) => item.id !== game.id));
    } catch (deleteError) {
      setMutationError(deleteError instanceof Error ? deleteError.message : "Failed to delete game.");
    } finally {
      setDeletingGameId(null);
    }
  };

  const handleEditGame = async (input: UpdateGameInput) => {
    const updatedGame = await updateGame(input);
    setGames((prev) => prev.map((game) => (game.id === updatedGame.id ? updatedGame : game)));
    setMutationError(null);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen p-4 lg:p-6"
    >
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar activeFilter={statusFilter} onSelectFilter={setStatusFilter} />

        <section className="min-w-0 flex-1 space-y-6">
          <Topbar
            onAddGame={() => setIsModalOpen(true)}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />

          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Your Library</h2>
              <p className="text-sm text-slate-400">{filteredGames.length} games</p>
            </div>
            {checkUpdateError ? (
              <div className="mb-4 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {checkUpdateError}
              </div>
            ) : null}
            {mutationError ? (
              <div className="mb-4 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {mutationError}
              </div>
            ) : null}
            {loading ? (
              <div className="glass rounded-2xl p-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/40 border-t-cyan-300" />
                <p className="mt-3 text-sm text-slate-300">Loading your games...</p>
              </div>
            ) : error ? (
              <div className="glass rounded-2xl border-rose-300/20 p-6 text-center">
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="glass rounded-2xl border-dashed p-10 text-center">
                <p className="text-base font-medium text-slate-200">
                  No games yet. Add your first game.
                </p>
              </div>
            ) : (
              <GameGrid
                games={filteredGames}
                checkingGameId={checkingGameId}
                deletingGameId={deletingGameId}
                onCheckUpdate={handleCheckUpdate}
                onEditGame={setEditingGame}
                onDeleteGame={handleDeleteGame}
              />
            )}
          </div>
        </section>
      </div>

      <AddGameModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (input: NewGameInput) => {
          const newGame = await createGame(input);
          setGames((prev) => [newGame, ...prev]);
        }}
      />
      <EditGameModal
        open={Boolean(editingGame)}
        game={editingGame}
        onClose={() => setEditingGame(null)}
        onSave={handleEditGame}
      />
    </motion.main>
  );
}
