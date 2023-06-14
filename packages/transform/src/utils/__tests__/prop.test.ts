import { parseCodeAndGetBodyN } from "../parseCodeAndGetBody0";
import { getPropValue } from "../prop";

describe("props", () => {
  it("getPropsValue, prop doesnt exist", () => {
    const jsx = parseCodeAndGetBodyN(`<Button />`).expression;
    const v = getPropValue(jsx, "size", {}, {});
    expect(v).toBe(undefined);
  });
  it("getPropsValue ,boolean explict", () => {
    const jsx = parseCodeAndGetBodyN(`<Button disabled={true} />`).expression;
    const v = getPropValue(jsx, "disabled", {}, {});
    expect(v).toBe(true);
  });
  it("getPropsValue, prop without value", () => {
    const jsx = parseCodeAndGetBodyN(`<Button disabled />`).expression;
    const v = getPropValue(jsx, "disabled", {}, {});
    expect(v).toBe(true);
  });
  it("getPropsValue, prop with number", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={2} />`).expression;
    const v = getPropValue(jsx, "size", {}, {});
    expect(v).toBe(2);
  });
  it("getPropsValue, prop with string", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={'tall'} />`).expression;
    const v = getPropValue(jsx, "size", {}, {});
    expect(v).toBe("tall");
  });
  it("getPropsValue, prop with null", () => {
    const jsx = parseCodeAndGetBodyN(`<Button size={null} />`).expression;
    const v = getPropValue(jsx, "size", {}, {});
    expect(v).toBe(null);
  });
  it("getPropsValue, prop with object ", () => {
    const jsx = parseCodeAndGetBodyN(
      `<Button css={{color:'red'}} />`
    ).expression;
    const v = getPropValue(jsx, "css", {}, {});
    expect(v).toEqual({ color: "red" });
  });
  it.todo("getPropsValue, prop with object having variable reference")
});
