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

type A = React.ComponentProps<typeof ImageButton>;
type x = React.DialogHTMLAttributes<HTMLDialogElement>;
type a = A["form"];
const X: React.FC = () => {
  return <ImageButton ref={} />;
};
