export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

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
  if (!placeId) return NextResponse.json({ error: "Invalid game URL or ID" }, { status: 400 });

  try {
    // Get universe ID from place ID
    const universeRes = await fetch(
      `https://apis.roproxy.com/universes/v1/places?placeIds=${placeId}`
    );
    let universeId = placeId;
    if (universeRes.ok) {
      const universeData = await universeRes.json();
      universeId = String(universeData.universeIds?.[0] || placeId);
    }

    const [gameRes, thumbRes, iconRes] = await Promise.all([
      fetch(`https://games.roproxy.com/v1/games?universeIds=${universeId}`),
      fetch(`https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?` +
        new URLSearchParams({
          universeIds: universeId,
          countPerUniverse: "1",
          defaults: "true",
          size: "768x432",
          format: "Png",
          isCircular: "false",
        })
      ),
      fetch(`https://thumbnails.roproxy.com/v1/games/icons?` +
        new URLSearchParams({
          universeIds: universeId,
          returnPolicy: "PlaceHolder",
          size: "150x150",
          format: "Png",
          isCircular: "false",
        })
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
