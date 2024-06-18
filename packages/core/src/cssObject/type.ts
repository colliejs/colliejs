import { type BaseConfig } from "../type";
import { CSS } from "../types/index";
//===========================================================
// used by function css()
//===========================================================
export type UtilsParams<
  Config extends BaseConfig,
  K extends keyof Config["utils"]
> = Parameters<Config["utils"][K]>;

export type UtilsParams0<
  Config extends BaseConfig,
  K extends keyof Config["utils"]
> = Parameters<Config["utils"][K]>[0];

//TODO: recursive type
export type CSSObject<Config extends BaseConfig> = {
  [K in keyof CSS<Config>]: K extends keyof Config["utils"]
    ? UtilsParams0<Config, K> extends CSSObject<any>
      ? CSSObject<Config>
      : UtilsParams0<Config, K> | UtilsParams0<Config, K>[]
    : CSS<Config>[K] | CSS<Config>[K][];
};

export type CSSObjectResult<Config extends BaseConfig> = {
  cssRawObj: CSSObject<Config>;
  cssGenText: string;
  className: string; //被渲染的原数的className。当前元素的className
};
