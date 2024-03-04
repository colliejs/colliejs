import type { BaseConfig } from "@colliejs/core";
export async function getConfig(configFilePath: string): Promise<BaseConfig> {
  const { default: config } = await import(configFilePath);
  return config;
}
