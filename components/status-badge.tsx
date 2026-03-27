import { GameStatus } from "@/types/game";

const statusClasses: Record<GameStatus, string> = {
  Playing:
    "border-cyan-400/35 bg-cyan-400/15 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  Completed:
    "border-emerald-400/35 bg-emerald-400/15 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  Backlog:
    "border-fuchsia-400/35 bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.25)]"
};

export function StatusBadge({ status }: { status: GameStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
