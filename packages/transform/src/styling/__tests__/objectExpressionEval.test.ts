import { parseCode } from "../../parse";
import {
  getFileModuleImport,
  getImports,
  parseCodeAndGetBodyN,
} from "../../utils";
import { ObjectExpressionEval } from "../objectExpressionEval";

const evalObjectString = (code: string, objectExpIndex = 1) => {
  const objexp = parseCodeAndGetBodyN(code, objectExpIndex).declarations[0]
    .init;
  const exp = new ObjectExpressionEval(objexp);
  const fileAst = parseCode(code);
  const imports = getImports(fileAst.program, __dirname);
  const context = getFileModuleImport(imports);
  const res = exp
    .prepareEvaluableObjectExp(imports, fileAst)
    .eval(context);
  return res;
};

describe("test cases", () => {
  it("call expression ", () => {
    const code = `
    import Image from './fixtures/dog.jpeg';
    const abs=(x)=>({position:x});
    const o = {
        color:'red',
        backgroundImage:\`url(\${Image})\`,
        ...abs('fixed')
    }`;

    const res = evalObjectString(code, 2);
    expect(res).toMatchInlineSnapshot(`
      {
        "backgroundImage": "url(${process.env.HOME}/code/personal/colliejs/packages/transform/src/styling/__tests__/fixtures/dog.jpeg)",
        "color": "red",
        "position": "fixed",
      }
    `);
  });
  it("with object in this module ", () => {
    const expr = `
    const flex = {display:'flex'}
    const o = {
        ...flex,
    }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ display: "flex" });
  });
  it("with external module ", () => {
    const expr = `
    import {pos,flex} from './fixtures/abs';
    const o = {
        color:'red',
        ...pos('fixed'),
        ...flex,
    }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", position: "fixed", display: "flex" });
  });
  it("variable in this module ", () => {
    const expr = `
    const big = '100px';
    const o = {
        color:'red',
        width:big,
    }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", width: "100px" });
  });
  it("variable in relative module ", () => {
    const expr = `
    import {big} from './fixtures/abs';
    const o = {
        color:'red',
        width:big,
    }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", width: "100px" });
  });
  it("variable in external module ", () => {
    const expr = `
    import {stripUnit} from 'polished';
    const o = {
        width:stripUnit('1000px'),
    }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });
  /**
   * TODO: 现在不支持这种情况
   */
  it.failing("variable in external module within a file ", () => {
    const expr = `
    import {stripUnit} from 'polished';
    const w = stripUnit('1000px');
    const o = {
        width:w,
    }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });
  /**
   * TODO:现在不支持这种情况
   */
  it.failing("variable in external module within a file ", () => {
    const expr = `
    import {stripUnit} from 'polished';
    const o = {
        width:stripUnit('1000px');,
    }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });

  it("shorthand property", () => {
    const expr = `
    const w = 100;
    const o = {
        w,
    }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ w: 100 });
  });
  it("computed property", () => {
    const expr = `
    const media = '@media screen and (min-width: 768px)';
    const o = {
        [media]:{color:'white'},
    }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({
      "@media screen and (min-width: 768px)": { color: "white" },
    });
  });

  it("relative module", () => {
    const expr = `
    import {big} from './fixtures/abs';
    const o = {
        width:big,
    }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ width: "100px" });
  });

  it("object expression with ObjectMethod", () => {
    const expr = `
    const o = {
        foo(w){return {width:w}}
    }
    `;
    const res = evalObjectString(expr, 0);
    expect(res).toMatchInlineSnapshot(`
      {
        "foo": [Function],
      }
    `);
  });
  it("object expression with ObjectMethod which have callExpression", () => {
    const expr = `
    const color='red'
    const o = {
        foo:(w)=>( {background:color}),        
    }
    `;
    const res = evalObjectString(expr, 1);
    console.dir(res.foo);
    expect(res.foo()).toMatchInlineSnapshot(`
      {
        "background": "red",
      }
    `);
  });

  it("object expression with ObjectProperties which have ArrowFunction As Value", () => {
    const expr = `
    import {pos,flex} from './fixtures/abs';
    const o = {
      foo:(w)=>( {...pos(w)}), 
      bar:(x)=>({...pos(x)}),
      zoo:function(y){
        return {...pos(y)}
      }        
    }
    `;
    const res = evalObjectString(expr, 1);
    expect(res.foo("fixed")).toMatchInlineSnapshot(`
          {
            "position": "fixed",
          }
      `);
    expect(res.bar("fixed")).toMatchInlineSnapshot(`
      {
        "position": "fixed",
      }
    `);
    expect(res.zoo("fixed")).toMatchInlineSnapshot(`
      {
        "position": "fixed",
      }
    `);
  });
  it("remove type info in typescript", () => {
    const expr = `
    const o = {
        dynamic(w:number){return {width:w}}
    }
    `;

    const res = evalObjectString(expr, 0);
    expect(res).toMatchInlineSnapshot(`
      {
        "dynamic": [Function],
      }
    `);
  });
});
