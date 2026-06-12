import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserLists, toggleListItem, type ListName } from "@/lib/user-media";
import type { MediaListItem } from "@/lib/media-lists";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ favorites: [], watchlist: [], history: [] });
  }

  const lists = await getUserLists(userId);
  return NextResponse.json(lists);
}

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
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { list?: string; item?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const list = body.list;
  if (list !== "favorites" && list !== "watchlist") {
    return NextResponse.json({ error: "Invalid list" }, { status: 400 });
  }
  if (!isValidItem(body.item)) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const inList = await toggleListItem(userId, list as ListName, body.item);
  return NextResponse.json({ inList });
}
