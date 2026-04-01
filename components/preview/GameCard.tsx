"use client";
import { RobloxGame, UserGame } from "@/lib/types";
import { formatPlayerCount } from "@/lib/utils";

interface Props {
  game: RobloxGame | null;
  userGame: UserGame;
  isYours: boolean;
}

export function GameCard({ game, userGame, isYours }: Props) {
  const name = isYours ? (userGame.name || "Your Game") : game!.name;
  const thumb = isYours ? userGame.thumbnailUrl : game!.thumbnailUrl;
  const players = !isYours && game ? formatPlayerCount(game.playerCount) : null;

  return (
    <div className={`bg-[#252538] rounded-lg overflow-hidden cursor-default ${isYours ? "your-card" : ""}`}>
      <div className="w-full aspect-video bg-[#1a1a2e] relative overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={name} className="rbx-thumb w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/10 text-[10px] text-center px-1">
              {isYours ? "upload thumbnail" : ""}
            </span>
          </div>
        )}
        {isYours && (
          <span className="absolute top-1 left-1 text-[8px] font-bold bg-[#00A2FF] text-white px-1 py-0.5 rounded">
            YOU
          </span>
        )}
      </div>
      <div className="px-2 py-1.5">
        <p className={`text-[10px] font-bold truncate leading-tight ${isYours ? "text-white" : "text-white/70"}`}>
          {name}
        </p>
        {players && (
          <p className="text-[9px] text-white/35 mt-0.5">{players} playing</p>
        )}
      </div>
    </div>
  );
}
