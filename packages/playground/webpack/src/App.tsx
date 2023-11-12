import React from "react";
import { styled } from "@colliejs/react";
console.log("styled", styled);
const Button = styled("button", {
  w: 100,
  h: 40,
  background: "White",
});

const App: React.FC = props => {
  const { ...restProps } = props;
  return (
    <div {...restProps}>
      <Button onClick={() => alert("hello")}>Hello</Button>
    </div>
  );
};

export default App;
