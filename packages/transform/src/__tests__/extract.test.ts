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

    expect(res["styledComponentCssTexts"]).toMatchInlineSnapshot(`
      "@layer app.depTreeTestTs-Button-17gsmmh {.baseStyle-16n2od3{background:red}.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-shape-rect-4trf62{border-radius:0}
      @media (min-width:320px){.variants-shape-dynamic-16i60sc{border-radius:var(--variants-shape-at320)}}
      @media (min-width:768px){.variants-shape-dynamic-16i60sc{border-radius:var(--variants-shape-at768)}}
      }

      "
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
        "layerDepsObject": {
          "depTreeTestTs-Button-17gsmmh": "",
        },
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-size-big-1ja8ftc{font-size:20px}
      .compoundVariants-shape-round-size-big-13qnc0g{color:green}
      }

      ",
        "styledElementCssTexts": "",
      }
    `);
  });
  it("embed css layer ", () => {
    const code = `
    const Button = styled('button', {
        background: 'red',
    });
    const MyButton = styled(Button, {background:'blue'})
    export const App = ()=>{
        return <MyButton ></MyButton>
    }
    `;
    const res = transform(
      code,
      path.resolve(__dirname, "./extract.test.ts"),
      config,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "baseStyle-16n2od3", [], {}, [], []);
      const MyButton = styled(Button, "baseStyle-zuqrxm", [], {}, [], []);
      export const App = () => {
        return <MyButton></MyButton>;
      };",
        "layerDepsObject": {
          "extractTestTs-Button-n6n5qt": "",
          "extractTestTs-MyButton-18m9bz5": "extractTestTs-Button-n6n5qt",
        },
        "styledComponentCssTexts": "@layer app.extractTestTs-Button-n6n5qt {.baseStyle-16n2od3{background:red}}


            @layer , app.extractTestTs-MyButton-18m9bz5;
            @layer app.extractTestTs-MyButton-18m9bz5 {
              .baseStyle-zuqrxm{background:blue}
            }

      ",
        "styledElementCssTexts": "",
      }
    `);
  });
  it("extract css from CSSObject ", () => {
    const code = `

    export const App = ()=>{
        return <div className={css({color:'red'})}></div>
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
        "code": "export const App = () => {
        return <div className={css({
          color: 'red'
        })}></div>;
      };",
        "layerDepsObject": {},
        "styledComponentCssTexts": "",
        "styledElementCssTexts": "",
      }
    `);
  });

  it("as type annanation ", () => {
    const code = `
    const Button = styled('button', {
        variants:{
          shape:{            
            dynamic:x=>({gap:x} as StyledObject<object>),
          }
        }
    });
    export const App = ()=>{
        return <Button></Button>
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
        "code": "const Button = styled('button', "", [], {
        "variants-shape-dynamic-1emb4hy": {
          "canAddPx": true
        }
      }, [], []);
      export const App = () => {
        return <Button></Button>;
      };",
        "layerDepsObject": {
          "depTreeTestTs-Button-17gsmmh": "",
        },
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {@media (min-width:320px){.variants-shape-dynamic-1emb4hy{gap:var(--variants-shape-at320)}}
      @media (min-width:768px){.variants-shape-dynamic-1emb4hy{gap:var(--variants-shape-at768)}}
      }

      ",
        "styledElementCssTexts": "",
      }
    `);
  });
});
