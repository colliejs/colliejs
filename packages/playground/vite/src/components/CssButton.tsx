import React from "react";
import { Button } from "./Button";

const CssButton: React.FC<any> = props => {
  const { ...restProps } = props;
  return (
    <Button
      css={{
        fontSize: 40,
        color:'Pink'
      }}
      {...restProps}
    >
      StyledElement Button
    </Button>
  );
};

export default CssButton;
