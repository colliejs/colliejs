import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  plugins: [react(), Inspect()],
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
});
