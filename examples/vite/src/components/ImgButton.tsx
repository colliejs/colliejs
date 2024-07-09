import { styled } from "../styled";
import SVG1 from "../images/metamask.png";

console.log("SVG1", SVG1);
export const ImageButton = styled(
  "button",
  {
    w: 101,
    h: 101,

    background: `url("${SVG1}") no-repeat center center`,
  },
  {
    as: "button",
    disabled: true,
  }
);
