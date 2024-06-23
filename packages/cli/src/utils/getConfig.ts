import type { CollieConfig } from "@colliejs/config";
import { assert } from "@colliejs/shared";
import { tsImport } from "tsx/esm/api";

export async function getConfig(absConfigFilePath: string): Promise<CollieConfig> {
  const config = (await tsImport(absConfigFilePath, import.meta.url))[
    "default"
  ];
  assert(config, "collie config is not found,please use default export.");
  return config;
}
