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
      "const Button = styled('button', {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, "baseStyle-Button-elTJue");
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };"
    `);
    expect(res.cssLayerDep).toMatchInlineSnapshot(`
      {
        "moduleId2-Button-eoQCcI": "button",
      }
    `);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const Button = styled('button', {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
      }, "baseStyle-Button-elTJue");
      export const App = () => {
        return <Button className="css-kydkiA"></Button>;
      };",
        "cssLayerDep": {
          "moduleId2-Button-eoQCcI": "button",
        },
        "cssText": "@layer moduleId2-Button-eoQCcI {.baseStyle-Button-elTJue{background:red}.variants-static-shape-round-hECRKn{border-radius:50%}
      .variants-static-shape-rect-iydAuT{border-radius:0}
      }

      .css-kydkiA{color:blue}",
      }
    `);
  });

  it("styledElement", () => {
    const code = `
      const MyButton = (props)=>{
        const {className}=props
        return <Button css={{display:'flex'}} className={className}>
          <button>
            <Text css={{alignItem:"center"}}>hello</Text>
          </button>
        </Button>
      }
    `;

    const res = transform(code, "moduleId2", {}, defaultConfig);
    console.log(res);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const MyButton = () => {
        return <Button className="css-dhzjXW">
              <button>
                <Text className="css-djzozw">hello</Text>
              </button>
              </Button>;
      };",
        "cssLayerDep": {},
        "cssText": ".css-dhzjXW{display:flex}.css-djzozw{align-item:center}",
      }
    `);
  });
  it("styledElement", () => {
    const code = `
      const MyButton = (props)=>{
        const {className}=props
        return <Button css={{display:'flex'}} className={className}>
          <button>
            <Text css={{alignItem:"center"}}>hello</Text>
          </button>
        </Button>
      }
    `;

    const res = transform(code, "moduleId2", {}, defaultConfig);
    console.log(res);
    expect(res).toMatchInlineSnapshot(`
      {
        "code": "const MyButton = () => {
        return <Button className="css-dhzjXW">
              <button>
                <Text className="css-djzozw">hello</Text>
              </button>
              </Button>;
      };",
        "cssLayerDep": {},
        "cssText": ".css-dhzjXW{display:flex}.css-djzozw{align-item:center}",
      }
    `);
  });us
});
