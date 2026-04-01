import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        roblox: {
          bg: "#1a1a2e",
          surface: "#252538",
          border: "#2a2a3e",
          blue: "#00A2FF",
          "blue-dim": "#00A2FF22",
        },
      },
    },
  },
  plugins: [],
};

export default config;
