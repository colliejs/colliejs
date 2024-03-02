import { StyledComponent } from "../StyledComponent";
import {
  getImportFromSource,
  getPathOfStyledComponentDecl,
} from "../../__tests__/common/getPathOfJsxEle";
import { generate } from "../../utils";
import { defaultConfig } from "@colliejs/config";
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
    getImportFromSource(sourcecode, __filename),
    defaultConfig,
    {},
    process.cwd(),
    true
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
    expect(c.StyledObjectResult).toMatchInlineSnapshot(`
      {
        "baseStyle": {
          "className": "baseStyle-Button-16n2od3",
          "cssGenText": ".baseStyle-Button-16n2od3{background:red}",
          "cssRawObj": {
            "background": "red",
          },
        },
        "defaultVariants": {
          "className": "",
          "cssGenText": "",
          "cssRawObj": {},
        },
        "static-variants-shape-rect": {
          "className": "variants-shape-rect-4trf62",
          "cssGenText": ".variants-shape-rect-4trf62{border-radius:0}",
          "cssRawObj": {
            "borderRadius": 0,
          },
        },
        "static-variants-shape-round": {
          "className": "variants-shape-round-jhqrc0",
          "cssGenText": ".variants-shape-round-jhqrc0{border-radius:50%}",
          "cssRawObj": {
            "borderRadius": "50%",
          },
        },
      }
    `);

    expect(c.getCssText()).toMatchInlineSnapshot(`
      "@layer app.styledComponentTestTs-Button-poy4f0 {.baseStyle-Button-16n2od3{background:red}.variants-shape-round-jhqrc0{border-radius:50%}
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
  import {abs} from '@unstyled-ui/css';
      const MyButton = styled(Button, {
          background: 'red',
          ...abs({left:100,top:20}),            
      });
      `;
    const c = prepareStyledComponent(code);

    expect(c.id.componentName).toBe("MyButton");

    expect(c.layerName).toMatchInlineSnapshot(
      `"styledComponentTestTs-MyButton-14730o8"`
    );
    expect(c.getCssText()).toMatchInlineSnapshot(`
      "
            @layer , app.styledComponentTestTs-MyButton-14730o8;
            @layer app.styledComponentTestTs-MyButton-14730o8 {
              .baseStyle-MyButton-15ag2ji{background:red;position:absolute;left:100px;right:;top:20px;bottom:}
            }
      "
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
    expect(myButton.id.uniqName).toMatchInlineSnapshot(
      `"styledComponentTestTs-MyButton-14730o8"`
    );
  });
});
