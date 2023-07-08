import { styled } from "@colliejs/react";

export const Button = styled<JSX.IntrinsicElements["button"]>("button", {
  border: "none",
  color: "red",
  boxShadow: "0 0 0 10px rgba(0, 0, 0, 0.3)",
});
