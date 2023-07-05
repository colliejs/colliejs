import traverse from "@babel/traverse";
import { getImports, parseCodeAndGetBodyN } from "../../utils";
import { parseCode } from "../../parse";
import { evalPropValue } from "../evalPropValue";

describe("props", () => {
  it("evalPropValue, prop doesnt exist", () => {
    const jsx = parseCodeAndGetBodyN(`<Button />`).expression;
    const v = evalPropValue(jsx, "size", {}, {});
    expect(v).toBe(undefined);
  });
  it("evalPropValue ,boolean explict", () => {
    const jsx = parseCodeAndGetBodyN(`<Button disabled={true} />`).expression;
    const v = evalPropValue(jsx, "disabled", {}, {});
    expect(v).toBe(true);
  });
  it("evalPropValue, prop without value", () => {
    const jsx = parseCodeAndGetBodyN(`<Button disabled />`).expression;
    const v = evalPropValue(jsx, "disabled", {}, {});
    expect(v).toBe(true);
  });
  it("evalPropValue, prop with number", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={2} />`).expression;
    const v = evalPropValue(jsx, "size", {}, {});
    expect(v).toBe(2);
  });
  it("evalPropValue, prop with string", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={'tall'} />`).expression;
    const v = evalPropValue(jsx, "size", {}, {});
    expect(v).toBe("tall");
  });
  it("evalPropValue, prop with null", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={null} />`).expression;
    const v = evalPropValue(jsx, "size", {}, {});
    expect(v).toBe(null);
  });
  it("evalPropValue, prop with object ", () => {
    const code = `const x= <Button css={{color:'red'}} />`;
    const file = parseCode(code);
    let path;
    traverse(file, {
      JSXElement(ipath) {
        path = ipath;
      },
    });

    const v = evalPropValue(path.node, "css", {}, path);
    expect(v).toEqual({ color: "red" });
  });
  it("evalPropValue, prop with object having variable reference", () => {
    const code = `
    import {flexCenter} from './fixture'
    const innerBoxStyle = {
      background: "gray",
      ...flexCenter,
      w: 50,
      h: 50,
    };
    <Button css={{color:'red',...innerBoxStyle}} >hello</Button>`;
    const file = parseCode(code);
    let path;
    traverse(file, {
      JSXElement(ipath) {
        path = ipath;
      },
    });
    const imports = getImports(file.program, __dirname);
    const v = evalPropValue(path.node, "css", imports, path);
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
});
