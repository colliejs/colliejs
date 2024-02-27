import { styled } from "../styled";

export const Button = styled(
  "button",
  {
    border: "none",
    color: "$white09",
    fontSize: 28,
    backgroundColor: "red23423",

    variants: {
      size: {
        big: {
          width: 200,
          height: 40,
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
          background: "red",
          color: "white",
        },
      },
    },

    compoundVariants: [
      {
        type: "primary",
        size: "big",
        css: {
          border: "4px solid blue",
          w: "auto",
          background: "green",
        },
      },
    ],
    defaultVariants: {
      size: "big",
    },
  },
);

type X = React.ComponentProps<typeof Button>;
type Y = X["size"];
