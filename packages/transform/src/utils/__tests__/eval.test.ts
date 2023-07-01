import * as t from "@babel/types";
import { buildObjectExpression } from "../buildObjectExpression";
import { evalExp } from "../eval/eval";

describe("test cases", () => {
  it("object ", () => {
    const exp = buildObjectExpression({ a: 2 });
    const x = evalExp(exp, { a: 2 });
    expect(x).toEqual({ a: 2 });
  });
  it("number ", () => {
    const exp = t.numericLiteral(2);
    const x = evalExp(exp, {});
    expect(x).toEqual(2);
  });
  it("string ", () => {
    const exp = t.stringLiteral("a");
    const x = evalExp(exp, {});
    expect(x).toEqual("a");
  });
});
