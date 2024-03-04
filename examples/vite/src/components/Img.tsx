import { styled } from "../styled";
export const ImageButton = styled(
  "img",
  {
    w: 100,
    h: 100,
    variants: {
      type: {
        primary: {
          background: "red",
        },
        secondary: {
          background: "blue",
        },
      },
    },
  },
  {
    as: "button",
    disabled: true,
  }
);

