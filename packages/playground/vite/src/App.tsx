import { useEffect, useRef, useState } from "react";
import MyButton from "./components/MyButton";
import { SpecialButton } from "./components/SpeciButton";
import { Button } from "./components/Button";
import React from "react";
import CssButton from "./components/CssButton";
import { ThemeButton } from "./components/ThemeButton";
import ResponsiveButton from "./components/ResponsiveButton";
export const pxToVw = (px: number, refWidth: number) =>
  `${(px / refWidth) * 100}vw`;

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
      <ThemeButton>ThemeButton</ThemeButton>
      <ResponsiveButton>ResponsiveButton1</ResponsiveButton>
      <ResponsiveButton x={["300px", "600px"]}>
        ResponsiveButton2 dynamic 
      </ResponsiveButton>
      <ResponsiveButton x={[pxToVw(300, 375), "600px"]}>
        ResponsiveButton use vw
      </ResponsiveButton>
    </div>
  );
}
