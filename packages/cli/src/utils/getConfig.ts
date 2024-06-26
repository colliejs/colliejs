import type { CollieConfig } from "@colliejs/config";
import { tsImport } from "tsx/esm/api";

export async function getConfig(
  absConfigFilePath: string
): Promise<CollieConfig> {
  const config = await tsImport(absConfigFilePath, import.meta.url);
  return config?.["default"]?.["default"] || config?.["default"];
}
