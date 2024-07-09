import { add } from "../common/util";
import { styled } from "../styled";
export const Button = styled("button", {
  border: "none",
  color: "$white09",
  backgroundColor: "blue",
  py: [10],
  lineHeight: 1,

  variants: {
    shape: {
      round: {
        borderRadius: 999,
      },
      rect: {
        borderRadius: 0,
      },
    },
    italic: {
      true: {
        fontStyle: "italic",
      },
    },
    size: {
      big: {
        width: 200,
        // height: 41,
        fontSize: 28,
      },
      small: {
        width: add(10, 20),
        height: 20,
        fontSize: 14,
        py: 0,
      },
      dynamic: x => ({
        width: x,
        height: `auto`,
      }),
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

      title: {
        mixins: ["shape.round", "size.big"],
        background: "green",
      },
    },
  },
  defaultVariants: {
    size: "big",
  },
});
