import { styled } from "../styled";

export const Button = styled("button", {
  border: "none",
  color: "$white09",
  fontSize: 28,
  backgroundColor: "yellow",
  variants: {
    size: {
      big: {
        width: 200,
        height: 40,
      },
    },
    type: {
      primary: {
        background: "blue",
        color: "white",
      },
      secondary: {
        background: "red",
        color: "white",
      },
    },
  },
  compoundVariants: [
    {
      size: "big",
      type: "primary",
      css: {
        border: "4px solid blue",
        w: "auto",
        background: "green",
      },
    },
  ],
  defaultVariants: {
    // size: "big",
    type: "primary",
  },
});
