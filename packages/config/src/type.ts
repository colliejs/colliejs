import type { CSSProperties, Prefixed, CSSConfig } from "@colliejs/core";

export type FilterPattern = string | RegExp | (string | RegExp)[];
type Alias = {};

export type CollieConfig = {
  css: CSSConfig;
  build: {
    entry: string;
    include?: FilterPattern;
    exclude?: FilterPattern;
    alias?: Alias;
    root?: string;
  };
};
