import React from "react";
import { Button } from "./components/Button";
import { MyButton } from "./components/MyButton";
import { AntdButton } from "./components/AntdButton";

const App: React.FC = props => {
  const { ...restProps } = props;
  return (
    <div {...restProps}>
      <Button onClick={() => alert("hello")}>Hello</Button>
      <MyButton>myButton</MyButton>
      <AntdButton>AntdButton</AntdButton>
    </div>
  );
};

export default App;
