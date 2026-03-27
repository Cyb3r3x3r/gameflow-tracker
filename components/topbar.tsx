"use client";

import { Search, Plus, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  onAddGame: () => void;
  searchQuery: string;
  onSearch: (value: string) => void;
}

export function Topbar({ onAddGame, searchQuery, onSearch }: TopbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string>("Loading...");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserEmail(user?.email ?? "Unknown user");
    };

    loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? "Unknown user");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search titles, tags, versions..."
          className="glass h-11 w-full rounded-xl pl-10 pr-4 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/40"
        />
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddGame}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition"
        >
          <span className="flex items-center gap-2">
            <Plus size={15} />
            Add Game
          </span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:text-white"
        >
          <LogOut size={15} />
          Logout
        </motion.button>
        <div className="glass hidden items-center gap-2 rounded-xl px-3 py-2 md:inline-flex">
          <div className="h-7 w-7 rounded-full border border-white/15 bg-gradient-to-br from-fuchsia-500/70 to-cyan-400/70" />
          <span className="max-w-44 truncate text-xs text-slate-300">{userEmail}</span>
        </div>
      </div>
    </div>
  );
}
