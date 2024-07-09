import type { CollieConfig } from "@colliejs/config";
import { tsImport } from "tsx/esm/api";

export async function getConfig(absConfigFilePath: string) {
  const config = await tsImport(absConfigFilePath, import.meta.url);
  const res = (config?.["default"]?.["default"] ||
    config?.["default"] ||
    {}) as CollieConfig;
  return {
    build: {
      include: [],
      exclude: [],
      alias: {},
      root: process.cwd(),
      ...res.build,
    },
    css: {
      prefix: "",
      theme: {},
      ...res.css,
    },
  } as const satisfies CollieConfig;
}
