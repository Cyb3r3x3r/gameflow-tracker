"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger" | "ghost";
}

const variantClass: Record<NonNullable<ActionButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)]",
  danger:
    "border border-rose-400/35 bg-rose-500/15 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.2)] hover:border-rose-300/50",
  ghost: "glass text-slate-200 hover:text-white"
};

export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "primary"
}: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variantClass[variant]}`}
    >
      {children}
    </motion.button>
  );
}
