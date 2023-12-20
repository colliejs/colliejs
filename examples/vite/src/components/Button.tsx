import { styled } from "../styled";

export const Button = styled("button", {
  border: "none",
  color: "$white09",
  fontSize: 28,
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
