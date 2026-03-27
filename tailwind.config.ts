import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panel: "rgba(255,255,255,0.06)",
        panelBorder: "rgba(255,255,255,0.15)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99, 102, 241, 0.35), 0 0 24px rgba(6, 182, 212, 0.2)",
        soft: "0 12px 30px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(circle at 10% 10%, rgba(168,85,247,0.15), transparent 40%), radial-gradient(circle at 90% 20%, rgba(34,211,238,0.14), transparent 45%), linear-gradient(180deg, #050509 0%, #090a18 50%, #060612 100%)"
      }
    }
  },
  plugins: []
};

export default config;
