import collie from "@colliejs/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import { collieConfig } from "./collie.config";
export default defineConfig({
  plugins: [
    collie({
      entry: "src/index.tsx",
      styledConfig: collieConfig,
    }),
    react(),
    Inspect(),
  ],
});
