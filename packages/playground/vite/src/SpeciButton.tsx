import { styled } from "@colliejs/react";
import MyButton from "./MyButton";

export const SpecialButton = styled(MyButton, {
  border: "3px solid blue",
  color: "blue",
});

export const SpecialButton2 = props => {
  const { className,...restProps } = props;
  return (
    <div>
      <MyButton className={className} css={{ borderWidth: 12 }} {...restProps}>
        SpecialButton2
      </MyButton>
    </div>
  );
};
