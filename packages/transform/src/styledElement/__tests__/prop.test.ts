import traverse from "@babel/traverse";
import {
  getAttr,
  getImports,
  isPropExisted,
  parseCodeAndGetBodyN,
} from "../../utils";
import { parseCode } from "../../parse";
import { evalValueOfProp } from "../evalValueOfProp";
import * as t from "@babel/types";
import { getPathOfJSXElement } from "../../__tests__/common/getPathOfJsxEle";

describe("props", () => {
  it("isPropsExisted", () => {
    const source = `<Button className={'xxx'}/>`;
    const path = getPathOfJSXElement(source);
    expect(isPropExisted(path, "className")).toBe(true);
  });
  it("isPropsExisted2", () => {
    const source = `<Button/>`;
    const path = getPathOfJSXElement(source);
    expect(isPropExisted(path, "className")).toBe(false);
  });
  it("evalPropValue, prop doesnt exist", () => {
    const source = `<Button />`;
    expect(() =>
      evalValueOfProp(getPathOfJSXElement(source), "size", {})
    ).toThrow();
  });
  it("evalPropValue ,boolean explict", () => {
    const source = `<Button disabled={false} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "disabled", {});
    expect(v).toBe(false);
  });
  it("evalPropValue ,boolean explict", () => {
    const source = `<Button disabled />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "disabled", {});
    expect(v).toBe(true);
  });

  it("evalPropValue, prop with number", () => {
    const source = `<Button size={2} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "size", {});
    expect(v).toBe(2);
  });
  it("evalPropValue, prop with string", () => {
    const source = `<Button size={'tall'} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "size", {});
    expect(v).toBe("tall");
  });
  it("evalPropValue, prop with null", () => {
    const source = `<Button size={null} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "size", {});
    expect(v).toBe(null);
  });
  it("evalPropValue, prop with object ", () => {
    const source = `const x= <Button css={{color:'red'}} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "css", {});
    expect(v).toEqual({ color: "red" });
  });
  it("evalPropValue, prop with object ", () => {
    const source = `
    const a= 'red';
    const x= <Button css={{color:a}} />`;
    const v = evalValueOfProp(getPathOfJSXElement(source), "css", {});
    expect(v).toEqual({ color: "red" });
  });
  it("evalPropValue, prop with object having variable reference", () => {
    const source = `
    import {flexCenter} from './fixture'
    const innerBoxStyle = {
      background: "gray",
      ...flexCenter,
      w: 50,
      h: 50,
    };
    <Button css={{color:'red',...innerBoxStyle}} >hello</Button>`;
    const path = getPathOfJSXElement(source);
    const imports = getImports(parseCode(source).program, __filename);
    const v = evalValueOfProp(path, "css", imports);
    expect(v).toMatchInlineSnapshot(`
      {
        "alignItems": "center",
        "background": "gray",
        "color": "red",
        "display": "flex",
        "h": 50,
        "justifyContent": "center",
        "w": 50,
      }
    `);
  });
  it("evalPropValue, prop with object having variable reference", () => {
    const source = `
    let innerBoxStyle = {
      background: "gray",
    };
    <Button css={innerBoxStyle} >hello</Button>
    innerBoxStyle={background:'red'}
      `;
    const path = getPathOfJSXElement(source);
    const imports = getImports(parseCode(source).program, __filename);

    expect(path.get("openingElement").get("attributes").length).toBe(1);
    const v = evalValueOfProp(path, "css", imports);
    expect(v).toMatchInlineSnapshot(`
      {
        "background": "gray",
      }
    `);
  });
});
