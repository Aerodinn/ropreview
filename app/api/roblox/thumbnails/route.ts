import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function extractUniverseIdFromUrl(input: string): string | null {
  // Handle https://www.roblox.com/games/12345678/game-name
  const urlMatch = input.match(/roblox\.com\/games\/(\d+)/);
  if (urlMatch) return urlMatch[1];
  // Handle bare universe/place ID
  const numMatch = input.match(/^\d+$/);
  if (numMatch) return input.trim();
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("url") || "";

  const placeId = extractUniverseIdFromUrl(input);
  if (!placeId) {
    return NextResponse.json({ error: "Invalid game URL or ID" }, { status: 400 });
  }

  try {
    // Get universe ID from place ID
    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places?placeIds=${placeId}`,
      { next: { revalidate: 60 } }
    );

    let universeId = placeId; // fallback: treat as universe ID directly

    if (universeRes.ok) {
      const universeData = await universeRes.json();
      universeId = String(universeData.universeIds?.[0] || placeId);
    }

    // Fetch game info + thumbnails in parallel
    const [gameRes, thumbRes, iconRes] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
        next: { revalidate: 60 },
      }),
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
        { next: { revalidate: 60 } }
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
        { next: { revalidate: 60 } }
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
