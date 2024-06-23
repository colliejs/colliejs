import React from "react";
import { Button } from "./Button";
import { css } from "@colliejs/core";

const CssButton: React.FC<any> = props => {
  const { ...restProps } = props;
  return (
    <Button
      className={css({
        fontSize: 16,
        color: "yellow",
        cursor: "pointer",
        _hover: {
          color: "blue",
        },
      })}
      {...restProps}
    >
      cssButton
    </Button>
  );
};

export default CssButton;
