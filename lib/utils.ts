import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlayerCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

export function getLikePercent(up: number, down: number): string {
  const total = up + down;
  if (total === 0) return "—";
  return `${Math.round((up / total) * 100)}%`;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function checkAspectRatio(
  file: File
): Promise<{ ok: boolean; warning: string | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width / img.height;
      const expected = 16 / 9;
      const diff = Math.abs(ratio - expected);
      if (diff > 0.05) {
        resolve({
          ok: false,
          warning: `Image is ${img.width}×${img.height} (${ratio.toFixed(2)}:1). Roblox expects 16:9 (${expected.toFixed(2)}:1).`,
        });
      } else {
        resolve({ ok: true, warning: null });
      }
    };
    img.onerror = () => resolve({ ok: true, warning: null });
    img.src = url;
  });
}
