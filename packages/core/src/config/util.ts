import { CSSProperties } from "../type";

export type RCSSProperties = {
  [k in keyof CSSProperties]?: CSSProperties[k] | CSSProperties[k][];
};

export type Typography = {
  fontSize: RCSSProperties['fontSize'];
  fontWeight: RCSSProperties['fontWeight'];
  lineHeight?: RCSSProperties['lineHeight'];
  letterSpacing?: RCSSProperties['letterSpacing'];
  fontFamily?: RCSSProperties['fontFamily'];
};

export type Animation = Pick<
  CSSProperties,
  | 'animationName'
  | 'animationDelay'
  | 'animationDirection'
  | 'animationDuration'
  | 'animationIterationCount'
  | 'animationTimingFunction'
  | 'animationFillMode'
  | 'animationPlayState'
>;
export type Transition = Pick<
  CSSProperties,
  | 'transitionDelay'
  | 'transitionDuration'
  | 'transitionProperty'
  | 'transitionTimingFunction'
>;
//Attention: don't include ::placeholder pseudo-element
const pseudoElements = [
  'before',
  'after',
  'first-letter',
  'first-line',
];
const pseudoClasses = ['hover', 'focus', 'active', 'focus-within'];

export const utils = {
  w: (w: RCSSProperties['width']) => ({ width: w }),
  h: (h: RCSSProperties['height']) => ({ height: h }),
  minW: (minW: RCSSProperties['minWidth']) => ({ minWidth: minW }),
  minH: (minH: RCSSProperties['minHeight']) => ({ minHeight: minH }),
  maxW: (maxW: RCSSProperties['maxWidth']) => ({ maxWidth: maxW }),
  maxH: (maxH: RCSSProperties['maxHeight']) => ({ maxHeight: maxH }),

  //typo
  typo: (value: Typography) => {
    const hl =
      typeof value.lineHeight === 'number' && value.lineHeight > 5
        ? `${value.lineHeight}px`
        : value.lineHeight;
    return { ...value, lineHeight: hl };
  },

  //margin
  m: (m: RCSSProperties['margin']) => ({ margin: m }),
  mt: (m: RCSSProperties['marginTop']) => ({ marginTop: m }),
  mr: (m: RCSSProperties['marginRight']) => ({ marginRight: m }),
  mb: (m: RCSSProperties['paddingBottom']) => ({ marginBottom: m }),
  ml: (m: RCSSProperties['marginLeft']) => ({ marginLeft: m }),
  mx: (mx: RCSSProperties['marginLeft']) => ({
    marginLeft: mx,
    marginRight: mx,
  }),
  my: (my: RCSSProperties['marginTop']) => ({
    marginTop: my,
    marginBottom: my,
  }),

  //padding
  p: (m: RCSSProperties['padding']) => ({ padding: m }),
  pt: (m: RCSSProperties['paddingTop']) => ({ paddingTop: m }),
  pr: (m: RCSSProperties['paddingRight']) => ({ paddingRight: m }),
  pb: (m: RCSSProperties['paddingBottom']) => ({ paddingBottom: m }),
  pl: (m: RCSSProperties['paddingLeft']) => ({ paddingLeft: m }),
  px: (px: RCSSProperties['paddingLeft']) => ({
    paddingLeft: px,
    paddingRight: px,
  }),
  py: (py: RCSSProperties['paddingTop']) => ({
    paddingTop: py,
    paddingBottom: py,
  }),

  //others shortcuts
  bg: (bg: RCSSProperties['background']) => ({ background: bg }),

  anime: (options: Animation) => ({
    animationFillMode: 'forwards',
    ...options,
  }),
  transi: (trans: Transition) => ({ ...trans }),

  //TODO: img/input dones't support pseudo elements
  ...pseudoElements.reduce(
    (acc, pseudo: string) => ({
      ...acc,
      [`_${pseudo}`]: (css: RCSSProperties) => ({
        [`&::${pseudo}`]: {
          content: '',
          position: 'absolute',
          ...css,
        },
        '&': {
          position: 'relative',
        },
      }),
    }),
    {}
  ),
  ...pseudoClasses.reduce(
    (acc, pseudo: string) => ({
      ...acc,
      [`_${pseudo}`]: (css: RCSSProperties) => ({ [`&:${pseudo}`]: css }),
    }),
    {}
  ),
};
