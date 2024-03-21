import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import collie from "@colliejs/vite";
import collieConfig from "./collie.config";
const alias = {
  "@src": "src",
};

export default defineConfig({
  plugins: [collie(collieConfig), react(), Inspect()],
  resolve: {
    alias,
  },
});
