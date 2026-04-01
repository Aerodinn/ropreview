import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "6";

  try {
    // Step 1: search for games by keyword
    const searchRes = await fetch(
      `https://games.roblox.com/v1/games/list?` +
        new URLSearchParams({
          keyword,
          maxRows: limit,
          startRows: "0",
          sortToken: "",
          hasVerifiedCreator: "false",
        }),
      {
        headers: { "Accept": "application/json" },
        next: { revalidate: 300 }, // cache 5 min
      }
    );

    if (!searchRes.ok) throw new Error("Roblox search failed");
    const searchData = await searchRes.json();
    const games = searchData.games || [];

    if (games.length === 0) {
      return NextResponse.json({ games: [] });
    }

    // Step 2: fetch thumbnails for found games
    const universeIds = games.map((g: { universeId: number }) => g.universeId).join(",");
    const [thumbRes, iconRes] = await Promise.all([
      fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?` +
          new URLSearchParams({
            universeIds,
            countPerUniverse: "1",
            defaults: "true",
            size: "768x432",
            format: "Png",
            isCircular: "false",
          }),
        { next: { revalidate: 300 } }
      ),
      fetch(
        `https://thumbnails.roblox.com/v1/games/icons?` +
          new URLSearchParams({
            universeIds,
            returnPolicy: "PlaceHolder",
            size: "150x150",
            format: "Png",
            isCircular: "false",
          }),
        { next: { revalidate: 300 } }
      ),
    ]);

    const thumbData = thumbRes.ok ? await thumbRes.json() : { data: [] };
    const iconData = iconRes.ok ? await iconRes.json() : { data: [] };

    // Build lookup maps
    const thumbMap: Record<string, string> = {};
    const iconMap: Record<string, string> = {};

    for (const item of thumbData.data || []) {
      const thumb = item.thumbnails?.[0];
      if (thumb?.imageUrl) thumbMap[String(item.universeId)] = thumb.imageUrl;
    }
    for (const item of iconData.data || []) {
      if (item.imageUrl) iconMap[String(item.targetId)] = item.imageUrl;
    }

    const result = games.map((g: {
      universeId: number;
      name: string;
      playerCount: number;
      totalUpVotes: number;
      totalDownVotes: number;
    }) => ({
      universeId: g.universeId,
      name: g.name,
      playerCount: g.playerCount,
      totalUpVotes: g.totalUpVotes,
      totalDownVotes: g.totalDownVotes,
      thumbnailUrl: thumbMap[String(g.universeId)] || null,
      iconUrl: iconMap[String(g.universeId)] || null,
    }));

    return NextResponse.json({ games: result });
  } catch (err) {
    console.error("Search proxy error:", err);
    return NextResponse.json({ games: [], error: "Failed to fetch" }, { status: 200 });
  }
}
