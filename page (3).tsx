export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

const ROBLOX_HEADERS = {
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Origin": "https://www.roproxy.com",
  "Referer": "https://www.roproxy.com/",
};

function extractPlaceId(input: string): string | null {
  const urlMatch = input.match(/roblox\.com\/games\/(\d+)/);
  if (urlMatch) return urlMatch[1];
  const numMatch = input.match(/^\d+$/);
  if (numMatch) return input.trim();
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("url") || "";

  const placeId = extractPlaceId(input);
  if (!placeId) {
    return NextResponse.json({ error: "Invalid game URL or ID" }, { status: 400 });
  }

  try {
    // Get universe ID from place ID
    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places?placeIds=${placeId}`,
      { headers: ROBLOX_HEADERS }
    );

    let universeId = placeId;
    if (universeRes.ok) {
      const universeData = await universeRes.json();
      universeId = String(universeData.universeIds?.[0] || placeId);
    }

    const [gameRes, thumbRes, iconRes] = await Promise.all([
      fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeId}`,
        { headers: ROBLOX_HEADERS }
      ),
      fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?` +
          new URLSearchParams({
            universeIds: universeId,
            countPerUniverse: "1",
            defaults: "true",
            size: "768x432",
            format: "Png",
            isCircular: "false",
          }),
        { headers: ROBLOX_HEADERS }
      ),
      fetch(
        `https://thumbnails.roblox.com/v1/games/icons?` +
          new URLSearchParams({
            universeIds: universeId,
            returnPolicy: "PlaceHolder",
            size: "150x150",
            format: "Png",
            isCircular: "false",
          }),
        { headers: ROBLOX_HEADERS }
      ),
    ]);

    const gameData = gameRes.ok ? await gameRes.json() : null;
    const thumbData = thumbRes.ok ? await thumbRes.json() : null;
    const iconData = iconRes.ok ? await iconRes.json() : null;

    const game = gameData?.data?.[0];
    const thumbnailUrl = thumbData?.data?.[0]?.thumbnails?.[0]?.imageUrl || null;
    const iconUrl = iconData?.data?.[0]?.imageUrl || null;

    return NextResponse.json({
      universeId,
      name: game?.name || "Unknown Game",
      playerCount: game?.playing || 0,
      thumbnailUrl,
      iconUrl,
    });
  } catch (err) {
    console.error("Game sync error:", err);
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 200 });
  }
}
