"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ImageUp, LogOut, Mail, RefreshCw, UserRound } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { AccountField } from "@/components/account/account-field";
import { ActionButton } from "@/components/account/action-button";
import { createClient } from "@/lib/supabase/client";

interface AccountCardProps {
  user: User;
  avatarUrl: string | null;
  uploadingAvatar: boolean;
  uploadMessage: string | null;
  uploadError: string | null;
  onAvatarSelect: (file: File | null) => Promise<void>;
  onRefreshSession: () => Promise<void>;
  refreshing: boolean;
}

export function AccountCard({
  user,
  avatarUrl,
  uploadingAvatar,
  uploadMessage,
  uploadError,
  onAvatarSelect,
  onRefreshSession,
  refreshing
}: AccountCardProps) {
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

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">Profile Picture</p>
          <div className="flex flex-wrap items-center gap-4">
            {avatarUrl ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/20">
                <Image src={avatarUrl} alt="Avatar preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-fuchsia-500/70 to-cyan-400/70 text-xl font-semibold text-slate-950">
                {(user.email?.[0] ?? "U").toUpperCase()}
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 transition hover:border-cyan-300/50 hover:text-cyan-100">
              <ImageUp size={15} />
              {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingAvatar}
                className="hidden"
                onChange={(event) => {
                  void onAvatarSelect(event.target.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>
          {uploadMessage ? <p className="mt-3 text-sm text-emerald-300">{uploadMessage}</p> : null}
          {uploadError ? <p className="mt-3 text-sm text-rose-300">{uploadError}</p> : null}
        </div>

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
