import { createClient } from "@/lib/supabase/client";
import { Game, GameStatus, NewGameInput, UpdateGameInput } from "@/types/game";

interface DbGameRow {
  id: string;
  title: string;
  status: string;
  version: string;
  latest_version: string | null;
  has_update: boolean | null;
  link: string | null;
  notes: string | null;
  created_at: string;
}

const coverPool = [
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1200&q=80"
];

function pickCover(seed: string) {
  const sum = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverPool[sum % coverPool.length];
}

function toStatus(value: string): GameStatus {
  if (value === "Playing" || value === "Completed" || value === "Backlog") {
    return value;
  }
  return "Backlog";
}

function mapDbGame(row: DbGameRow): Game {
  return {
    id: row.id,
    title: row.title,
    status: toStatus(row.status),
    version: row.version,
    latest_version: row.latest_version,
    has_update: Boolean(row.has_update),
    link: row.link,
    notes: row.notes,
    created_at: row.created_at,
    cover: pickCover(row.id)
  };
}

export async function fetchGames() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch games.");
  }

  return ((data ?? []) as DbGameRow[]).map(mapDbGame);
}

export async function createGame(input: NewGameInput) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to add a game.");
  }

  const payload = {
    user_id: user.id,
    title: input.title.trim(),
    status: input.status,
    version: input.version.trim(),
    link: input.link.trim() || null,
    notes: input.notes.trim() || null
  };

  const { data, error } = await supabase.from("games").insert(payload).select("*").single();

  if (error) {
    throw new Error(error.message || "Failed to add game.");
  }

  return mapDbGame(data as DbGameRow);
}

export async function updateGame(input: UpdateGameInput) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to edit a game.");
  }

  const payload = {
    title: input.title.trim(),
    status: input.status,
    version: input.version.trim(),
    link: input.link.trim() || null,
    notes: input.notes.trim() || null
  };

  const { data, error } = await supabase
    .from("games")
    .update(payload)
    .eq("id", input.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update game.");
  }

  return mapDbGame(data as DbGameRow);
}

export async function deleteGame(gameId: string) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to delete a game.");
  }

  const { error } = await supabase.from("games").delete().eq("id", gameId).eq("user_id", user.id);
  if (error) {
    throw new Error(error.message || "Failed to delete game.");
  }
}
