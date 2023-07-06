import traverse from "@babel/traverse";
import { getImports, parseCodeAndGetBodyN } from "../../utils";
import { parseCode } from "../../parse";
import { evalPropValue } from "../evalPropValue";
import * as t from "@babel/types";

const getPathOfJSXElement = (source: string) => {
  const file = parseCode(source);
  let path;
  traverse(file, {
    JSXElement(ipath) {
      path = ipath;
      ipath.stop();
    },
  });
  return path;
};
describe("props", () => {
  it("evalPropValue, prop doesnt exist", () => {
    const source = `<Button />`;
    const v = evalPropValue(getPathOfJSXElement(source), "size", {});
    expect(v).toBe(undefined);
  });
  it("evalPropValue ,boolean explict", () => {
    const source = `<Button disabled={false} />`;
    const v = evalPropValue(getPathOfJSXElement(source), "disabled", {});
    expect(v).toBe(false);
  });
  it("evalPropValue ,boolean explict", () => {
    const source = `<Button disabled />`;
    const v = evalPropValue(getPathOfJSXElement(source), "disabled", {});
    expect(v).toBe(true);
  });

  it("evalPropValue, prop with number", () => {
    const source = `<Button size={2} />`;
    const v = evalPropValue(getPathOfJSXElement(source), "size", {});
    expect(v).toBe(2);
  });
  it("evalPropValue, prop with string", () => {
    const source = `<Button size={'tall'} />`;
    const v = evalPropValue(getPathOfJSXElement(source), "size", {});
    expect(v).toBe("tall");
  });
  it("evalPropValue, prop with null", () => {
    const source = `<Button size={null} />`;
    const v = evalPropValue(getPathOfJSXElement(source), "size", {});
    expect(v).toBe(null);
  });
  it("evalPropValue, prop with object ", () => {
    const source = `const x= <Button css={{color:'red'}} />`;
    const v = evalPropValue(getPathOfJSXElement(source), "css", {});
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
    const imports = getImports(parseCode(source).program, __dirname);
    const v = evalPropValue(path, "css", imports);
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
    const imports = getImports(parseCode(source).program, __dirname);

    expect(path.get("openingElement").get("attributes").length).toBe(1);
    const v = evalPropValue(path, "css", imports);
    expect(v).toMatchInlineSnapshot(`
      {
        "background": "gray",
      }
    `);
  });
});
