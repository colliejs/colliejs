import { StyledComponent } from "../StyledComponent";
import {
  getImportFromSource,
  getPathOfStyledComponentDecl,
} from "../../__tests__/common/getPathOfJsxEle";
import { defaultConfig as _defaultConfig } from "@colliejs/config";
import { describe, it, expect } from "vitest";

const defaultConfig = {
  ..._defaultConfig,
  layername: "app",
};

const prepareStyledComponent = (sourcecode: string) => {
  let styledCompDeclPath = getPathOfStyledComponentDecl(sourcecode);
  return new StyledComponent(
    styledCompDeclPath,
    __filename,
    getImportFromSource(sourcecode, __filename),
    defaultConfig,
    {},
    process.cwd()
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
    expect(c.styledObjectResult).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-16n2od3",
          "cssGenText": ".baseStyle-16n2od3{background:red}",
          "cssRawObj": {
            "background": "red",
          },
        },
        "defaultVariants": {
          "getClassName": [Function],
        },
        "variants-shape-rect": {
          "className": "variants-shape-rect-4trf62",
          "cssGenText": ".variants-shape-rect-4trf62{border-radius:0}",
          "cssRawObj": {
            "borderRadius": 0,
          },
        },
        "variants-shape-round": {
          "className": "variants-shape-round-jhqrc0",
          "cssGenText": ".variants-shape-round-jhqrc0{border-radius:50%}",
          "cssRawObj": {
            "borderRadius": "50%",
          },
        },
      }
    `);

    expect(c.getCssText()).toMatchInlineSnapshot(`
      "@layer app.styledComponentTestTs-Button-1dnxvg0 {.baseStyle-16n2od3{background:red}.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-shape-rect-4trf62{border-radius:0}
      }
      "
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
    const abs = ()=>({position:'absolute'});
      const MyButton = styled(Button, {
          background: 'red',
          ...abs({left:100,top:20}),            
      });
      `;
    const c = prepareStyledComponent(code);

    expect(c.id.componentName).toBe("MyButton");

    expect(c.layerName).toMatchInlineSnapshot(
    `"styledComponentTestTs-MyButton-1raxqd8"`);
    expect(c.getCssText()).toMatchInlineSnapshot(`
      "
            @layer , app.styledComponentTestTs-MyButton-1raxqd8;
            @layer app.styledComponentTestTs-MyButton-1raxqd8 {
              .baseStyle-cwb4fr{background:red;position:absolute}
            }
      "
    `);
  });
  it("My layerName is calculated by moduleId and className", () => {
    const code = `
  import { Button } from './Button';
  const abs = ()=>({})
      const MyButton = styled(Button, {
          background: 'red',
          ...abs({left:100,top:20}),            
      });
      `;
    const myButton = prepareStyledComponent(code);
    expect(myButton.id.uniqName).toEqual(myButton.layerName);
    expect(myButton.id.uniqName).toMatchInlineSnapshot(
      
    `"styledComponentTestTs-MyButton-1raxqd8"`);
  });
});
