import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06101A",
          900: "#0B192C",
          800: "#112239",
          700: "#1A2D45",
          600: "#243B56",
          500: "#2E4A68",
        },
        gold: {
          50: "#FDF8ED",
          100: "#FAF0D4",
          200: "#F5E0A9",
          300: "#EDCC73",
          400: "#E0B441",
          500: "#C4960A",
          600: "#A67D08",
          700: "#7D5E06",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
