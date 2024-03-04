import React from "react";
import { Button } from "./Button";

const CssButton: React.FC<any> = props => {
  const { ...restProps } = props;
  return (
    <Button
      css={{
        fontSize: 16,
        color: "yellow",
        _hover: {
          color: "red",
        },
      }}
      {...restProps}
    >
      cssButton
    </Button>
  );
};

export default CssButton;
