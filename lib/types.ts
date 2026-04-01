export interface RobloxGame {
  universeId: number;
  name: string;
  playerCount: number;
  totalUpVotes?: number;
  totalDownVotes?: number;
  thumbnailUrl: string | null;
  iconUrl: string | null;
}

export type PreviewSurface = "home" | "search" | "mobile";

export interface UserGame {
  name: string;
  thumbnailUrl: string | null; // uploaded data URL or synced CDN URL
  iconUrl: string | null;
}
