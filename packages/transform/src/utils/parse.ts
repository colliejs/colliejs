import { ParseResult, parse } from "@babel/parser";

export function parseCode(code: string) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  return ast;
}
