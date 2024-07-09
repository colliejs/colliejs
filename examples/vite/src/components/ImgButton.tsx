import { styled } from "../styled";
import SVG1 from "../images/metamask.png";

console.log("SVG1", SVG1);
export const ImageButton = styled(
  "button",
  {
    w: 100,
    h: 100,
    background: `url("${SVG1}") no-repeat center center`,
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
