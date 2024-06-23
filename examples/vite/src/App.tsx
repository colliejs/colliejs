import { useEffect, useRef, useState } from "react";
import MyButton from "./components/MyButton";
import { SpecialButton } from "./components/SpeciButton";
import { Button } from "@/components/Button";
import React from "react";
import CssButton from "./components/CssButton";
import { ThemeButton } from "./components/ThemeButton";
import ResponsiveButton from "./components/ResponsiveButton";
import { pxToVw } from "@/common/pxToVw";
import { Col } from "./components/Col";
import { Row } from "./components/Row";
import ExampleButton from "./components/ExampleButton";
import "./collie-generated.css";
import { HoverButton } from "./components/HoverButton";
export default function App() {
  return (
    <div>
      <div>
        <Button size="big">big Button</Button>{" "}
        <Button type="title" >
          Button-type-title
        </Button>
        <span> </span>
        <Button size="small"> small Button</Button>
        {<Button size={[60, 120]}> dynamic Button</Button>}
        <Button type="primary">Button-type-primary</Button>
        <HoverButton>Button Hover It </HoverButton>
      </div>

      <Row>
        <MyButton shape={["round"]}> MyButton-1</MyButton>
        <MyButton shape={[12]}> MyButton-272</MyButton>
      </Row>
      <br />
      <SpecialButton shape={"round"}>SpecialButton12</SpecialButton>
      <br />
      <CssButton></CssButton>
      <ThemeButton>ThemeButton</ThemeButton>
      <ResponsiveButton>ResponsiveButton1</ResponsiveButton>
      <ResponsiveButton x={["300px", "600px"]}>
        ResponsiveButton2 dynamic
      </ResponsiveButton>
      <ResponsiveButton x={[pxToVw(300), "600px"]}>
        ResponsiveButton use vw
      </ResponsiveButton>
      <ExampleButton>ExampleButton</ExampleButton>
    </div>
  );
}
