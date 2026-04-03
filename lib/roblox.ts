// Client-side Roblox API calls - called directly from browser
// Roblox allows browser requests, no server proxy needed

export interface RobloxGame {
  universeId: number;
  name: string;
  playerCount: number;
  thumbnailUrl: string | null;
  iconUrl: string | null;
}

async function fetchThumbnails(universeIds: string): Promise<{
  thumbMap: Record<string, string>;
  iconMap: Record<string, string>;
}> {
  const thumbMap: Record<string, string> = {};
  const iconMap: Record<string, string> = {};

  try {
    const [thumbRes, iconRes] = await Promise.all([
      fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`
      ),
      fetch(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`
      ),
    ]);

    if (thumbRes.ok) {
      const data = await thumbRes.json();
      for (const item of data.data || []) {
        const thumb = item.thumbnails?.[0];
        if (thumb?.imageUrl) thumbMap[String(item.universeId)] = thumb.imageUrl;
      }
    }

    if (iconRes.ok) {
      const data = await iconRes.json();
      for (const item of data.data || []) {
        if (item.imageUrl) iconMap[String(item.targetId)] = item.imageUrl;
      }
    }
  } catch (e) {
    console.warn("Thumbnail fetch failed:", e);
  }

  return { thumbMap, iconMap };
}

export async function fetchTrending(): Promise<RobloxGame[]> {
  try {
    const res = await fetch(
      `https://games.roblox.com/v1/games/list?sortToken=&gameFilter=default&maxRows=12&startRows=0`
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    const games = data.games || [];
    if (games.length === 0) return getFallbackGames();

    const universeIds = games.map((g: { universeId: number }) => g.universeId).join(",");
    const { thumbMap, iconMap } = await fetchThumbnails(universeIds);

    return games.map((g: { universeId: number; name: string; playerCount: number }) => ({
      universeId: g.universeId,
      name: g.name,
      playerCount: g.playerCount,
      thumbnailUrl: thumbMap[String(g.universeId)] || null,
      iconUrl: iconMap[String(g.universeId)] || null,
    }));
  } catch {
    return getFallbackGames();
  }
}

export async function searchGames(keyword: string): Promise<RobloxGame[]> {
  try {
    const res = await fetch(
      `https://games.roblox.com/v1/games/list?keyword=${encodeURIComponent(keyword)}&maxRows=6&startRows=0&sortToken=`
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    const games = data.games || [];
    if (games.length === 0) return [];

    const universeIds = games.map((g: { universeId: number }) => g.universeId).join(",");
    const { thumbMap, iconMap } = await fetchThumbnails(universeIds);

    return games.map((g: { universeId: number; name: string; playerCount: number }) => ({
      universeId: g.universeId,
      name: g.name,
      playerCount: g.playerCount,
      thumbnailUrl: thumbMap[String(g.universeId)] || null,
      iconUrl: iconMap[String(g.universeId)] || null,
    }));
  } catch {
    return [];
  }
}

export async function syncGameFromUrl(url: string): Promise<{
  name: string;
  thumbnailUrl: string | null;
  iconUrl: string | null;
} | null> {
  const match = url.match(/roblox\.com\/games\/(\d+)/);
  const placeId = match?.[1] || (url.match(/^\d+$/) ? url : null);
  if (!placeId) return null;

  try {
    // Try to get universe ID
    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places?placeIds=${placeId}`
    );
    let universeId = placeId;
    if (universeRes.ok) {
      const data = await universeRes.json();
      universeId = String(data.universeIds?.[0] || placeId);
    }

    const [gameRes, thumbData, iconData] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
      fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`),
    ]);

    const game = gameRes.ok ? (await gameRes.json())?.data?.[0] : null;
    const thumbJson = thumbData.ok ? await thumbData.json() : null;
    const iconJson = iconData.ok ? await iconData.json() : null;

    return {
      name: game?.name || "Unknown Game",
      thumbnailUrl: thumbJson?.data?.[0]?.thumbnails?.[0]?.imageUrl || null,
      iconUrl: iconJson?.data?.[0]?.imageUrl || null,
    };
  } catch {
    return null;
  }
}

export function getFallbackGames(): RobloxGame[] {
  return [
    { universeId: 1, name: "Brookhaven RP", playerCount: 521000, thumbnailUrl: null, iconUrl: null },
    { universeId: 2, name: "Adopt Me!", playerCount: 312000, thumbnailUrl: null, iconUrl: null },
    { universeId: 3, name: "Murder Mystery 2", playerCount: 187000, thumbnailUrl: null, iconUrl: null },
    { universeId: 4, name: "Tower of Hell", playerCount: 143000, thumbnailUrl: null, iconUrl: null },
    { universeId: 5, name: "Jailbreak", playerCount: 99000, thumbnailUrl: null, iconUrl: null },
    { universeId: 6, name: "Arsenal", playerCount: 88000, thumbnailUrl: null, iconUrl: null },
    { universeId: 7, name: "Pet Simulator 99", playerCount: 76000, thumbnailUrl: null, iconUrl: null },
    { universeId: 8, name: "Shindo Life", playerCount: 65000, thumbnailUrl: null, iconUrl: null },
    { universeId: 9, name: "Doors", playerCount: 54000, thumbnailUrl: null, iconUrl: null },
  ];
}
