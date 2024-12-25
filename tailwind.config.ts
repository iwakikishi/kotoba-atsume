import type { Config } from "tailwindcss";

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
        mplus: ['var(--font-mplus)', 'M PLUS Rounded 1c', 'sans-serif'],
        yomogi: ['var(--font-yomogi)'],
        darumadrop: ['var(--font-darumadrop)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
