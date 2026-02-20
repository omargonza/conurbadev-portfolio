/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      bg: "#07090D",
      panel: "#0B0F16",
      card: "#0E141D",
      card2: "#111827",
      border: "rgba(255,255,255,0.10)",
      border2: "rgba(255,255,255,0.16)",
      text: "rgba(232,233,237,0.96)",
      muted: "rgba(232,233,237,0.70)",
      muted2: "rgba(232,233,237,0.52)",
      accent: "#E1062D",
    },
    boxShadow: {
      soft: "0 18px 55px rgba(0,0,0,0.60)",
      deep: "0 26px 80px rgba(0,0,0,0.72)",
      glow: "0 0 0 1px rgba(225,6,45,0.28), 0 18px 65px rgba(225,6,45,0.18)",
    },
    borderRadius: {
      xl2: "22px",
    },
  },
};
export const plugins = [];
