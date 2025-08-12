import path from "path";
// import react from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import inspectorPlugin from '@react-dev-inspector/babel-plugin';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
    cors: true,
  },
  plugins: [
    react({
      // Pass our two custom Babel plugins plus the inspector plugin
      babel: {
        plugins: [
          inspectorPlugin,]
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
