import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// TEMPORARY: deploying as a GitHub Pages project page for an early
// preview (https://sramu-teacher.github.io/kalakriti_arts_studio/)
// while the real kalakritiartstudio.com domain isn't wired up yet.
// Once DNS is pointed at Pages and public/CNAME is restored, remove
// this `base` override for a custom-domain root deploy.
export default defineConfig({
  base: "/kalakriti_arts_studio/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5191,
    strictPort: true,
  },
});
