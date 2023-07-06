import { parse } from "@babel/parser";

export const parseCode = (code: string) => {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  return ast;
};
/**
 *   return parse(x, {
    allowReturnOutsideFunction: true,
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  }).program.body[n] as any;
 */