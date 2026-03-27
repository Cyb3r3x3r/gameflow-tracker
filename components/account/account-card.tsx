"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Mail, RefreshCw, UserRound } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { AccountField } from "@/components/account/account-field";
import { ActionButton } from "@/components/account/action-button";
import { createClient } from "@/lib/supabase/client";

interface AccountCardProps {
  user: User;
  onRefreshSession: () => Promise<void>;
  refreshing: boolean;
}

export function AccountCard({ user, onRefreshSession, refreshing }: AccountCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass relative overflow-hidden rounded-2xl p-6 shadow-soft"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-300/10" />

        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-100">Account Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your profile and session</p>
        </header>

        <div className="space-y-3">
          <AccountField label="Email" value={user.email ?? "Unknown email"} icon={<Mail size={13} />} />
          <AccountField label="User ID" value={user.id} icon={<UserRound size={13} />} copyable />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <ActionButton onClick={onRefreshSession} disabled={refreshing} variant="ghost">
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh Session"}
            </span>
          </ActionButton>

          <ActionButton onClick={handleLogout} variant="danger">
            <span className="inline-flex items-center gap-2">
              <LogOut size={14} />
              Logout
            </span>
          </ActionButton>
        </div>
      </motion.section>
    </div>
  );
}
