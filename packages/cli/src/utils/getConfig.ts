import type { CollieConfig } from "@colliejs/config";

export async function getConfig(configFilePath: string): Promise<CollieConfig> {
  const { default: config } = await import(configFilePath);
  return config;
}
