import React from "react";
import { Button } from "./Button";
import { css } from "@colliejs/core";

const MyCssButton: React.FC<any> = props => {
  const { ...restProps } = props;
  return (
    <Button
      className={css({
        fontSize: 16,
        color: "yellow",
        _hover: {
          color: "red",
        },
      })}
      {...restProps}
    >
      cssButton
    </Button>
  );
};

export default MyCssButton;
