"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { GameStatus, NewGameInput } from "@/types/game";

interface AddGameModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (game: NewGameInput) => Promise<void>;
}

const statusOptions: GameStatus[] = ["Playing", "Completed", "Backlog"];

export function AddGameModal({ open, onClose, onCreate }: AddGameModalProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<GameStatus>("Backlog");
  const [version, setVersion] = useState("0.1");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitGame = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    setError(null);
    setIsSaving(true);

    try {
      await onCreate({
        title: title.trim(),
        status,
        version,
        link: link.trim(),
        notes: notes.trim()
      });

      setTitle("");
      setStatus("Backlog");
      setVersion("0.1");
      setLink("");
      setNotes("");
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add game.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 190, damping: 18 }}
            onSubmit={submitGame}
            className="glass w-full max-w-lg space-y-4 rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Add New Game</h2>
              <button
                type="button"
                onClick={() => {
                  if (isSaving) return;
                  onClose();
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="e.g. Neon Chronicles"
              />
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GameStatus)}
                  className="glass h-11 w-full rounded-xl px-3 text-sm text-slate-100 outline-none focus:border-cyan-300/45"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Version"
                value={version}
                onChange={setVersion}
                placeholder="0.1"
              />
              <Input
                label="Link"
                value={link}
                onChange={setLink}
                placeholder="https://example.com/game-page"
              />
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Quick notes..."
                  className="glass w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
                />
              </div>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
              >
                {isSaving ? "Saving..." : "Save Game"}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass h-11 w-full rounded-xl px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/45"
      />
    </div>
  );
}
