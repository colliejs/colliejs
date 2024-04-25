import React from "react";
import { styled } from "../styled";

const ResponsiveButton = styled("button", {
  w: [200, 400],
  h: 40,

  background: "red",
  variants: {
    x: {
      dynamic(x) {
        return {
          w: x,
        };
      },
    },
    x2: {
      dynamic(x) {
        return {
          w: x,
        };
      },
    },
  },
});
export default ResponsiveButton;
