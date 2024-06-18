import { config } from "./common/config";
import { extractCss } from "../extract";
import path from "node:path";
import { describe, it, expect } from "vitest";

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
    const res = extractCss(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      config
    );

    expect(res["styledComponentCssTexts"]).toMatchInlineSnapshot(`
      "@layer app.depTreeTestTs-Button-19zo4rs {.baseStyle-16n2od3{background:red}.variants-shape-round-jhqrc0{border-radius:50%}
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
    const res = extractCss(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      config
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-19zo4rs {.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-size-big-1ja8ftc{font-size:20px}
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
    const res = extractCss(
      code,
      path.resolve(__dirname, "./extract.test.ts"),
      config,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "styledComponentCssTexts": "@layer app.extractTestTs-Button-ppinw4 {.baseStyle-16n2od3{background:red}}


            @layer , app.extractTestTs-MyButton-1jfewg0;
            @layer app.extractTestTs-MyButton-1jfewg0 {
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
    const res = extractCss(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      config,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "styledComponentCssTexts": "",
        "styledElementCssTexts": ".css-129ntb2{color:red}",
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
    const res = extractCss(
      code,
      path.resolve(__dirname, "./depTree.test.ts"),
      config,
      false
    );
    expect(res).toMatchInlineSnapshot(`
      {
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-19zo4rs {@media (min-width:320px){.variants-shape-dynamic-1emb4hy{gap:var(--variants-shape-at320)}}
      @media (min-width:768px){.variants-shape-dynamic-1emb4hy{gap:var(--variants-shape-at768)}}
      }

      ",
        "styledElementCssTexts": "",
      }
    `);
  });
});
