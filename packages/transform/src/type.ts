import type { BaseConfig, CSSObject } from "@colliejs/core";

export type CSSInfo<Config extends BaseConfig> = {
  cssRawObj: CSSObject<Config>;
  cssGenText: string;
  className: string; //被渲染的原数的className。当前元素的className
};

export type Alias = { [find: string]: string };
