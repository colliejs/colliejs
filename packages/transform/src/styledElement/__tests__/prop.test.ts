import traverse from "@babel/traverse";
import { parseCodeAndGetBodyN } from "../../utils";
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
  it.todo("evalPropValue, prop with object having variable reference");
});
