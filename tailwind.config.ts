import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#eef2ff",
        accent: "#0f766e",
        sand: "#f8fafc",
        line: "#dbe4f0"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
