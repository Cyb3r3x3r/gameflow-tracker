import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BROWSER_LIKE_USER_AGENT,
  compareVersions,
  extractVersion
} from "@/lib/version-check";

interface CheckUpdateBody {
  gameId: string;
  link: string;
  currentVersion: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CheckUpdateBody>;
    const gameId = body.gameId?.trim();
    const link = body.link?.trim();
    const currentVersion = body.currentVersion?.trim();

    if (!gameId || !link || !currentVersion) {
      return NextResponse.json(
        { error: "gameId, link, and currentVersion are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(link, {
      method: "GET",
      headers: {
        "User-Agent": BROWSER_LIKE_USER_AGENT
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Unable to fetch page (${response.status}).` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const extractedVersion = extractVersion(html);

    if (!extractedVersion) {
      return NextResponse.json(
        { error: "Could not detect version on the linked page." },
        { status: 422 }
      );
    }

    const hasUpdate = compareVersions(extractedVersion, currentVersion) === 1;
    const latestVersion = extractedVersion;

    const { error: updateError } = await supabase
      .from("games")
      .update({
        latest_version: latestVersion,
        has_update: hasUpdate
      })
      .eq("id", gameId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      gameId,
      latestVersion,
      hasUpdate
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check update.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
