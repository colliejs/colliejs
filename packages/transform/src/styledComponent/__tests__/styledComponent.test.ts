import { getImportFromSource } from "./../../__tests__/common/getPathOfJsxEle";
import generate from "@babel/generator";
import { defaultConfig } from "@colliejs/core";

import { StyledComponent } from "../StyledComponent";
import * as t from "@babel/types";
import { getPathOfStyledComponentDecl } from "../../__tests__/common/getPathOfJsxEle";
//@ts-ignore
global.window = {
  //@ts-ignore
  CSS: {
    supports: () => {
      return true;
    },
  },
};
const prepareStyledComponent = (sourcecode: string) => {
  let styledCompDeclPath = getPathOfStyledComponentDecl(sourcecode);
  console.log("__filename", __filename);
  return new StyledComponent(
    styledCompDeclPath,
    __filename,
    getImportFromSource(sourcecode, __dirname),
    defaultConfig
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
          "cssGenText": ".baseStyle-Button-elTJue{background:red}",
          "cssRawObj": {
            "background": "red",
          },
        },
        "variants-static-shape-rect": {
          "className": "variants-static-shape-rect-iydAuT",
          "cssGenText": ".variants-static-shape-rect-iydAuT{border-radius:0}",
          "cssRawObj": {
            "borderRadius": 0,
          },
        },
        "variants-static-shape-round": {
          "className": "variants-static-shape-round-hECRKn",
          "cssGenText": ".variants-static-shape-round-hECRKn{border-radius:50%}",
          "cssRawObj": {
            "borderRadius": "50%",
          },
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
    const c = prepareStyledComponent(code);

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
