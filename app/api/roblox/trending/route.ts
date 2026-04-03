import { NextResponse } from "next/server";

export async function GET() {
  // Hardcoded top Roblox games as fallback while API issues are resolved
  return NextResponse.json({
    games: [
      { universeId: 1537690962, name: "Adopt Me!", playerCount: 312000, thumbnailUrl: null, iconUrl: null },
      { universeId: 2753915549, name: "Brookhaven RP", playerCount: 521000, thumbnailUrl: null, iconUrl: null },
      { universeId: 286090429, name: "Murder Mystery 2", playerCount: 187000, thumbnailUrl: null, iconUrl: null },
      { universeId: 1145026605, name: "Tower of Hell", playerCount: 143000, thumbnailUrl: null, iconUrl: null },
      { universeId: 606849621, name: "Jailbreak", playerCount: 99000, thumbnailUrl: null, iconUrl: null },
      { universeId: 2177, name: "Arsenal", playerCount: 88000, thumbnailUrl: null, iconUrl: null },
      { universeId: 1198231169, name: "Pet Simulator 99", playerCount: 76000, thumbnailUrl: null, iconUrl: null },
      { universeId: 1070427205, name: "Shindo Life", playerCount: 65000, thumbnailUrl: null, iconUrl: null },
      { universeId: 3531439425, name: "Doors", playerCount: 54000, thumbnailUrl: null, iconUrl: null },
    ]
  });
}
