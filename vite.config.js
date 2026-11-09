import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from the root of kalakritiartstudio.com (GitHub Pages custom
// domain, see public/CNAME), so no `base` override is needed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5191,
    strictPort: true,
  },
});
