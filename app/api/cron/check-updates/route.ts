import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BROWSER_LIKE_USER_AGENT,
  compareVersions,
  extractVersion
} from "@/lib/version-check";

interface CronGameRow {
  id: string;
  user_id: string;
  link: string | null;
  version: string;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("games")
      .select("id,user_id,link,version")
      .not("link", "is", null);

    if (error) {
      console.error("[cron/check-updates] fetch games failed", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const games = (data ?? []) as CronGameRow[];
    const summary = {
      total: games.length,
      checked: 0,
      updated: 0,
      failed: 0
    };

    for (const game of games) {
      if (!game.link) continue;

      try {
        const pageResponse = await fetch(game.link, {
          method: "GET",
          headers: {
            "User-Agent": BROWSER_LIKE_USER_AGENT
          },
          cache: "no-store"
        });

        if (!pageResponse.ok) {
          summary.failed += 1;
          console.warn(
            `[cron/check-updates] fetch failed for game ${game.id}: ${pageResponse.status}`
          );
          continue;
        }

        const html = await pageResponse.text();
        const extractedVersion = extractVersion(html);

        if (!extractedVersion) {
          summary.failed += 1;
          console.warn(`[cron/check-updates] no version detected for game ${game.id}`);
          continue;
        }

        const hasUpdate = compareVersions(extractedVersion, game.version) === 1;
        const { error: updateError } = await supabase
          .from("games")
          .update({
            latest_version: extractedVersion,
            has_update: hasUpdate
          })
          .eq("id", game.id)
          .eq("user_id", game.user_id);

        if (updateError) {
          summary.failed += 1;
          console.warn(
            `[cron/check-updates] update failed for game ${game.id}: ${updateError.message}`
          );
          continue;
        }

        summary.checked += 1;
        if (hasUpdate) {
          summary.updated += 1;
        }
      } catch (loopError) {
        summary.failed += 1;
        console.warn(`[cron/check-updates] error for game ${game.id}`, loopError);
      }
    }

    console.log("[cron/check-updates] completed", summary);
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cron update check failed.";
    console.error("[cron/check-updates] fatal", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
