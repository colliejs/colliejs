# Advantages

- static CSS-In-JSS: with the flexible of JavaScript   
- extendable: extend the base Component to enhance the ability
- composable: use mixins to compose mixin
- variants supports: 
- easy to use: in 99% of cases, you only need to use the `styled` function.
- No style collision: CSS encapsulation makes it easy to extend and override styles.
- Better performance: transform the CSS object at build time.
- Boost your development with [@collie-ui/css](https://github.com/colliejs/collie-ui) or tailwindcss(incoming).
- Excellent DX with typescript type hints.
- Supports server-side rendering with nextjs.
- Supports CSS breakpoint array syntax.
- Supports theme customization and CSS property customization, simplifying CSS development.
- have a best integration with react, webpack, rollup, vite, nextjs.

# Example

```jsx
import { absYCenter } from "@collie-ui/css";
import { makeStyled } from "@colliejs/react";
import { collieConfig } from "../collie.config";
export const styled = makeStyled(collieConfig);

const size = variant({
  big: {
    width: 9999,
  },
  sm: {
    width: 20,
  },
});

export const StyledButton = styled("button", {
  w: 100,
  h: 40,
  ...size.big,
  _hover: {
    opacity: 0.8,
    background: "$primary",
    borderRadius: 10,
    color: "white",
  },
  _after: {
    h: "100%",
    w: [10, 4],
    background: "red",
    ...absYCenter({ right: 0 }),
  },

  variants: {
    size: {
      full: {
        w: "100%",
      },
      big: {
        w: 80,
      },
      md: {
        w: 40,
      },
      sm: {
        w: 20,
      },

      dynamic: x => ({
        //any size you want
        w: x,
      }),
    },
    shape: {
      round: {
        borderRadius: 9999,
      },
      rect: {
        borderRadius: 0,
      },
    },
    status: {
      disabled: {
        cursor: "not-allowed",
        background: "$gray200",
      },
    },
    type: {
      subtitle:{
        mixins: ["size.big", "shape.rect"],
      },
      title: {
        minxins: ["type.subtitle", "shape.rect"],
      },
    },
  },

  compoundVariants: [
    {
      size: "big",
      shape: "round",
      css: {
        background: "$gray200",
      },
    },
  ],
  defaultVariants: {
    shape: "rect",
  },
});
```

<div className={css({})}></div>

# How to use

```jsx
import {css} from '@colliejs/core'
const App = (props)=> {
  return <Button shape="round" disabled={props.disabled} className={css({background:'red'})}>Login<Button/>
}
```

# Get started

[completed demo](https://codesandbox.io/p/github/colliejs/examples/main?embed=1&file=%2Fsrc%2FStyledButton.tsx)

know more about examples,

```bash
  git clone https://github.com/colliejs/examples && cd examples && pnpm install && pnpm dev
```

# How does it work

- transform the styled object to css text at build time

# Big thanks

- [stitches](https://github.com/stitchesjs/stitches) - a css-in-js library with multi-variant support
