import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["eduquest-production-4e67.up.railway.app"],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/logs": {
        target: "http://localhost:4444",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/public/**",
        "**/log/**",
      ],
    },
  },
});
