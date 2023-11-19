import { useEffect, useRef, useState } from "react";
import MyButton from "./MyButton";
import { SpecialButton, SpecialButton2 } from "./SpeciButton";
import { Button } from "./Button";
import React from "react";
import CssButton from "./CssButton";

export default function App() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    ref.current?.focus?.();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Button size="big">Button</Button>
      <MyButton shape={"round"}> MyButton</MyButton>
      <MyButton shape={[12]}> MyButton</MyButton>
      <br />
      <SpecialButton shape={"round"}>SpecialButton1</SpecialButton>
      <br />
      <CssButton></CssButton>
    </div>
  );
}
