import type { CollieConfig } from "@colliejs/config";
import { assert } from "@colliejs/shared";
import { transformTs } from "@colliejs/transform";
import fs from "fs";

export function getConfig(configFilePath: string): CollieConfig {
  let filePath = configFilePath;
  const suffix = /\.m?ts$/;
  const isTs = suffix.test(configFilePath);
  if (isTs) {
    const code = transformTs(configFilePath);
    filePath = configFilePath.replace(suffix, ".cjs");
    fs.writeFileSync(filePath, code);
  }
  const config = require(filePath)["default"];
  assert(config, "collie config is not found,please use default export.");
  fs.unlinkSync(filePath);

  return config;
}
