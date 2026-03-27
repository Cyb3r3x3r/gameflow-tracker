import { createClient } from "@/lib/supabase/client";

export interface ProfileRow {
  id: string;
  avatar_url: string | null;
}

export async function fetchProfileAvatar(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to load profile.");
  }

  return (data as ProfileRow | null)?.avatar_url ?? null;
}

export async function uploadAvatar(file: File) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to upload an avatar.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${user.id}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    cacheControl: "3600"
  });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload avatar.");
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message || "Failed to verify profile before saving avatar.");
  }

  const { error: upsertError } = existingProfile
    ? await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id)
    : await supabase.from("profiles").insert({
        id: user.id,
        avatar_url: publicUrl
      });

  if (upsertError) {
    throw new Error(upsertError.message || "Failed to save avatar profile.");
  }

  return publicUrl;
}
