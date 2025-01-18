import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007bff",
          dark: "#0069d9",
        },
        secondary: {
          DEFAULT: "#6c757d",
          dark: "#5a6268",
        },
      },
    },
  },
  plugins: [],
};

export default config;