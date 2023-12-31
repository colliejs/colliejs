import type { CSSObject, BaseConfig } from "@colliejs/core";
import type {
  VariantValue,
  DynamicVariantFn,
  VariantName,
  VariantsType,
} from "./variants";
import { CSSInfo } from "../../type";

export type StyledObjectParsed<Config extends BaseConfig> = {
  defaultVariants: CSSInfo<Config>;
  baseStyle: CSSInfo<Config>;
} & {
  [k in VariantsType["staticKey"]]: CSSInfo<Config>;
} & {
  [k in VariantsType["dynamicKey"]]: CSSInfo<Config> & {
    canAddPx: boolean;
  };
} & {
  [k in VariantsType["compoundKey"]]: CSSInfo<Config>;
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
