"use client";

import { RobloxGame, fetchTrending, searchGames, syncGameFromUrl } from "@/lib/roblox";
import { readFileAsDataURL, checkAspectRatio } from "@/lib/utils";
import { HomeFeedPreview } from "./HomeFeedPreview";
import { SearchPreview } from "./SearchPreview";
import { MobilePreview } from "./MobilePreview";
import { UploadPanel } from "./UploadPanel";

export type PreviewSurface = "home" | "search" | "mobile";

export interface UserGame {
  name: string;
  thumbnailUrl: string | null;
  iconUrl: string | null;
}

export function PreviewTool() {
  const [userGame, setUserGame] = useState<UserGame>({
    name: "",
    thumbnailUrl: null,
    iconUrl: null,
  });
  const [competitors, setCompetitors] = useState<RobloxGame[]>([]);
  const [surface, setSurface] = useState<PreviewSurface>("home");
  const [squint, setSquint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aspectWarning, setAspectWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchTrending()
      .then(setCompetitors)
      .finally(() => setLoading(false));
  }, []);

  const handleThumbUpload = useCallback(async (file: File) => {
    const warning = await checkAspectRatio(file);
    setAspectWarning(warning.warning);
    const dataUrl = await readFileAsDataURL(file);
    setUserGame((prev) => ({ ...prev, thumbnailUrl: dataUrl }));
  }, []);

  const handleIconUpload = useCallback(async (file: File) => {
    const dataUrl = await readFileAsDataURL(file);
    setUserGame((prev) => ({ ...prev, iconUrl: dataUrl }));
  }, []);

  const handleGameUrlSync = useCallback(async (url: string) => {
    const result = await syncGameFromUrl(url);
    if (result) {
      setUserGame((prev) => ({
        ...prev,
        name: prev.name || result.name,
        thumbnailUrl: result.thumbnailUrl || prev.thumbnailUrl,
        iconUrl: result.iconUrl || prev.iconUrl,
      }));
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    searchGames(searchQuery)
      .then(setCompetitors)
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const surfaces: { id: PreviewSurface; label: string }[] = [
    { id: "home", label: "Home feed" },
    { id: "search", label: "Search" },
    { id: "mobile", label: "Mobile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a]">
      <nav className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a2e] shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00A2FF] font-extrabold text-lg tracking-tight">ropreview</span>
          <span className="text-[10px] text-white/25 font-medium">by Outlier</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSquint(!squint)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              squint ? "bg-[#00A2FF] border-[#00A2FF] text-white" : "border-[#2a2a3e] text-white/50 hover:text-white"
            }`}
          >
            👁 Squint test
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-[#1a1a2e] overflow-y-auto">
          <UploadPanel
            userGame={userGame}
            onNameChange={(name) => setUserGame((prev) => ({ ...prev, name }))}
            onThumbUpload={handleThumbUpload}
            onIconUpload={handleIconUpload}
            onGameUrlSync={handleGameUrlSync}
            aspectWarning={aspectWarning}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            loadingCompetitors={loading}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-1 px-5 py-3 border-b border-[#1a1a2e] shrink-0">
            {surfaces.map((s) => (
              <button
                key={s.id}
                onClick={() => setSurface(s.id)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                  surface === s.id ? "bg-[#00A2FF] text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
            {loading && (
              <span className="ml-auto text-[11px] text-white/30 animate-pulse">
                Loading live data…
              </span>
            )}
          </div>

          <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${squint ? "squint-active" : ""}`}>
            {surface === "home" && <HomeFeedPreview userGame={userGame} competitors={competitors} />}
            {surface === "search" && <SearchPreview userGame={userGame} competitors={competitors} />}
            {surface === "mobile" && <MobilePreview userGame={userGame} competitors={competitors} />}
          </div>
        </div>
      </div>
    </div>
  );
}
