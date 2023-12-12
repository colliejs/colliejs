import React from "react";
import { styled } from "../styled";

const ResponsiveButton = styled("button", {
  w: [200, 400, 600],
  h: 40,
  background: "red",
  variants: {
    x: {
      dynamic_at(x) {
        return {
          w: x,
        };
      },
    },
    x2: {
      dynamic_at(x) {
        return {
          w: x,
        };
      },
    },
  },
});
export default ResponsiveButton;
