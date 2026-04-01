import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Ropreview — Roblox Thumbnail Previewer",
  description:
    "See exactly how your Roblox game icon and 16:9 thumbnail look on the real Roblox home feed, search, and more — next to live competitor games. A product by Outlier.",
  metadataBase: new URL("https://ropreview.gg"),
  openGraph: {
    title: "Ropreview — Roblox Thumbnail Previewer",
    description:
      "Preview your Roblox thumbnail in real UI surfaces. Free tool by Outlier.",
    url: "https://ropreview.gg",
    siteName: "Ropreview",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ropreview — Roblox Thumbnail Previewer",
    description: "Preview your Roblox thumbnail in real UI surfaces.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
