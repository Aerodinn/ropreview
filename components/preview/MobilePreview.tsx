"use client";
import { RobloxGame, UserGame } from "@/lib/types";

interface Props {
  userGame: UserGame;
  competitors: RobloxGame[];
}

const PLACEHOLDER: RobloxGame[] = Array.from({ length: 7 }, (_, i) => ({
  universeId: i,
  name: ["Brookhaven RP", "Adopt Me!", "Murder Mystery 2", "Jailbreak", "Arsenal", "Pet Sim 99", "Doors"][i],
  playerCount: [521000, 312000, 187000, 99000, 88000, 76000, 54000][i],
  thumbnailUrl: null,
  iconUrl: null,
}));

function MobileCard({ game, userGame, isYours }: {
  game: RobloxGame | null; userGame: UserGame; isYours: boolean;
}) {
  const name = isYours ? (userGame.name || "Your Game") : game!.name;
  const thumb = isYours ? userGame.thumbnailUrl : game!.thumbnailUrl;

  return (
    <div className={`bg-[#252538] rounded-lg overflow-hidden ${isYours ? "your-card" : ""}`}>
      <div className="w-full aspect-video bg-[#1a1a2e] relative">
        {thumb
          ? <img src={thumb} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-white/15 text-[10px]">
              {isYours ? "your thumb" : ""}
            </div>
        }
        {isYours && (
          <span className="absolute top-1 left-1 text-[8px] font-bold bg-[#00A2FF] text-white px-1 py-0.5 rounded">
            YOU
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-white/80 px-2 py-1.5 truncate">{name}</p>
    </div>
  );
}

export function MobilePreview({ userGame, competitors }: Props) {
  const games = competitors.length > 0 ? competitors : PLACEHOLDER;

  return (
    <div className="flex justify-center">
      <div className="w-64 bg-[#1a1a2e] rounded-2xl overflow-hidden border border-[#2a2a3e]">
        {/* Status bar */}
        <div className="flex justify-between px-4 py-2 text-[9px] text-white/40">
          <span>9:41</span><span>●●●</span>
        </div>
        {/* Mobile topbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a3e]">
          <span className="text-[#00A2FF] font-extrabold text-sm">Roblox</span>
          <span className="text-white/30 text-lg">☰</span>
        </div>
        <div className="p-3 overflow-y-auto max-h-[520px]">
          <p className="text-[11px] font-extrabold text-white mb-2">For you</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <MobileCard game={null} userGame={userGame} isYours />
            {games.slice(0, 1).map(g => (
              <MobileCard key={g.universeId} game={g} userGame={userGame} isYours={false} />
            ))}
          </div>
          <p className="text-[11px] font-extrabold text-white mb-2">Trending</p>
          <div className="grid grid-cols-2 gap-2">
            {games.slice(1, 7).map(g => (
              <MobileCard key={g.universeId} game={g} userGame={userGame} isYours={false} />
            ))}
          </div>
        </div>
        {/* Bottom nav */}
        <div className="flex justify-around px-3 py-3 border-t border-[#2a2a3e]">
          {["🏠","🔍","👤","💬"].map(i => (
            <span key={i} className="text-base opacity-60">{i}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
