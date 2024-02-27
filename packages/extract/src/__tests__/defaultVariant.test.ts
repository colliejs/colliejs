import { config } from "./common/config";
import { transform } from "../transform";
import path from "node:path";

describe("test cases", () => {
  it("StyledComponent with variants and base style ", () => {
    const code = `
    const Button = styled('button', {
        variants:{
            shape:{
                round:{
                    borderRadius: '50%',
                },
                rect:{
                    borderRadius: 0,
                },
            }
        },
        defaultVariants:{
            shape:'round'
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
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', "", ["variants-shape-round-jhqrc0", "variants-shape-rect-4trf62"], {}, [], ["variants-shape-round-jhqrc0"]);
      export const App = () => {
        return <Button className="css-16d654z"></Button>;
      };",
        "styledComponentCssTexts": "@layer app.depTreeTestTs-Button-17gsmmh {.variants-shape-round-jhqrc0{border-radius:50%}
      .variants-shape-rect-4trf62{border-radius:0}
      }

      ",
        "styledElementCssTexts": ".css-16d654z{color:blue}
      ",
        "styledThemeCssTexts": "",
      }
    `);
  });
});
