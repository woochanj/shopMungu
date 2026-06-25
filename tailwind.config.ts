import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Toss-securities inspired palette: blue / white / gray
        toss: {
          blue: "#3182F6",
          blueDark: "#1B64DA",
          blueLight: "#E8F3FF",
        },
        ink: {
          900: "#191F28", // primary text
          700: "#333D4B",
          500: "#4E5968",
          400: "#6B7684",
          300: "#8B95A1", // secondary / muted
        },
        line: "#E5E8EB", // 1px borders
        surface: "#F2F4F6", // subtle gray panels
        alert: "#F04452", // discount / sold-out
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        hover: "0 6px 20px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
