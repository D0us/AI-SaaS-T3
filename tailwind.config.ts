import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF69b4", // Can always use CSS variables too e.g. "var(--color-primary)",
        secondary: "#333333",
        brand: "#243c5a",
      },
    },
  },
  plugins: [],
} satisfies Config;
