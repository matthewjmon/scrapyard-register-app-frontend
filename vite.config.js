import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://scrapyard-register-app-backend.onrender.com", // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    // Allow your Render frontend URL
    allowedHosts: ["scrapyard-register-app-frontend.onrender.com"],
  },
});
