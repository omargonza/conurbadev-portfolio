/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      bg: "#07070A",
      bg2: "#0B0B0F",
      bg3: "#111116",
      panel: "#111116",
      panel2: "#17171D",
      border: "rgba(255,255,255,0.08)",
      border2: "rgba(255,255,255,0.14)",
      text: "#F2EFE7",
      muted: "rgba(242,239,231,0.68)",
      muted2: "rgba(242,239,231,0.42)",
      accent: "#C8C3B8",
      "accent2": "#8E8A83",
      "accent-dark": "#4A4A4D",
    },
    boxShadow: {
      soft: "0 18px 55px rgba(0,0,0,0.60)",
      deep: "0 26px 80px rgba(0,0,0,0.72)",
      glow: "0 0 0 1px rgba(200,195,184,0.28), 0 18px 65px rgba(200,195,184,0.18)",
    },
    borderRadius: {
      xl2: "22px",
    },
  },
};
export const plugins = [];
