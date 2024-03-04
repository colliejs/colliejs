import type { BaseConfig, CSSObject, CSSProperties } from "@colliejs/core";

//Attention: don't include ::placeholder pseudo-element
const pseudoElements = [
  "before",
  "after",
  "first-letter",
  "first-line",
  "placeholder",
  "selection",
  "backdrop",
  "marker",
  "spelling-error",
  "grammar-error",
  "cue",
] as const;
const pseudoClasses = [
  "hover",
  "focus",
  "active",
  "focus-within",
  "focus-visible",
  "link",
  "disabled",
  "visited",
  "checked",
  "active",
  "root",
  "empty",
  "target",
] as const;

export const utils = {
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

  ...pseudoElements.reduce(
    (acc, pseudo) => ({
      ...acc,
      [`_${pseudo}`]: (css: CSSObject<BaseConfig>) => ({
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
    {} as Record<
      `_${(typeof pseudoElements)[number]}`,
      (css: CSSObject<BaseConfig>) => CSSObject<BaseConfig>
    >
  ),
  ...pseudoClasses.reduce(
    (acc, pseudo) => ({
      ...acc,
      [`_${pseudo}`]: (css: CSSObject<BaseConfig>) => ({
        [`&:${pseudo}`]: css,
      }),
    }),
    {} as Record<
      `_${(typeof pseudoClasses)[number]}`,
      (css: CSSObject<BaseConfig>) => CSSObject<BaseConfig>
    >
  ),

  // "@phone": (css: CSSProperties) => {
  //   return { "@media (min-width: 240px)": css };
  // },

  // "@pad": (css: CSSProperties) => {
  //   return { "@media (min-width: 768px)": css };
  // },
  // "@pc": (css: CSSProperties) => {
  //   return { "@media (min-width: 1024px)": css };
  // },
} as const satisfies BaseConfig["utils"];
