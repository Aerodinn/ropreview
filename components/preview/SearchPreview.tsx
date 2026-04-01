"use client";
import { RobloxGame, UserGame } from "@/lib/types";
import { formatPlayerCount } from "@/lib/utils";

interface Props {
  userGame: UserGame;
  competitors: RobloxGame[];
}

const PLACEHOLDER: RobloxGame[] = Array.from({ length: 5 }, (_, i) => ({
  universeId: i,
  name: ["Brookhaven RP", "Adopt Me!", "Murder Mystery 2", "Jailbreak", "Arsenal"][i],
  playerCount: [521000, 312000, 187000, 99000, 88000][i],
  thumbnailUrl: null,
  iconUrl: null,
}));

function SearchItem({ game, userGame, isYours }: {
  game: RobloxGame | null; userGame: UserGame; isYours: boolean;
}) {
  const name = isYours ? (userGame.name || "Your Game") : game!.name;
  const icon = isYours ? userGame.iconUrl : game!.iconUrl;
  const players = isYours ? null : formatPlayerCount(game!.playerCount);

  return (
    <div className={`flex gap-3 items-start bg-[#252538] rounded-lg p-3 ${isYours ? "your-card" : ""}`}>
      <div className="w-14 h-14 rounded-lg bg-[#1a1a2e] shrink-0 overflow-hidden">
        {icon
          ? <img src={icon} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">icon</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-bold truncate ${isYours ? "text-white" : "text-white/80"}`}>{name}</p>
          {isYours && <span className="text-[9px] font-bold bg-[#00A2FF] text-white px-1.5 py-0.5 rounded shrink-0">YOU</span>}
        </div>
        <p className="text-[11px] text-white/40 mt-0.5">{isYours ? "Your studio" : "By Studio"}</p>
        {players && <p className="text-[11px] text-white/30 mt-1">{players} playing</p>}
      </div>
    </div>
  );
}

export function SearchPreview({ userGame, competitors }: Props) {
  const games = competitors.length > 0 ? competitors.slice(0, 5) : PLACEHOLDER;
  const title = userGame.name || "Your Game";

  return (
    <div className="rbx-shell max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border-b border-[#2a2a3e]">
        <span className="text-[#00A2FF] font-extrabold text-sm">Roblox</span>
        <div className="flex-1 bg-[#252538] rounded px-3 py-1 text-[11px] text-white/60 truncate">
          🔍 {title}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-extrabold text-white mb-3">Games</p>
        <div className="flex flex-col gap-2">
          <SearchItem game={null} userGame={userGame} isYours />
          {games.map(g => <SearchItem key={g.universeId} game={g} userGame={userGame} isYours={false} />)}
        </div>
      </div>
    </div>
  );
}
