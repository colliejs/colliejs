import { CSSProperties } from "react";
import type { Utils } from "@colliejs/core";

export type Typography = {
  fontSize: CSSProperties["fontSize"];
  fontWeight: CSSProperties["fontWeight"];
  lineHeight?: CSSProperties["lineHeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
  fontFamily?: CSSProperties["fontFamily"];
};

export type Animation = Pick<
  CSSProperties,
  | "animationName"
  | "animationDelay"
  | "animationDirection"
  | "animationDuration"
  | "animationIterationCount"
  | "animationTimingFunction"
  | "animationFillMode"
  | "animationPlayState"
>;
export type Transition = Pick<
  CSSProperties,
  | "transitionDelay"
  | "transitionDuration"
  | "transitionProperty"
  | "transitionTimingFunction"
>;
//Attention: don't include ::placeholder pseudo-element
const pseudoElements = ["before", "after", "first-letter", "first-line"];
const pseudoClasses = ["hover", "focus", "active", "focus-within", "disabled"];

export const utils: Utils = {
  w: (w: CSSProperties["width"]) => ({ width: w }),
  h: (h: CSSProperties["height"]) => ({ height: h }),
  minW: (minW: CSSProperties["minWidth"]) => ({ minWidth: minW }),
  minH: (minH: CSSProperties["minHeight"]) => ({ minHeight: minH }),
  maxW: (maxW: CSSProperties["maxWidth"]) => ({ maxWidth: maxW }),
  maxH: (maxH: CSSProperties["maxHeight"]) => ({ maxHeight: maxH }),

  //margin
  m: (m: CSSProperties["margin"]) => ({ margin: m }),
  mt: (m: CSSProperties["marginTop"]) => ({ marginTop: m }),
  mr: (m: CSSProperties["marginRight"]) => ({ marginRight: m }),
  mb: (m: CSSProperties["paddingBottom"]) => ({ marginBottom: m }),
  ml: (m: CSSProperties["marginLeft"]) => ({ marginLeft: m }),
  mx: (mx: CSSProperties["marginLeft"]) => ({
    marginLeft: mx,
    marginRight: mx,
  }),
  my: (my: CSSProperties["marginTop"]) => ({
    marginTop: my,
    marginBottom: my,
  }),

  //padding
  p: (m: CSSProperties["padding"]) => ({ padding: m }),
  pt: (m: CSSProperties["paddingTop"]) => ({ paddingTop: m }),
  pr: (m: CSSProperties["paddingRight"]) => ({ paddingRight: m }),
  pb: (m: CSSProperties["paddingBottom"]) => ({ paddingBottom: m }),
  pl: (m: CSSProperties["paddingLeft"]) => ({ paddingLeft: m }),
  px: (px: CSSProperties["paddingLeft"]) => ({
    paddingLeft: px,
    paddingRight: px,
  }),
  py: (py: CSSProperties["paddingTop"]) => ({
    paddingTop: py,
    paddingBottom: py,
  }),

  //others shortcuts
  bg: (bg: CSSProperties["background"]) => ({ background: bg }),

  anime: (options: Animation) => ({
    animationFillMode: "forwards",
    ...options,
  }),
  transi: (trans: Transition) => ({ ...trans }),

  //TODO: img/input dones't support pseudo elements
  ...pseudoElements.reduce(
    (acc, pseudo: string) => ({
      ...acc,
      [`_${pseudo}`]: (css: CSSProperties) => ({
        [`&::${pseudo}`]: {
          content: "",
          position: "absolute",
          ...css,
        },
        "&": {
          position: "relative",
        },
      }),
    }),
    {}
  ),
  ...pseudoClasses.reduce(
    (acc, pseudo: string) => ({
      ...acc,
      [`_${pseudo}`]: (css: CSSProperties) => ({ [`&:${pseudo}`]: css }),
    }),
    {}
  ),
};
