import { traverse } from "../module";
import { parseCode } from "../parse";
import { getImports } from "../../utils";
import * as t from "@babel/types";
import { removeTypeAnnotation } from "../removeType";
import { evalObjectExp } from "../eval/evalObjectExp";
import { describe, it, expect } from "vitest";

const evalObjectString = (sourcecode: string) => {
  const fileAst = parseCode(sourcecode);
  const imports = getImports(fileAst.program, __filename);
  let res;
  traverse(fileAst, {
    ObjectExpression(path) {
      removeTypeAnnotation(path);
      const lastOne = fileAst.program.body.length - 1;
      if (
        t.isNodesEquivalent(
          path.node,
          fileAst.program.body[lastOne].declarations[0].init
        )
      ) {
        res = evalObjectExp(path, imports);
        path.stop();
      }
    },
  });
  return res;
};

describe("test cases", () => {
  it.skip("x", () => {
    const code = `
    const a = 2;
    const o = {
      foo(){
        const a=0;
        return a;
      }
    }`;
    const res = evalObjectString(code);
    res;
    expect(res.foo()).toMatchInlineSnapshot(`0`);
  });

  it("call expression ", () => {
    const code = `
      import Image from './fixtures/dog.jpeg';
      const k = 222
      const abs=(x)=>{return {
         position: x
      }};
      const o = {
          color:'red',
          backgroundImage:\`url(\${Image})\`,
          ...abs('fixed')
      }`;
    const res = evalObjectString(code);
    expect(res).toMatchInlineSnapshot(`
      {
        "backgroundImage": "url(/src/utils/__tests__/fixtures/dog.jpeg)",
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

  it("wit.skiph external module ", () => {
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

  it("多级引用", () => {
    const expr = `
      import {stripUnit} from 'polished';
      const w = stripUnit('1000px');
      const o = {
          width:w,
      }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });

  it("xx ", () => {
    const expr = `
      import {stripUnit} from 'polished';
      const o = {
          width:stripUnit('1000px'),
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
          [media]:{color:'whit.skipe'},
      }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({
      "@media screen and (min-width: 768px)": { color: "whit.skipe" },
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

  it("object expression wit.skiph ObjectMethod", () => {
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

  it("object expression wit.skiph ObjectMethod which have callExpression", () => {
    const expr = `
      const color='red'
      const o = {
          foo:(w)=>( {background:color}),
      }
      `;
    const res = evalObjectString(expr, 1);
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
    const res = evalObjectString(expr);
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

    const res = evalObjectString(expr);
    expect(res).toMatchInlineSnapshot(`
        {
          "dynamic": [Function],
        }
      `);
  });
  it("identifier", () => {
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
  it.todo("how to deal console.log");
});
