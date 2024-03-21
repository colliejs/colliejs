import type { CSSProperties, Prefixed, CSSConfig } from "@colliejs/core";

export type FilterPattern = string | RegExp | (string | RegExp)[];
type Alias = {};

export type CollieConfig = {
  css: CSSConfig;
  build?: {
    include?: FilterPattern;
    exclude?: FilterPattern;
    entry: string;
    alias?: Alias;
  };
};
