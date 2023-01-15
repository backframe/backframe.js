/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colorScheme: {
        bgmain: "#0c0c0d",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
