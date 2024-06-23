import type {
  VariantValue,
  DynamicVariantFn,
  VariantName,
  VariantsType,
} from "./variants";
import { CSSObjectResult, CSSObject } from "../cssObject/type";
import { BaseConfig } from "../type";

export type DynamicClassNameMap = {
  [key: VariantsType["dynamicClassName"]]: { canAddPx: boolean };
};

export type StyledObjectResult<Config extends BaseConfig> = {
  defaultVariants: { getClassName: (overrides: string[]) => string[] };
  baseStyle: CSSObjectResult<Config>;
} & {
  [k in VariantsType["variantKey"]]: CSSObjectResult<Config> & {
    canAddPx?: boolean;
  };
};

export type VariantDeclBlock<Config extends BaseConfig> = Record<
  VariantValue extends boolean ? `${VariantValue}` : string,
  CSSObject<Config> | DynamicVariantFn<Config>
>;

export type StyledObject<Config extends BaseConfig> = CSSObject<Config> & {
  //FIXME:这里的variants类型太卡了
  // variants?: Record<VariantName, VariantDeclBlock<Config>>;
  variants?: {};
  defaultVariants: Record<VariantName, string>; //不可能是函数作为默认值
  [x: string]: any;
};
