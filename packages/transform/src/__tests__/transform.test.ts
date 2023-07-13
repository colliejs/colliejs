import { defaultConfig } from "@colliejs/core";
import { transform } from "../transform";

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
                }
            }
        }
    });
    export const App = ()=>{
        return <Button css={{color:'blue'}}></Button>
    }
    `;
    const res = transform(code, "moduleId2", {}, defaultConfig);
    expect(res.code).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-elTJue", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, {});
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };"
    `);
    expect(res.cssLayerDep).toMatchInlineSnapshot(`
      {
        "moduleId2-Button-eoQCcI": "",
      }
    `);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-Button-elTJue", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, {});
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };",
        "cssLayerDep": {
          "moduleId2-Button-eoQCcI": "",
        },
        "cssText": "@layer moduleId2-Button-eoQCcI {.baseStyle-Button-elTJue{background:red}.variants-static-shape-round-hECRKn{border-radius:50%}.variants-static-shape-rect-iydAuT{border-radius:0}
      }

      .css-kydkiA{color:blue}",
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
    const res = transform(code, "moduleId2", {}, defaultConfig);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-Button-elTJue", {}, {});
      const MyButton = styled(Button, "baseStyle-MyButton-kQvslT", {}, {});
      export const App = () => {
        return <MyButton className="css-kydkiA"></MyButton>;
      };",
        "cssLayerDep": {
          "moduleId2-Button-eoQCcI": "",
          "moduleId2-MyButton-jjHfgw": "moduleId2-Button-eoQCcI",
        },
        "cssText": "@layer moduleId2-Button-eoQCcI {.baseStyle-Button-elTJue{background:red}}

            @layer moduleId2-Button-eoQCcI, moduleId2-MyButton-jjHfgw;
              
            @layer moduleId2-MyButton-jjHfgw { 
              .baseStyle-MyButton-kQvslT{background:blue} 
            }

      .css-kydkiA{color:blue}",
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
    expect(transform(code, "moduleId2", {}, defaultConfig))
      .toMatchInlineSnapshot(`
      {
        "code": "const MyButton = props => {
        const {
          className
        } = props;
        return <Button className={" css-dhzjXW " + className}>        
              </Button>;
      };",
        "cssLayerDep": {},
        "cssText": ".css-dhzjXW{display:flex}",
      }
    `);
  });
});
