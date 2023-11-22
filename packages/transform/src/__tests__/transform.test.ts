import { defaultConfig } from "@colliejs/core";
import { transform } from "../transform";
import path from "node:path";

describe("test cases", () => {
  it("StyledComponent ", () => {
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
                },
                dynamic:x=>({
                    borderRadius:x
                })
            }
        }
    });
    export const App = ()=>{
        return <Button css={{color:'blue'}}></Button>
    }
    `;
    const res = transform(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      defaultConfig
    );
    expect(res.code).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-elTJue", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT",
        "variants-dynamic-shape": "variants-dynamic-shape-dlbLfd"
      }, {});
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };"
    `);

    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-Button-elTJue", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT",
        "variants-dynamic-shape": "variants-dynamic-shape-dlbLfd"
      }, {});
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };",
        "styledComponentCssTexts": "@layer app.depTree_test_ts-Button-koVSLF {.baseStyle-Button-elTJue{background:red}.variants-static-shape-round-hECRKn{border-radius:50%}
      .variants-static-shape-rect-iydAuT{border-radius:0}
      .variants-dynamic-shape-dlbLfd{border-radius:var(--variants-dynamic-shape)}
      }

      ",
        "styledElementCssTexts": ".css-kydkiA{color:blue}
      ",
      }
    `);
  });
  it("css layer embed ", () => {
    const code = `
    const Button = styled('button', {
        background: 'red',
    });
    const MyButton = styled(Button, {background:'blue'})
    export const App = ()=>{
        return <MyButton css={{color:'blue'}}></MyButton>
    }
    `;
    const res = transform(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      defaultConfig,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-Button-elTJue", {}, {});
      const MyButton = styled(Button, "baseStyle-MyButton-kQvslT", {}, {});
      export const App = () => {
        return <MyButton className="css-kydkiA"></MyButton>;
      };",
        "styledComponentCssTexts": "@layer app.depTree_test_ts-Button-koVSLF {.baseStyle-Button-elTJue{background:red}}


            @layer , app.depTree_test_ts-MyButton-leUzrZ;
            @layer app.depTree_test_ts-MyButton-leUzrZ {
              .baseStyle-MyButton-kQvslT{background:blue}
            }

      ",
        "styledElementCssTexts": ".css-kydkiA{color:blue}
      ",
      }
    `);
  });

  it("trhow when identify is param at last", () => {
    const code = `
      const MyButton = (props)=>{
        const {className}=props
        return <Button css={{display:'flex'}} className={className}>        
        </Button>
      }
    `;
    expect(transform(code, "moduleId2", defaultConfig)).toMatchInlineSnapshot(`
      {
        "code": "const MyButton = props => {
        const {
          className
        } = props;
        return <Button className={" css-dhzjXW " + className}>        
              </Button>;
      };",
        "styledComponentCssTexts": "",
        "styledElementCssTexts": ".css-dhzjXW{display:flex}
      ",
      }
    `);
  });
});
