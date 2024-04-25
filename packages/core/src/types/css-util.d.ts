import type * as Native from "./css";
import type * as Config from "./config";
import type * as ThemeUtil from "./theme";
import type * as Util from "./util";

/** CSS style declaration object. */
export interface CSSProperties
  extends Native.StandardLonghandProperties,
    Native.StandardShorthandProperties,
    Native.SvgProperties {}

type ValueByPropertyName<PropertyName> =
  PropertyName extends keyof CSSProperties
    ? CSSProperties[PropertyName]
    : never;

type TokenListByPropertyName<PropertyName, Theme, ThemeMap> =
  PropertyName extends keyof ThemeMap
    ? TokenListByScaleName<ThemeMap[PropertyName], Theme>
    : never;

type TokenListByScaleName<ScaleName, Theme> = ScaleName extends keyof Theme
  ? Util.Prefixed<"$", keyof Theme[ScaleName]>
  : // `$${keyof Theme[ScaleName]}`
    never;

/** Returns a Style interface, leveraging the given media and style map. */
export type CSS<
  Media extends object,
  Theme extends object,
  ThemeMap extends object,
  Utils extends object
> =
  // nested at-rule css styles
  // {
  // [K in Util.Prefixed<"@", keyof Media>]?: CSS<Media, Theme, ThemeMap, Utils>;
  // } &
  {
    // known property styles
    [K in keyof CSSProperties]?:
      | ValueByPropertyName<K>
      | TokenListByPropertyName<K, Theme, ThemeMap>
      | Native.Globals
      | ThemeUtil.ScaleValue
      | Util.Index
      | undefined;
  } & {
    // known utility styles
    [K in keyof Utils as K extends keyof CSSProperties
      ? never
      : K]?: Utils[K] extends (arg: infer P) => any
      ?
          | (P extends any[]
              ?
                  | ($$PropertyValue extends keyof P[0]
                      ?
                          | ValueByPropertyName<P[0][$$PropertyValue]>
                          | TokenListByPropertyName<
                              P[0][$$PropertyValue],
                              Theme,
                              ThemeMap
                            >
                          | Native.Globals
                          | ThemeUtil.ScaleValue
                          | undefined
                      : $$ScaleValue extends keyof P[0]
                      ?
                          | TokenListByScaleName<P[0][$$ScaleValue], Theme>
                          | { scale: P[0][$$ScaleValue] }
                          | undefined
                      : never)[]
                  | P
              : $$PropertyValue extends keyof P
              ?
                  | ValueByPropertyName<P[$$PropertyValue]>
                  | TokenListByPropertyName<P[$$PropertyValue], Theme, ThemeMap>
                  | Native.Globals
                  | undefined
              : $$ScaleValue extends keyof P
              ?
                  | TokenListByScaleName<P[$$ScaleValue], Theme>
                  | { scale: P[$$ScaleValue] }
                  | undefined
              : never)
          | P
      : never;
  } & {
    // known theme styles
    [K in keyof ThemeMap as K extends keyof CSSProperties
      ? never
      : K extends keyof Utils
      ? never
      : K]?: Native.Globals | Util.Index | undefined;
  } & {
    // unknown css declaration styles
    /** Unknown property. */
    [K: string]:
      | number
      | string
      | CSS<Media, Theme, ThemeMap, Utils>
      | {}
      | undefined;
  };

/** Unique symbol used to reference a property value. */
export declare const $$PropertyValue: unique symbol;

/** Unique symbol used to reference a property value. */
export type $$PropertyValue = typeof $$PropertyValue;

/** Unique symbol used to reference a token value. */
export declare const $$ScaleValue: unique symbol;

/** Unique symbol used to reference a token value. */
export type $$ScaleValue = typeof $$ScaleValue;

export declare const $$ThemeValue: unique symbol;

export type $$ThemeValue = typeof $$ThemeValue;
