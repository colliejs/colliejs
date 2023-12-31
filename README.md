# Advantages

- There is no need to learn the syntax of preprocessors like less/sass/postcss, as you can achieve the same or even more functionality directly using JavaScript.
- CSS encapsulation makes it easy to extend and override styles.
- Better performance, as it transforms the CSS object at build time.
- Boost your development with tailwindcss or @collie-ui/css.
- Excellent TypeScript type hints.
- Supports server-side rendering.
- Supports CSS breakpoint array syntax.
- Supports theme customization and CSS property customization, simplifying CSS development.
- Low learning curve - in 99% of cases, you only need to use the `styled` function.

# Example

```jsx
import { absYCenter } from "@collie-ui/css";
import { makeStyled } from "@colliejs/react";
import { collieConfig } from "../collie.config";
export const styled = makeStyled(collieConfig);

export const StyledButton = styled("button", {
  w: 100,
  h: 40,
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
        true: {
          cursor: "not-allowed",
          background: "$gray200",
        },
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

# How to use

```jsx
const App = (props)=> {
  return <Button shape="round" disabled={props.disabled} >Login<Button/>
}
```
# demo
<iframe src="https://codesandbox.io/p/github/colliejs/examples/main?embed=1&file=%2Fsrc%2FStyledButton.tsx"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="colliejs/examples/main"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
# How to work

- transform the styled object to css text file at the build time
