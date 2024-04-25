import { styled } from "../styled";
import SVG1 from "@src/images/metamask.png";

export const Button = styled("button", {
  border: "none",
  color: "$white09",
  fontSize: 28,

  backgroundColor: "red",
  py: [10],
  lineHeight: 1,
  background: `url(${SVG1})`,

  variants: {
    size: {
      big: {
        width: 200,
        height: 41,
      },
      small: {
        width: 100,
        height: 20,
      },
    },
    type: {
      primary: {
        background: "blue",
        color: "white",
      },
      secondary: {
        background: "yellow",
        color: "white",
      },
    },
  },

  compoundVariants: [
    {
      type: "primary",
      size: "big",
      css: {
        border: "2px solid blue",
        w: "auto",
        background: "green",
      },
    },
  ],
  defaultVariants: {
    size: "big",
  },
});

type X = React.ComponentProps<typeof Button>;
type Y = X["size"];
