const cache = new Map<string, { data: any; expiry: number }>();

const TTL = 1000 * 60 * 5; // 5 minutes

async function fetchRoblox(url: string) {
  const now = Date.now();

  // ✅ return cached if valid
  if (cache.has(url)) {
    const cached = cache.get(url)!;
    if (cached.expiry > now) {
      return cached.data;
    }
  }

  // ✅ actual request
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Roblox API error: ${res.status}`);
  }

  const data = await res.json();

  // ✅ cache it
  cache.set(url, {
    data,
    expiry: now + TTL,
  });

  return data;
}

// 🔥 batch-friendly function
export async function getGames(universeIds: string[]) {
  const url = `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`;
  const data = await fetchRoblox(url);
  return data.data;
}
