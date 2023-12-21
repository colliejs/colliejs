import { config } from "./common/config";
import { transform } from "../transform";
import path from "node:path";

describe("test cases", () => {
  it("StyledComponent with variants and base style ", () => {
    const code = `
    const kk=1;
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
      config
    );
    expect(res.code).toMatchInlineSnapshot(`
      "const kk = 1;
      const Button = styled('button', "baseStyle-Button-16n2od3", ["variants-shape-round-jhqrc0", "variants-shape-rect-4trf62"], {
        "variants-shape-dynamic-16i60sc": {
          "canAddPx": true
        }
      }, [], []);
      export const App = () => {
        return <Button className="css-16d654z"></Button>;
      };"
    `);

    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const kk = 1;
      const Button = styled('button', "baseStyle-Button-16n2od3", ["variants-shape-round-jhqrc0", "variants-shape-rect-4trf62"], {
        "variants-shape-dynamic-16i60sc": {
          "canAddPx": true
        }
      }, [], []);
      export const App = () => {
        return <Button className="css-16d654z"></Button>;
      };",
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {.baseStyle-Button-16n2od3{background:red}.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-shape-rect-4trf62{border-radius:0}
      @media (min-width:320px){.variants-shape-dynamic-16i60sc{border-radius:var(--variants-shape-at320)}}
      @media (min-width:768px){.variants-shape-dynamic-16i60sc{border-radius:var(--variants-shape-at768)}}
      }

      ",
        "styledElementCssTexts": ".css-16d654z{color:blue}
      ",
        "styledThemeCssTexts": "",
      }
    `);
  });
  it("StyledComponent with compound variants ", () => {
    const code = `
    const Button = styled('button', {
        variants:{
            shape:{
                round:{
                    borderRadius: '50%',
                },
            },
            size:{
              big:{
                fontSize: 20,
              }
            }
        },
        compoundVariants:[
          {
            shape:'round',
            size:'big',
            css:{
              color:'green'
            }
          }
        ]
    });
    export const App = ()=>{
        return <Button></Button>
    }
    `;
    const res = transform(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      config
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "", ["variants-shape-round-jhqrc0", "variants-size-big-1ja8ftc"], {}, ["compoundVariants-shape-round-size-big-13qnc0g"], []);
      export const App = () => {
        return <Button></Button>;
      };",
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-size-big-1ja8ftc{font-size:20px}
      .compoundVariants-shape-round-size-big-13qnc0g{color:green}
      }

      ",
        "styledElementCssTexts": "",
        "styledThemeCssTexts": "",
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
      config,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-Button-16n2od3", [], {}, [], []);
      const MyButton = styled(Button, "baseStyle-MyButton-zuqrxm", [], {}, [], []);
      export const App = () => {
        return <MyButton className="css-16d654z"></MyButton>;
      };",
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {.baseStyle-Button-16n2od3{background:red}}


            @layer , app.depTreeTestTs-MyButton-249u39;
            @layer app.depTreeTestTs-MyButton-249u39 {
              .baseStyle-MyButton-zuqrxm{background:blue}
            }

      ",
        "styledElementCssTexts": ".css-16d654z{color:blue}
      ",
        "styledThemeCssTexts": "",
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
    expect(transform(code, "moduleId2", config)).toMatchInlineSnapshot(`
      {
        "code": "const MyButton = props => {
        const {
          className
        } = props;
        return <Button className={" css-1lkilf " + className}>        
              </Button>;
      };",
        "styledComponentCssTexts": "",
        "styledElementCssTexts": ".css-1lkilf{display:flex}
      ",
        "styledThemeCssTexts": "",
      }
    `);
  });
});
