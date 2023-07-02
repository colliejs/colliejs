import generate from "@babel/generator";
import { defaultConfig } from "@colliejs/core";
import { parseCode } from "../../parse";
import {
  getImports,
  isStyledComponentDecl,
  parseCodeAndGetBodyN,
  traverse,
} from "../../utils";
import { StyledComponent } from "../StyledComponent";
import * as t from "@babel/types";
//@ts-ignore
global.window = {
  //@ts-ignore
  CSS: {
    supports: () => {
      return true;
    },
  },
};
const prepareStyledComponent = (sourcecode: string, idx: number = 0) => {
  let styledCompDeclPath;

  const fileAst = parseCode(sourcecode);
  const imports = getImports(fileAst.program, __dirname);
  traverse(fileAst, {
    VariableDeclaration(path) {
      if (!isStyledComponentDecl(path.node)) {
        return;
      }
      styledCompDeclPath = path;
    },
  });

  return new StyledComponent(
    parseCodeAndGetBodyN(sourcecode, idx),
    __filename,
    imports,
    fileAst,
    defaultConfig,
    styledCompDeclPath
  );
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
    const c = prepareStyledComponent(code);
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
          const MyButton = styled(Button, {
              background: 'red',
              ...abs({left:100,top:20}),            
          });
          `;
    const c = prepareStyledComponent(code, 2);

    const cwd = process.cwd();
    expect(c.id.componentName).toBe("MyButton");
    expect(c.dependent.id.displayName).toMatchInlineSnapshot(
      `"Button_tsx-Button-eYfSKb"`
    );
    expect(c.layerName).toMatchInlineSnapshot(
      `"styledComponent_test_ts-MyButton-bVmnfB"`
    );
    expect(c.getCssText()).toMatchInlineSnapshot(`
      ".baseStyle-MyButton-CRGDB{background:red;position:absolute;left:100px;right:;top:20px;bottom:}
      "
    `);
    expect(c.cssLayerDep()).toMatchInlineSnapshot(`
      {
        "styledComponent_test_ts-MyButton-bVmnfB": "Button_tsx-Button-eYfSKb",
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

    const c = prepareStyledComponent(code);

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
    const c = prepareStyledComponent(code);

    const astTransformed = c.transform();
    expect(generate(astTransformed.ast).code).toMatchInlineSnapshot(`
      "const Button = styled('button', {}, "baseStyle-Button-gmqXFB", {
        as: 'a'
      });"
    `);
  });
});
