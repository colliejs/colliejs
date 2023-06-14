import { isStyledElement } from "./../../utils/variableDecl";
import { getImports } from "./../../utils/importer";
import { defaultConfig } from "@colliejs/core";
import { parseCode } from "../../parse";
const { default: generate } = require("@babel/generator");
import { parseCodeAndGetBodyN } from "../../utils";
import { StyledElement } from "../StyledElement";

const transform = (sourceCode: string, n = 0) => {
  const code = parseCodeAndGetBodyN(sourceCode, n);
  const fileAst = parseCode(sourceCode);
  const moduleIdByName = getImports(fileAst.program, __dirname);
  const btn = new StyledElement(
    code.expression,
    moduleIdByName,
    fileAst,
    defaultConfig
  );
  const res = btn.transform();
  return {
    code: generate(res.ast).code,
    cssText: res.cssText,
    cssFileName: res.cssFileName,
  };
};

describe("test cases", () => {
  it("isStyleElement is true if have css prop", () => {
    const sourceCode = ` <Button css={{color:'red'}}>login</Button>`;
    const code = parseCodeAndGetBodyN(sourceCode, 0);
    const res = isStyledElement(code.expression);
    expect(res).toBeTruthy();
  });
  it("isStyleElement is false if without css prop", () => {
    const sourceCode = ` <Button>login</Button>`;
    const code = parseCodeAndGetBodyN(sourceCode, 0);
    const res = isStyledElement(code.expression);
    expect(res).not.toBeTruthy();
  });
  it.todo("should throw error if css prop is not object");

  it("transform", () => {
    const sourceCode = ` <Button css={{color:'red'}}>login</Button>    `;
    const res = transform(sourceCode);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "<Button className="css-gmqXFB">login</Button>",
        "cssFileName": "Button-css-gmqXFB.css",
        "cssText": ".css-gmqXFB{color:red}",
      }
    `);
  });
  it("className will be combined", () => {
    const sourceCode = ` <Button className="a" css={{color:'red'}}>login</Button>    `;
    const { code } = transform(sourceCode);

    expect(code).toMatchInlineSnapshot(
      `"<Button className="a css-gmqXFB">login</Button>"`
    );
  });
  it("css props with variable", () => {
    const sourceCode = `
        const style = {color:'red'};
        <Button css={{...style}}>login</Button>
    `;
    const res = transform(sourceCode, 1);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "<Button className="css-gmqXFB">login</Button>",
        "cssFileName": "Button-css-gmqXFB.css",
        "cssText": ".css-gmqXFB{color:red}",
      }
    `);
  });
  //=====================================================================================================
  // style是一个indentifer，但是这个identifier是一个对象，这个对象是可以被解析的。
  //=====================================================================================================
  it("css props with variable", () => {
    const sourceCode = `
        const style = {color:'red',lineHeight:1};
        <Button css={style}>login</Button>
    `;
    const res = transform(sourceCode, 1);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "<Button className="css-IdMHn">login</Button>",
        "cssFileName": "Button-css-IdMHn.css",
        "cssText": ".css-IdMHn{color:red;line-height:1}",
      }
    `);
  });

  //===========================================================================
  // 暂时不支持。
  // TODO:使用css variable来实现
  //===========================================================================
  it.failing(
    "css props with variable which is dynamic(cannot be get at compile time)",
    () => {
      const sourceCode = `
       const Foo = (props) => {
        return <Button css={{w:props.width}}>login</Button>
       }
    `;
      const res = transform(sourceCode, 1);
      expect(res).toMatchInlineSnapshot(`
              {
              
              }
          `);
    }
  );
});
