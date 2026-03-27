"use client";

import Link from "next/link";
import { LayoutGrid, ListChecks, Trophy, Inbox, UserCircle2 } from "lucide-react";
import { GameStatus } from "@/types/game";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, value: "All" },
  { label: "Playing", icon: ListChecks, value: "Playing" },
  { label: "Completed", icon: Trophy, value: "Completed" },
  { label: "Backlog", icon: Inbox, value: "Backlog" },
  { label: "Account", icon: UserCircle2, value: "Account", href: "/account" }
];

interface SidebarProps {
  activeFilter: "All" | GameStatus;
  onSelectFilter: (filter: "All" | GameStatus) => void;
}

export function Sidebar({ activeFilter, onSelectFilter }: SidebarProps) {
  return (
    <aside className="glass hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-2xl p-5 lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 shadow-glow" />
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AVN</p>
          <h1 className="text-lg font-semibold text-slate-100">GameFlow</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, icon: Icon, value, href }) => {
          const isActive =
            (value === "All" && activeFilter === "All") ||
            (value !== "All" && value !== "Account" && activeFilter === value);

          if (href) {
            return (
              <Link
                key={label}
                href={href}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          }

          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectFilter(value as "All" | GameStatus)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-white/10 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
