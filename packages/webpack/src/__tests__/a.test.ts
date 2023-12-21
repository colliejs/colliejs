import path from "path";
import { fileURLToPath } from "url";
import { defaultConfig } from "@colliejs/core";
import { webpack } from "webpack";
// import config from "./webpack.config";

// const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("vite", () => {
  it.skip("build", async () => {
    webpack({}, (err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
      }
      // Done processing
    });
  });
});
