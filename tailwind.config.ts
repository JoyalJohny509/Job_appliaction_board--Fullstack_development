import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        paper: "#f7f8f5",
        line: "#dce2dd",
        mint: "#2d7d73",
        coral: "#d65a42",
        saffron: "#f2b84b",
        steel: "#4d6f86"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 38, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
