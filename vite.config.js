import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5173,
    }
  },
  preview: {
    port: 5173,
    host: true
  }
});
