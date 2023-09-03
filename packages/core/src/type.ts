type Selector = string;
import * as CSS from "csstype";

export interface CSSProperties extends CSS.Properties<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
}
type ConfigUtils = {
  [customPropertyName: string]: (p: any) => CSSPropertiesComplex;
};

// type ConditionRule = Record<`@${string}`, CSSPropertiesComplex>;
type ConditionRule = Partial<{
  [key: `@${string}`]: CSSPropertiesComplex;
}>;

// type SelectorRule = Record<Selector, CSSPropertiesComplex>;
type SelectorRule = Partial<{ [key: Selector]: CSSPropertiesComplex }>;

type CustomPropertyRule = {
  [key in keyof ConfigUtils]?: any;
};

export type CSSPropertiesComplex = CSSProperties &
  CustomPropertyRule &
  ConditionRule;
//   & SelectorRule;

export type Config = {
  utils?: ConfigUtils;
  breakpoints?: readonly number[];
  media?: Record<string, string>; //to remove
  prefix: string;
  theme?: Record<string, any>;
  themeMap: Record<string, any>;
  styledElementProp?: string;
  layername: string;
};

