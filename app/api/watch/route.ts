import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { recordWatch } from "@/lib/user-media";
import type { MediaListItem } from "@/lib/media-lists";

function isValidItem(item: unknown): item is MediaListItem {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.id === "number" &&
    (i.media_type === "movie" || i.media_type === "tv") &&
    typeof i.title === "string"
  );
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    item?: unknown;
    watchedSeconds?: unknown;
    duration?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isValidItem(body.item)) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const watchedSeconds =
    typeof body.watchedSeconds === "number" && Number.isFinite(body.watchedSeconds)
      ? body.watchedSeconds
      : 0;
  const duration =
    typeof body.duration === "number" && Number.isFinite(body.duration)
      ? body.duration
      : 0;

  await recordWatch(userId, body.item, watchedSeconds, duration);
  return NextResponse.json({ ok: true });
}
