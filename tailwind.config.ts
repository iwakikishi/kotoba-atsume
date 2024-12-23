import type { Config } from "tailwindcss";
import { GeistSans, GeistMono } from 'geist/font/dist/tailwind';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', GeistSans],
        mono: [GeistMono],
      },
    },
  },
  plugins: [],
} satisfies Config;
