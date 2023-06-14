import { parseStyledComponentDeclaration } from './../parseStyledComponent';
import { parseCode } from "../../parse";
import { getImports, parseCodeAndGetBodyN } from "../../utils";
import CustomComponent from "../CustomComponent";
const moduleId = "moduleId1";
describe("test cases", () => {
  it("style host component ", () => {
    const expr = `const Button = styled('button',{color:'red'})`;
    const ast = parseCodeAndGetBodyN(expr, 0);
    const result = parseStyledComponentDeclaration(ast, {}, ast, __filename);
    expect(result.dependent.id.componentName).toBe("button");
    expect(result.dependent.id.moduleId).toBe(undefined);
    expect(result.styledComponentName).toBe("Button");
    expect(result.styling).toEqual({ color: "red" });
  });

  it("style custom component ", () => {
    const expr = `
    import Button from 'antd';
    const RedButton = styled(Button,{color:'red'})`;
    const x = parseCodeAndGetBodyN(expr, 1);
    const result = parseStyledComponentDeclaration(
      x,
      {
        Button: { moduleId: "./Button" },
      },
      parseCode(expr),
      __filename
    );
    expect(result.dependent instanceof CustomComponent).toBeTruthy();
    expect(result.dependent.id.moduleId).toBe("./Button");
    expect(result.styledComponentName).toBe("RedButton");
    expect(result.styling).toEqual({ color: "red" });
  });

  it("styling with variable ", () => {
    const expr = `
    import Button from 'antd';
    const big = '100px';
    const RedButton = styled(Button,{width:big})`;
    const x = parseCodeAndGetBodyN(expr, 2);
    const fileAst = parseCode(expr);
    const result = parseStyledComponentDeclaration(
      x,
      {
        Button: { moduleId: "./Button" },
      },
      fileAst,
      __filename
    );
    expect(result.dependent instanceof CustomComponent).toBeTruthy();
    expect(result.dependent.id.moduleId).toBe("./Button");
    expect(result.styledComponentName).toBe("RedButton");
    expect(result.styling).toEqual({ width: "100px" });
  });
  it("styling with internal definition  ", () => {
    const expr = `
    const  Button = styled('button',{width:50});
    const RedButton = styled(Button,{width:100})`;
    const styledComp = parseCodeAndGetBodyN(expr, 1);
    const fileAst = parseCode(expr);
    const result = parseStyledComponentDeclaration(
      styledComp,
      getImports(fileAst.program, __dirname),
      fileAst,
      __filename
    );
    expect(result.styling).toEqual({ width: 100 });
  });
  it("styling with external  ", () => {
    const expr = `
    import {stripUnit} from 'polished';
    import Button from 'antd';
    const RedButton = styled(Button,{width:stripUnit('100px')})`;
    const styledComp = parseCodeAndGetBodyN(expr, 2);
    const fileAst = parseCode(expr);
    const result = parseStyledComponentDeclaration(
      styledComp,
      getImports(fileAst.program, __dirname),
      fileAst,
      __filename
    );
    expect(result.styling).toEqual({ width: 100 });
  });
  it("tsAsExpression ", () => {
    const expr = `
    import Button from 'antd';
    const RedButton = styled(Button as any,{width:100})`;
    const styledComp = parseCodeAndGetBodyN(expr, 1);
    const fileAst = parseCode(expr);

    const result = parseStyledComponentDeclaration(
      styledComp,
      getImports(fileAst.program, __dirname),
      fileAst,
      __filename
    );
    // expect(result).toMatchInlineSnapshot(``)
    expect(result.dependent.id.toString()).toEqual("antd-Button");
    expect(result.styling).toEqual({ width: 100 });
  });
  it("tsAsExpression ", () => {
    const expr = `const RedButton = styled('div' as any,{width:100})`;
    const styledComp = parseCodeAndGetBodyN(expr);
    const result = parseStyledComponentDeclaration(
      styledComp,
      {},
      {},
      __filename
    );
    expect(result.dependent.id.toString()).toEqual("div");
    expect(result.styling).toEqual({ width: 100 });
  });
});
