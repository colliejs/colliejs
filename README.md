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
import { styled } from "@colliejs/react";
import {absYCenter} from '@collie-ui/css'
const Button = styled("button", {
  w: 100,
  h: 40,
  _hover: {
    opacity: 0.8,
  },
  _after:{ // after pseudo element
    background: "$primary",
    h:'100%'.
    w: [10, 4],
    ...absYCenter({righ: 10}),
  }
  variants: {
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
          background: "$gray-200",
        },
      },
    },
  },
});
```

# How to use

```jsx
const App = (props)=> {
  return <Button shape="round" disabled={props.disabled} >Login<Button/>
}
```

# Principle

- transform the styled object to css text file at the build time
