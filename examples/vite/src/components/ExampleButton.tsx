import { styled } from "../styled";

const Button = styled(
  "button",
  {
    backgroundImage: "linear-gradient(to bottom right, red, blue)",
    backgroundColor: "transparent",
    border: "12px solid black",
    variants: {
      status: {
        disabled: {
          backgroundColor: "gray",
          color: "white",
          pointerEvents: "none",
          cursor: "not-allowed",
        },
        loading: {
          backgroundColor: "blue",
          color: "white",
          pointerEvents: "none",
        },
        active: {
          backgroundColor: "red",
          color: "white",
        },
      },
      shape: {
        pill: {
          borderRadius: 9999,
        },
        rect: {
          borderRadius: 0,
        },
        dynamic: x => ({
          borderRadius: x,
        }),
      },
    },
    defaultVariants: {
      status: "active",
      shape: "rect",
    },
  },
  {
    disabled: true,
    children: <span>loading</span>,
  }
);

const ExampleButton = Button;
export default ExampleButton;
