"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Game } from "@/types/game";
import { StatusBadge } from "@/components/status-badge";

interface GameCardProps {
  game: Game;
  checking?: boolean;
  deleting?: boolean;
  onCheckUpdate?: (game: Game) => void;
  onEdit?: (game: Game) => void;
  onDelete?: (game: Game) => void;
}

export function GameCard({
  game,
  checking = false,
  deleting = false,
  onCheckUpdate,
  onEdit,
  onDelete
}: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasProgress = typeof game.progress === "number";
  const cover =
    game.cover ??
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
  const showUpdate = game.has_update && game.latest_version;

  return (
    <motion.article
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className={`glass group overflow-hidden rounded-2xl shadow-soft ${
        showUpdate ? "ring-1 ring-fuchsia-400/45 shadow-[0_0_26px_rgba(217,70,239,0.28)]" : ""
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={cover}
          alt={game.title}
          fill
          onLoad={() => setImageLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!imageLoaded ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-900/70 to-slate-700/20" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-base font-semibold text-slate-100">
            {game.title}
          </h3>
          <StatusBadge status={game.status} />
        </div>

        <div className="text-xs text-slate-400">Version {game.version}</div>
        {game.link ? (
          <Link
            href={game.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-300 transition hover:text-cyan-200"
          >
            Open link <ExternalLink size={12} />
          </Link>
        ) : null}
        {showUpdate ? (
          <div className="inline-flex rounded-full border border-amber-300/35 bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-200">
            Update Available (v{game.latest_version})
          </div>
        ) : null}
        {game.link ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCheckUpdate?.(game)}
            disabled={checking}
            className="glass inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-cyan-200 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {checking ? <LoaderCircle size={12} className="animate-spin" /> : null}
            {checking ? "Checking..." : "Check Update"}
          </motion.button>
        ) : null}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit?.(game)}
            className="glass inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white"
          >
            <Pencil size={12} />
            Edit
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDelete?.(game)}
            disabled={deleting}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-400/35 bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:border-rose-300/55 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {deleting ? <LoaderCircle size={12} className="animate-spin" /> : <Trash2 size={12} />}
            {deleting ? "Deleting..." : "Delete"}
          </motion.button>
        </div>

        {hasProgress ? (
          <div className="space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${game.progress}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400"
              />
            </div>
            <p className="text-right text-xs text-slate-400">{game.progress}%</p>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-all duration-300 group-hover:border-cyan-300/35 group-hover:shadow-glow" />
    </motion.article>
  );
}
