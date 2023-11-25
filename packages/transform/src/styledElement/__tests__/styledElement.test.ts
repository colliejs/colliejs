import { defaultConfig } from "@colliejs/core";
import { parseCode } from "../../parse";
import {
  generate,
  isStyledElement,
  parseCodeAndGetBodyN,
  traverse,
} from "../../utils";
import { StyledElement } from "../StyledElement";
import {
  getImportFromSource,
  getPathOfJSXElement,
} from "../../__tests__/common/getPathOfJsxEle";

const transform = (sourceCode: string, n = 0) => {
  const path = getPathOfJSXElement(sourceCode);
  const moduleIdByName = getImportFromSource(sourceCode, __filename);
  const ele = new StyledElement(path, moduleIdByName, defaultConfig);
  const res = ele.transform();
  return {
    code: generate(path.node).code,
    cssText: res.cssText,
  };
};

describe("test cases", () => {
  it("isStyleElement is true if have css prop", () => {
    const sourceCode = ` <Button css={{color:'red'}}>login</Button>`;
    const path = getPathOfJSXElement(sourceCode);
    const res = isStyledElement(path, "css");
    expect(res).toBeTruthy();
  });
  it("isStyleElement is false if without css prop", () => {
    const sourceCode = ` <Button>login</Button>`;
    const code = parseCodeAndGetBodyN(sourceCode, 0);
    const res = isStyledElement(code.expression, "css");
    expect(res).not.toBeTruthy();
  });
  it.todo("should throw error if css prop is not object");

  it("transform", () => {
    const sourceCode = ` 
      
      <Button css={{color:'red'}}>login</Button>    
    `;
    const res = transform(sourceCode);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "<Button className="css-gmqXFB">login</Button>",
        "cssText": ".css-gmqXFB{color:red}",
      }
    `);
  });
  it("className will be combined if existed className is string", () => {
    const sourceCode = ` <Button className="a" css={{color:'red'}}>login</Button>    `;
    const { code } = transform(sourceCode);

    expect(code).toMatchInlineSnapshot(
      `"<Button className={" css-gmqXFB " + "a"}>login</Button>"`
    );
  });
  it("className will be combined if existed className is a dynamic variable", () => {
    const sourceCode = ` <Button className={props.className} css={{color:'red'}}>login</Button>    `;
    const { code } = transform(sourceCode);

    expect(code).toMatchInlineSnapshot(
      `"<Button className={" css-gmqXFB " + props.className}>login</Button>"`
    );
  });
  it.skip("className will be combined if existed className is in restProps. 不支持。需要用户手动处理", () => {
    const sourceCode = ` <Button css={{color:'red'}} {...restProps}>login</Button>    `;
    const { code } = transform(sourceCode);

    expect(code).toMatchInlineSnapshot(
      `"<Button {...restProps} className={" css-gmqXFB " + restProps.className}>login</Button>"`
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
