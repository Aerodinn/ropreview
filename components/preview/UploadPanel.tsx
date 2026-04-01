"use client";

import { useRef } from "react";
import { UserGame } from "@/lib/types";

interface Props {
  userGame: UserGame;
  onNameChange: (name: string) => void;
  onThumbUpload: (file: File) => void;
  onIconUpload: (file: File) => void;
  onGameUrlSync: (url: string) => void;
  aspectWarning: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearch: () => void;
  loadingCompetitors: boolean;
}

export function UploadPanel({
  userGame, onNameChange, onThumbUpload, onIconUpload,
  onGameUrlSync, aspectWarning, searchQuery, onSearchChange,
  onSearch, loadingCompetitors,
}: Props) {
  const thumbRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent, type: "thumb" | "icon") {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    type === "thumb" ? onThumbUpload(file) : onIconUpload(file);
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">
          Your game
        </p>

        {/* 16:9 Thumbnail upload */}
        <div
          className={`upload-zone p-4 text-center mb-3 ${userGame.thumbnailUrl ? "has-file" : ""}`}
          onClick={() => thumbRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "thumb")}
        >
          <input
            ref={thumbRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onThumbUpload(e.target.files[0])}
          />
          {userGame.thumbnailUrl ? (
            <img
              src={userGame.thumbnailUrl}
              alt="Thumbnail preview"
              className="w-full aspect-video object-cover rounded-lg"
            />
          ) : (
            <div className="py-6">
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-sm font-bold text-white/60">
                16:9 Thumbnail
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                Click or drag · PNG, JPG · 1280×720px
              </p>
            </div>
          )}
        </div>

        {aspectWarning && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-xs text-yellow-400 mb-3">
            ⚠️ {aspectWarning}
          </div>
        )}

        {/* Icon upload */}
        <div
          className={`upload-zone p-3 flex items-center gap-3 mb-3 ${userGame.iconUrl ? "has-file" : ""}`}
          onClick={() => iconRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "icon")}
        >
          <input
            ref={iconRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onIconUpload(e.target.files[0])}
          />
          {userGame.iconUrl ? (
            <img
              src={userGame.iconUrl}
              alt="Icon"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#252538] flex items-center justify-center text-xl shrink-0">
              🎮
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-white/60">Game Icon</p>
            <p className="text-[11px] text-white/30">Square · Click to upload</p>
          </div>
        </div>

        {/* Game name */}
        <input
          type="text"
          placeholder="Game title..."
          value={userGame.name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={60}
          className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#00A2FF] transition-colors"
        />
      </div>

      {/* Game URL sync */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">
          Or sync from Roblox
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="roblox.com/games/..."
            className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#00A2FF] transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") onGameUrlSync((e.target as HTMLInputElement).value);
            }}
          />
          <button
            onClick={(e) => {
              const input = (e.currentTarget.previousSibling as HTMLInputElement);
              if (input?.value) onGameUrlSync(input.value);
            }}
            className="bg-[#1D9E75] hover:bg-[#18896A] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            Sync
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-1.5">
          Paste your game URL to auto-pull your live thumbnail
        </p>
      </div>

      {/* Competitor search */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">
          Competitor context
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Roblox games..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#00A2FF] transition-colors"
          />
          <button
            onClick={onSearch}
            disabled={loadingCompetitors}
            className="bg-[#252538] hover:bg-[#2f2f4a] border border-[#2a2a3e] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0 disabled:opacity-50"
          >
            {loadingCompetitors ? "…" : "Search"}
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-1.5">
          Filters which real games appear alongside yours
        </p>
      </div>

      {/* Squint test hint */}
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4">
        <p className="text-xs font-bold text-white/60 mb-1">💡 Squint test</p>
        <p className="text-[11px] text-white/35 leading-relaxed">
          Toggle "Squint test" in the top bar to blur all thumbnails. If you can't tell what your game is about at a glance — your thumbnail needs stronger focal contrast.
        </p>
      </div>
    </div>
  );
}
