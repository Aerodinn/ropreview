"use client";
import { RobloxGame, UserGame } from "@/lib/types";
import { GameCard } from "./GameCard";

interface Props {
  userGame: UserGame;
  competitors: RobloxGame[];
}

const PLACEHOLDER = Array.from({ length: 9 }, (_, i) => ({
  universeId: i,
  name: ["Brookhaven RP", "Adopt Me!", "Murder Mystery 2", "Tower of Hell", "Jailbreak", "Arsenal", "Pet Simulator 99", "Shindo Life", "Doors"][i],
  playerCount: [521000, 312000, 187000, 143000, 99000, 88000, 76000, 65000, 54000][i],
  thumbnailUrl: null,
  iconUrl: null,
}));

export function HomeFeedPreview({ userGame, competitors }: Props) {
  const games = competitors.length > 0 ? competitors : PLACEHOLDER;
  const row1 = [null, ...games.slice(0, 4)]; // null = user's slot at position 0
  const row2 = games.slice(4, 9);

  return (
    <div className="rbx-shell max-w-4xl mx-auto">
      {/* Topbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border-b border-[#2a2a3e]">
        <span className="text-[#00A2FF] font-extrabold text-sm">Roblox</span>
        {["Home","Games","Avatar","Create"].map(n => (
          <span key={n} className="text-[11px] text-white/40">{n}</span>
        ))}
        <div className="ml-auto bg-[#252538] rounded px-3 py-1 text-[10px] text-white/30">Search</div>
      </div>

      <div className="p-4">
        <p className="text-sm font-extrabold text-white mb-3">Recommended for you</p>
        <div className="grid grid-cols-5 gap-2 mb-5">
          {row1.map((game, i) =>
            game === null ? (
              <GameCard key="yours" game={null} userGame={userGame} isYours />
            ) : (
              <GameCard key={game.universeId} game={game} userGame={userGame} isYours={false} />
            )
          )}
        </div>
        <p className="text-sm font-extrabold text-white mb-3">Popular now</p>
        <div className="grid grid-cols-5 gap-2">
          {row2.map((game) => (
            <GameCard key={game.universeId} game={game} userGame={userGame} isYours={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
