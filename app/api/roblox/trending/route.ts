import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://games.roblox.com/v1/games/list?` +
        new URLSearchParams({
          sortToken: "",
          gameFilter: "default",
          maxRows: "12",
          startRows: "0",
        }),
      {
        headers: {
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Origin": "https://www.roblox.com",
          "Referer": "https://www.roblox.com/",
        },
      }
    );
    if (!res.ok) throw new Error(`Trending fetch failed: ${res.status}`);
    const data = await res.json();
    const games = data.games || [];
    if (games.length === 0) return NextResponse.json({ games: [] });
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
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.roblox.com/",
          },
        }
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
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.roblox.com/",
          },
        }
      ),
    ]);
    const thumbData = thumbRes.ok ? await thumbRes.json() : { data: [] };
    const iconData = iconRes.ok ? await iconRes.json() : { data: [] };
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
    console.error("Trending proxy error:", err);
    return NextResponse.json({ games: [], error: "Failed to fetch" }, { status: 200 });
  }
}
