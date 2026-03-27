"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { AccountCard } from "@/components/account/account-card";
import { createClient } from "@/lib/supabase/client";
import { fetchProfileAvatar, uploadAvatar } from "@/lib/profile";

export default function AccountPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    const {
      data: { user: currentUser }
    } = await supabase.auth.getUser();
    setUser(currentUser ?? null);
    setLoading(false);

    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      const avatar = await fetchProfileAvatar(currentUser.id);
      setAvatarUrl(avatar);
    } catch {
      setAvatarUrl(null);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadUser();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser, router, supabase]);

  const refreshSession = async () => {
    setRefreshing(true);
    await supabase.auth.refreshSession();
    await loadUser();
    setRefreshing(false);
  };

  const handleAvatarSelect = async (file: File | null) => {
    if (!file) return;

    setUploadMessage(null);
    setUploadError(null);
    setUploadingAvatar(true);

    try {
      const publicUrl = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
      setUploadMessage("Avatar updated successfully.");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-app-gradient p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-16 max-w-2xl rounded-2xl p-6"
        >
          <p className="text-sm text-slate-300">Loading your secure profile space...</p>
        </motion.div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-app-gradient p-4 lg:p-6">
        <div className="glass mx-auto mt-16 max-w-2xl rounded-2xl p-6">
          <p className="text-sm text-slate-300">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app-gradient p-4 lg:p-6">
      <div className="relative">
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-10 right-10 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl"
        />

        <AccountCard
          user={user}
          avatarUrl={avatarUrl}
          uploadingAvatar={uploadingAvatar}
          uploadMessage={uploadMessage}
          uploadError={uploadError}
          onAvatarSelect={handleAvatarSelect}
          onRefreshSession={refreshSession}
          refreshing={refreshing}
        />
      </div>
    </main>
  );
}
