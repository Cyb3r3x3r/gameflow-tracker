"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

interface AccountFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
  copyable?: boolean;
}

export function AccountField({ label, value, icon, copyable = false }: AccountFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          <span className="text-cyan-300">{icon}</span>
          {label}
        </div>
        {copyable ? (
          <motion.button
            type="button"
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </motion.button>
        ) : null}
      </div>
      <p className="mt-2 break-all text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}
