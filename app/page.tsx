import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <span className="text-[#00A2FF] font-extrabold text-xl tracking-tight">
            ropreview
          </span>
          <span className="text-[10px] text-white/30 font-medium mt-0.5">
            by Outlier
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/preview"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Tool
          </Link>
          <Link
            href="/preview"
            className="bg-[#00A2FF] hover:bg-[#0090e6] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Try free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#00A2FF11] border border-[#00A2FF33] rounded-full px-4 py-1.5 text-xs text-[#00A2FF] font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A2FF] animate-pulse" />
          Free to use · No account required
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
          See your Roblox thumbnail
          <br />
          <span className="text-[#00A2FF]">before it goes live</span>
        </h1>

        <p className="text-white/50 text-lg max-w-2xl mb-10 leading-relaxed">
          Upload your game icon and 16:9 thumbnail. See exactly how it looks in
          the real Roblox home feed, search results, and mobile — next to{" "}
          <span className="text-white/70">actual competitor games</span> pulled
          live from the Roblox API.
        </p>

        <Link
          href="/preview"
          className="bg-[#00A2FF] hover:bg-[#0090e6] text-white font-extrabold text-lg px-8 py-4 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          Preview my thumbnail →
        </Link>

        <p className="text-white/25 text-xs mt-4">
          No signup. No watermark. Just upload and preview.
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-[#1a1a2e] py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎮",
              title: "Real Roblox data",
              desc: "Competitor games pulled live from the Roblox API — not static mockups. See your thumbnail next to the actual games players see.",
            },
            {
              icon: "📱",
              title: "Every surface",
              desc: "Home feed, search results, and mobile. See where players discover your game and how you stand out (or don't).",
            },
            {
              icon: "👁️",
              title: "Squint test",
              desc: "Blur your thumbnail to see what players notice first at a glance. If your key visual disappears, your design needs work.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a2e] py-6 px-6 flex items-center justify-between text-xs text-white/25">
        <span>ropreview.gg · A product by Outlier</span>
        <span>Not affiliated with Roblox Corporation</span>
      </footer>
    </main>
  );
}
