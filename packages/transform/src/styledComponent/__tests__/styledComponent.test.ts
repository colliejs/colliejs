import { StyledComponent } from "../StyledComponent";
import {
  getImportFromSource,
  getPathOfStyledComponentDecl,
} from "../../__tests__/common/getPathOfJsxEle";
import { generate } from "../../utils";
import { defaultConfig } from "@colliejs/core";
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
      "@layer styledComponent_test_ts-Button-bpDyiB {.baseStyle-Button-elTJue{background:red}.variants-static-shape-round-hECRKn{border-radius:50%}
      .variants-static-shape-rect-iydAuT{border-radius:0}
      }
      "
    `);

    /**
     * transform
     */
    const { path } = c.transform();
    expect(generate(path.node).code).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-elTJue", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, {});"
    `);
  });
});
//===========================================================================
// Path: packages/ast/src/component/__tests__/styledComponent.test.ts
//===========================================================================

describe("3rdComponent", () => {
  it("basic ", () => {
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

    expect(c.layerName).toMatchInlineSnapshot(
      `"styledComponent_test_ts-MyButton-bVmnfB"`
    );
    expect(c.getCssText()).toMatchInlineSnapshot(`
      "
            @layer Button_tsx-Button-eYfSKb, styledComponent_test_ts-MyButton-bVmnfB;
              
            @layer styledComponent_test_ts-MyButton-bVmnfB { 
              .baseStyle-MyButton-CRGDB{background:red;position:absolute;left:100px;right:;top:20px;bottom:} 
            }
      "
    `);
    expect(c.cssLayerDep()).toMatchInlineSnapshot(`
          {
            "styledComponent_test_ts-MyButton-bVmnfB": "Button_tsx-Button-eYfSKb",
          }
      `);
  });
  it("My layerName is calculated by moduleId and className", () => {
    const code = `
  import { Button } from './Button';
  import {abs} from '@unstyled-ui/css';
      const MyButton = styled(Button, {
          background: 'red',
          ...abs({left:100,top:20}),            
      });
      `;
    const myButton = prepareStyledComponent(code);
    expect(myButton.id.uniqName).toEqual(myButton.layerName);
    expect(myButton.id.uniqName).toEqual(
      "styledComponent_test_ts-MyButton-bVmnfB"
    );
  });
});
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
    expect(generate(astTransformed.path.node).code).toMatchInlineSnapshot(`
      "const Button = styled('button', "", {
        "variants-dynamic-shape": "variants-dynamic-shape-kfXiog"
      }, {});"
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
  });
});

describe("compoundVariants", () => {
  it("should work ", () => {
    const code = `
    const Button = styled('button', {
       color:'red',
       variants:{
        shape:{
          round:{}
        },
        size:{
          big:{}
        },
       },
       compoundVariants:[{
          shape:'round',
          size:'big',
          css:{
            background:'red'
          }
       }]
    });
    const btn= <Button shape={10} />
    `;
    const c = prepareStyledComponent(code);
    const astTransformed = c.transform();
    expect(generate(astTransformed.path.node).code).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-gmqXFB", {
        "variants-static-shape-round": "variants-static-shape-round-PJLV",
        "variants-static-size-big": "variants-static-size-big-PJLV"
      }, {
        "compoundVariants-shape-round-size-big": "compoundVariants-shape-round-size-big-elTJue"
      });"
    `);
  });
});
