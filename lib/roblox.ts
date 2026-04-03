export interface RobloxGame {
  universeId: number;
  name: string;
  playerCount: number;
  thumbnailUrl: string | null;
  iconUrl: string | null;
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

export async function fetchTrending(): Promise<RobloxGame[]> {
  try {
    const res = await fetch(
      "https://games.roblox.com/v1/games/list?sortToken=&gameFilter=default&maxRows=12&startRows=0"
    );
    if (!res.ok) return getFallbackGames();
    const data = await res.json();
    const games = data.games || [];
    if (!games.length) return getFallbackGames();
    const ids = games.map((g: {universeId: number}) => g.universeId).join(",");
    const [t, i] = await Promise.all([
      fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`),
    ]);
    const td = t.ok ? await t.json() : { data: [] };
    const id = i.ok ? await i.json() : { data: [] };
    const tm: Record<string,string> = {};
    const im: Record<string,string> = {};
    for (const x of td.data || []) { const th = x.thumbnails?.[0]; if (th?.imageUrl) tm[String(x.universeId)] = th.imageUrl; }
    for (const x of id.data || []) { if (x.imageUrl) im[String(x.targetId)] = x.imageUrl; }
    return games.map((g: {universeId: number; name: string; playerCount: number}) => ({
      universeId: g.universeId, name: g.name, playerCount: g.playerCount,
      thumbnailUrl: tm[String(g.universeId)] || null,
      iconUrl: im[String(g.universeId)] || null,
    }));
  } catch { return getFallbackGames(); }
}

export async function searchGames(keyword: string): Promise<RobloxGame[]> {
  try {
    const res = await fetch(
      `https://games.roblox.com/v1/games/list?keyword=${encodeURIComponent(keyword)}&maxRows=6&startRows=0&sortToken=`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const games = data.games || [];
    if (!games.length) return [];
    const ids = games.map((g: {universeId: number}) => g.universeId).join(",");
    const [t, i] = await Promise.all([
      fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`),
    ]);
    const td = t.ok ? await t.json() : { data: [] };
    const id = i.ok ? await i.json() : { data: [] };
    const tm: Record<string,string> = {};
    const im: Record<string,string> = {};
    for (const x of td.data || []) { const th = x.thumbnails?.[0]; if (th?.imageUrl) tm[String(x.universeId)] = th.imageUrl; }
    for (const x of id.data || []) { if (x.imageUrl) im[String(x.targetId)] = x.imageUrl; }
    return games.map((g: {universeId: number; name: string; playerCount: number}) => ({
      universeId: g.universeId, name: g.name, playerCount: g.playerCount,
      thumbnailUrl: tm[String(g.universeId)] || null,
      iconUrl: im[String(g.universeId)] || null,
    }));
  } catch { return []; }
}

export async function syncGameFromUrl(url: string): Promise<{name: string; thumbnailUrl: string|null; iconUrl: string|null}|null> {
  const match = url.match(/roblox\.com\/games\/(\d+)/) || url.match(/^(\d+)$/);
  const placeId = match?.[1];
  if (!placeId) return null;
  try {
    let universeId = placeId;
    const ur = await fetch(`https://apis.roblox.com/universes/v1/places?placeIds=${placeId}`);
    if (ur.ok) { const ud = await ur.json(); universeId = String(ud.universeIds?.[0] || placeId); }
    const [gr, tr, ir] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
      fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`),
    ]);
    const gd = gr.ok ? await gr.json() : null;
    const td = tr.ok ? await tr.json() : null;
    const id = ir.ok ? await ir.json() : null;
    return {
      name: gd?.data?.[0]?.name || "Unknown Game",
      thumbnailUrl: td?.data?.[0]?.thumbnails?.[0]?.imageUrl || null,
      iconUrl: id?.data?.[0]?.imageUrl || null,
    };
  } catch { return null; }
}
