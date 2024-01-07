import { useEffect, useRef, useState } from "react";
import MyButton from "./components/MyButton";
import { SpecialButton } from "./components/SpeciButton";
import { Button } from "./components/Button";
import React from "react";
import CssButton from "./components/CssButton";
import { ThemeButton } from "./components/ThemeButton";
import ResponsiveButton from "./components/ResponsiveButton";
import { pxToVw } from "./common/pxToVw";
import { Col } from "./components/Col";
import { Row } from "./components/Row";
import ExampleButton from "./components/ExampleButton";

export default function App() {
  return (
    <Col>
      <Row>
        <Button size="big">Button</Button>
        <Button type="primary" size="big">
          Button-Big-Primary
        </Button>
      </Row>
      <Row>
        <MyButton shape={["round"]}> MyButton-1</MyButton>
        <MyButton shape={[12]}> MyButton-2</MyButton>
      </Row>
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
      <ExampleButton>ExampleButton</ExampleButton>
    </Col>
  );
}
