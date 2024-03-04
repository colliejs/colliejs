import type {
  VariantValue,
  DynamicVariantFn,
  VariantName,
  VariantsType,
} from "./variants";
import { CSSObjectResult, CSSObject } from "../cssObject/type";
import { BaseConfig } from "../type";

export type DynamicClassNameMap = {
  [key: VariantsType["dynamicClassName"]]: { canAddPx: boolean; };
};


export type StyledObjectResult<Config extends BaseConfig> = {
  defaultVariants: CSSObjectResult<Config>;
  baseStyle: CSSObjectResult<Config>;
} & {
  [k in VariantsType["staticKey"]]: CSSObjectResult<Config>;
} & {
  [k in VariantsType["dynamicKey"]]: CSSObjectResult<Config> & {
    canAddPx: boolean;
  };
} & {
  [k in VariantsType["compoundKey"]]: CSSObjectResult<Config>;
};

export type VariantDeclBlock<Config extends BaseConfig> = Record<
  VariantValue,
  CSSObject<Config> | DynamicVariantFn<Config>
>;

export type StyledObject<Config extends BaseConfig> = CSSObject<Config> & {
  //FIXME:这里的variants类型太卡了
  // variants?: Record<VariantName, VariantDeclBlock<Config>>;
  variants?: {};
  compoundVariants: ({
    [Name in keyof StyledObject<Config>["variants"]]?: StyledObject<Config>["variants"][Name];
  } & {
    css: CSSObject<Config>;
  })[];
  defaultVariants: Record<VariantName, string>; //不可能是函数作为默认值
  [x: string]: any;
};
