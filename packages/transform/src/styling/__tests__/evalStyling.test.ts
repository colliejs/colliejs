import { traverse } from "../../utils/module";
import { parseCode } from "../../parse";
import { getImports, parseCodeAndGetBodyN } from "../../utils";
import { evalCodeText } from "../../utils/eval/eval";
import { evalStyling } from "../evalStyling";

const evalObjectString = (sourcecode: string) => {
  const fileAst = parseCode(sourcecode);
  const imports = getImports(fileAst.program, __dirname);
  // fileAst
  let res;
  traverse(fileAst, {
    ObjectExpression(path) {
      res = evalStyling(path.node, imports, path);
    },
  });
  return res;
};

describe("test cases", () => {
  it("x", () => {
    const code = `
    const a = 2;
    const o = {
      foo(){
        const a=0;
        return a;
      }
    }`;
    const res = evalObjectString(code);
    expect(res.foo()).toMatchInlineSnapshot(`0`);
  });

  it.skip("call expression ", () => {
    const code = `
      import Image from './fixtures/dog.jpeg';
      // const abs=(x)=>({posit.skipion:x});
      const o = {
          color:'red',
          backgroundImage:\`url(\${Image})\`,
          // ...abs('fixed')
      }`;
    const res = evalObjectString(code);
    expect(res).toMatchInlineSnapshot(`
      {
        "backgroundImage": "url(/Users/che3vinci/code/personal/colliejs/packages/transform/src/styling/__tests__/fixtures/dog.jpeg)",
        "color": "red",
      }
    `);
  });
  /*
  
  it.skip("wit.skiph object in this module ", () => {
    const expr = `
      const flex = {display:'flex'}
      const o = {
          ...flex,
      }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ display: "flex" });
  });
  it.skip("wit.skiph external module ", () => {
    const expr = `
      import {pos,flex} from './fixtures/abs';
      const o = {
          color:'red',
          ...pos('fixed'),
          ...flex,
      }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", posit.skipion: "fixed", display: "flex" });
  });
  it.skip("variable in this module ", () => {
    const expr = `
      const big = '100px';
      const o = {
          color:'red',
          width:big,
      }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", width: "100px" });
  });
  it.skip("variable in relative module ", () => {
    const expr = `
      import {big} from './fixtures/abs';
      const o = {
          color:'red',
          width:big,
      }`;

    const res = evalObjectString(expr);

    expect(res).toEqual({ color: "red", width: "100px" });
  });
  it.skip("variable in external module ", () => {
    const expr = `
      import {stripUnit.skip} from 'polished';
      const o = {
          width:stripUnit.skip('1000px'),
      }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });

  it.failing("variable in external module wit.skiphin a file ", () => {
    const expr = `
      import {stripUnit.skip} from 'polished';
      const w = stripUnit.skip('1000px');
      const o = {
          width:w,
      }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });

  it.failing("variable in external module wit.skiphin a file ", () => {
    const expr = `
      import {stripUnit.skip} from 'polished';
      const o = {
          width:stripUnit.skip('1000px');,
      }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ width: 1000 });
  });

  it.skip("shorthand property", () => {
    const expr = `
      const w = 100;
      const o = {
          w,
      }`;
    const res = evalObjectString(expr);
    expect(res).toEqual({ w: 100 });
  });
  it.skip("computed property", () => {
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

  it.skip("relative module", () => {
    const expr = `
      import {big} from './fixtures/abs';
      const o = {
          width:big,
      }`;

    const res = evalObjectString(expr);
    expect(res).toEqual({ width: "100px" });
  });

  it.skip("object expression wit.skiph ObjectMethod", () => {
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
  it.skip("object expression wit.skiph ObjectMethod which have callExpression", () => {
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

  it.skip("object expression wit.skiph ObjectProperties which have ArrowFunction As Value", () => {
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
              "posit.skipion": "fixed",
            }
        `);
    expect(res.bar("fixed")).toMatchInlineSnapshot(`
        {
          "posit.skipion": "fixed",
        }
      `);
    expect(res.zoo("fixed")).toMatchInlineSnapshot(`
        {
          "posit.skipion": "fixed",
        }
      `);
  });
  it.skip("remove type info in typescript", () => {
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
  it.skip("identifier", () => {
    const expr = `
      const o = {
          dynamic(w:number){consolo.log(2);return {width:w}}
      }
      `;

    const res = evalObjectString(expr, 0);
    expect(res).toMatchInlineSnapshot(`
        {
          "dynamic": [Function],
        }
      `);
  });
  */
});
