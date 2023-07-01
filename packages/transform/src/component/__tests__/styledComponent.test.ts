import generate from "@babel/generator";
import { defaultConfig } from "@colliejs/core";
import { parseCode } from "../../parse";
import { getImports, parseCodeAndGetBodyN } from "../../utils";
import { StyledComponent } from "../StyledComponent";
//@ts-ignore
global.window = {
  //@ts-ignore
  CSS: {
    supports: () => {
      return true;
    },
  },
};
describe("styledHostComponent", () => {
  it("hostComponent ", () => {
    const code = `
        const Button = styled('button', {
            background: 'red',
            variants:{
                shape:{
                    round:{
                        borderRadius: '50%',
                    },
                    rect:{
                        borderRadius: 0,
                    }
                }
            }
        });`;
    const ast = parseCodeAndGetBodyN(code);
    const c = new StyledComponent(
      ast,
      "module-id-1",
      {},
      parseCode(code),
      defaultConfig
    );
    expect(c.id.componentName).toBe("Button");
    expect(c.dependent.id.toString()).toBe("button");
    expect(c.stylingParsed).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-Button-elTJue",
          "cssObj": {
            "background": "red",
          },
          "cssText": ".baseStyle-Button-elTJue{background:red}",
        },
        "variants-static-shape-rect": {
          "className": "variants-static-shape-rect-iydAuT",
          "cssObj": {
            "borderRadius": 0,
          },
          "cssText": ".variants-static-shape-rect-iydAuT{border-radius:0}",
        },
        "variants-static-shape-round": {
          "className": "variants-static-shape-round-hECRKn",
          "cssObj": {
            "borderRadius": "50%",
          },
          "cssText": ".variants-static-shape-round-hECRKn{border-radius:50%}",
        },
      }
    `);

    expect(c.getCssText()).toMatchInlineSnapshot(`
      ".baseStyle-Button-elTJue{background:red}
      .variants-static-shape-round-hECRKn{border-radius:50%}
      .variants-static-shape-rect-iydAuT{border-radius:0}
      "
    `);

    expect(c.getVariantNames()).toMatchInlineSnapshot(`
      [
        "shape",
      ]
    `);
    /**
     * transform
     */
    const astTransformed = c.transform();
    expect(generate(astTransformed.ast).code).toMatchInlineSnapshot(`
      "const Button = styled('button', {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, "baseStyle-Button-elTJue");"
    `);
  });
  it("3rdComponent ", () => {
    const code = `
      import { Button } from './Button';
      import {abs} from '@unstyled-ui/css';
          const Button = styled(Button, {
              background: 'red',
              ...abs({left:100,top:20}),
            
          });`;
    const ast = parseCodeAndGetBodyN(code, 2);
    const fileAst = parseCode(code);
    const imports = getImports(fileAst.program, __dirname);
    const c = new StyledComponent(
      ast,
      __filename,
      imports,
      fileAst,
      defaultConfig
    );
    const cwd = process.cwd();
    expect(c.id.componentName).toBe("Button");
    // expect(c.dependent.id.toString()).toMatchInlineSnapshot(
    //   `"/Users/colliejs.org/code/personal/colliejs/packages/transform/src/component/__tests__/Button.tsx-Button"`
    // );
    expect(c.dependent.id.displayName).toMatchInlineSnapshot(
      `"Button_tsx-Button-isPius"`
    );
    expect(c.layerName).toMatchInlineSnapshot(
      `"styledComponent_test_ts-Button-juYBS"`
    );
    expect(c.getCssText()).toMatchInlineSnapshot(`
      ".baseStyle-Button-CRGDB{background:red;position:absolute;left:100px;top:20px}
      "
    `);
    expect(c.cssLayerDep()).toMatchInlineSnapshot(`
      {
        "styledComponent_test_ts-Button-juYBS": "Button_tsx-Button-isPius",
      }
    `);
  });
});

//===========================================================================
// Path: packages/ast/src/component/__tests__/styledComponent.test.ts
//===========================================================================
describe("dynamic variable transform", () => {
  it("hostComponent ", () => {
    const code = `
        const Button = styled('button', {
            variants:{
                shape:{
                  dynamic:function(){
                    return {borderRadius:3};
                  }
                }
            }
        });
        const btn= <Button shape={10} />
        `;
    const ast = parseCodeAndGetBodyN(code);
    let c = new StyledComponent(
      ast,
      "module-id-1",
      {},
      parseCode(code),
      defaultConfig
    );

    const astTransformed = c.transform();
    expect(generate(astTransformed.ast).code).toMatchInlineSnapshot(`
      "const Button = styled('button', {
        "variants-dynamic-shape": "variants-dynamic-shape-kfXiog"
      }, "");"
    `);
  });

  it("styledComponent transform with option ", () => {
    const code = `
        const Button = styled('button', {
           color:'red'
        },{as:'a'});
        const btn= <Button shape={10} />
        `;
    const ast = parseCodeAndGetBodyN(code);
    let c = new StyledComponent(
      ast,
      "module-id-1",
      {},
      parseCode(code),
      defaultConfig
    );

    const astTransformed = c.transform();
    expect(generate(astTransformed.ast).code).toMatchInlineSnapshot(`
      "const Button = styled('button', {}, "baseStyle-Button-gmqXFB", {
        as: 'a'
      });"
    `);
  });
});
