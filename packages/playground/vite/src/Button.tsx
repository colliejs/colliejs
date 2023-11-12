import { styled } from "@colliejs/react";

export const Button = styled("button", {
  border: "none",
  color: "white",
  backgroundColor: "yellow",
  boxShadow: "0 0 0 10px rgba(0, 0, 0, 0.3)",
  variants: {
    size: {
      big: {
        width: 200,
        height: 40,
      },
    },
  },
});
