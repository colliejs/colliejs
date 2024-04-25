import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { defaultConfig } from "@colliejs/config";
import collie from "../index";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("vite", () => {
  it.skip("build", async () => {
    await build({
      root: path.resolve(__dirname, "./project"),
      plugins: [
        collie({
          entry: "src/index.tsx",
          styledConfig: defaultConfig,
        }),
        react(),
      ],
    });
  });
});
