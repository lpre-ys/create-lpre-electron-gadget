import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    // Electron controls the Chromium version, so we can safely target ESNext.
    target: "esnext",
  },
});
