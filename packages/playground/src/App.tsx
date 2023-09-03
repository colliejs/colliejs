import { useEffect, useRef, useState } from "react";
import MyButton from "./MyButton";
import { SpecialButton, SpecialButton2 } from "./SpeciButton";
import { Button } from "./Button";

export default function App() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    ref.current?.focus?.();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Button>Button</Button>
      <MyButton shape={"round"}> MyButton</MyButton>
      <br />
      <SpecialButton shape={"round"}>SpecialButton1</SpecialButton>
      <SpecialButton2 shape={"round"}>SpecialButton2</SpecialButton2>
    </div>
  );
}
