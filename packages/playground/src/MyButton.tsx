import { styled } from "@colliejs/react";
import { Button } from "./Button";
import React from "react";
const width = 200;
const height = 40;

const MyButton = styled(Button, {
  w: width,
  height: height,
  backgroundColor: "red",

  variants: {
    shape: {
      square: {
        borderRadius: 0,
      },
      round: {
        borderRadius: 92299,
      },
      dynamic_borderRadius_at: x => {
        return {
          borderRadius: x,
        };
      },
    },
  },
});
// type x = React.ComponentProps<typeof MyButton>;
// type y = x["shape"];
export default MyButton;
