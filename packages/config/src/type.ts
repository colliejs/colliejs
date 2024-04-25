import type { CSSProperties, Prefixed, CSSConfig } from "@colliejs/core";

export type GlobFilterPattern = string | string[];
type Alias = {};

export type CollieConfig = {
  css: CSSConfig;
  build: {
    entry: string;
    include?: GlobFilterPattern;
    exclude?: GlobFilterPattern;
    alias?: Alias;
    root?: string;
  };
};
