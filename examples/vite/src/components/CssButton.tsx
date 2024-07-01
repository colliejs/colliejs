import React from "react";
import { Button } from "./Button";
import { css } from "@colliejs/core";
import { dbg } from "../common/css";

const CssButton: React.FC<any> = props => {
  const { ...restProps } = props;
  return (
    <div
      className={css({
        fontSize: 16,
        color: "yellow",
        cursor: "pointer",
        _hover: {
          color: "blue",
        },
        ...dbg,
      })}
      {...restProps}
    >
      cssButton
      <p>hello,cssButton</p>
    </div>
  );
};

export default CssButton;
