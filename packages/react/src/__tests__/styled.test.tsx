import { makeStyled } from "../makeStyled";
import { defaultConfig } from "@colliejs/config";
import generate from "@babel/generator";
import * as t from "@babel/types";

import {
  getImports,
  parseCode,
  parseCodeAndGetBodyN,
  StyledComponent,
  transform as transform_,
} from "@colliejs/transform";

import TestRenderer from "react-test-renderer";
import React, { AnchorHTMLAttributes, HTMLAttributes } from "react";
import traverse_ from "@babel/traverse";
const styled = makeStyled(defaultConfig);
const traverse = traverse_.default || traverse_;

const transform = (source: string, n: number = 0) => {
  const fileAst = parseCode(source);
  const imports = getImports(fileAst.program, __filename);
  let path;
  traverse(fileAst, {
    VariableDeclaration(p) {
      path = p;
      p.stop();
    },
  });

  const comp = new StyledComponent(path, "moduleId1", imports, defaultConfig);
  return generate(comp.transform().path.node).code;
};




describe("compile styled function", () => {
  it("without variant ", () => {
    const source = `const Button = styled('button',{color:'red'})`;
    const x = transform(source);
    expect(x).toMatchInlineSnapshot(
      `"const Button = styled('button', "baseStyle-Button-129ntb2", [], {}, [], []);"`
    );
  });
  it("with variant ", () => {
    const source = `
      const Button = styled('button',{
        color:'red',
        variants:{
          shape:{
            round:{
              borderRadius: '50%',
            },
            rect:{
              borderRadius: '0%',
            }
          }
        }
      })
  `;
    const x = transform(source);
    expect(x).toMatchInlineSnapshot(
      `"const Button = styled('button', "baseStyle-Button-129ntb2", ["variants-shape-round-jhqrc0", "variants-shape-rect-ptwk5x"], {}, [], []);"`
    );
  });
  it("dynamic variant", () => {
    const source = `
    const Button = styled('button',{
      color:'red',
      variants:{
        shape:{
          round:{
            borderRadius: '50%',
          },

          dynamic(x){
            return {
              borderRadius: x,
            }
          }
        },
        big:{
          true:{
            fontSize: 20,
          }
        }
      }
    })
`;
    const code = transform(source);
    expect(code).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-129ntb2", ["variants-shape-round-jhqrc0", "variants-big-true-1ja8ftc"], {
        "variants-shape-dynamic-t61aqk": {
          "canAddPx": true
        }
      }, [], []);"
    `);
  });
});

describe("render StyledComponent", () => {
  it("render StyledComponent", () => {
    const Text = styled(
      "div",
      "baseStyle-Text-xxxx",
      ["variants-shape-round-efgha2"],
      { "variants-width-dynamic-2ab23": { canAddPx: true } },
      []
    );
    const comp = TestRenderer.create(<Text width={2}>hello</Text>);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="baseStyle-Text-xxxx  variants-width-dynamic-2ab23"
        style={
          {
            "--variants-width": "2px",
          }
        }
      >
        hello
      </div>
    `);
    const comp1 = TestRenderer.create(<Text shape={"round"}>hello</Text>);
    expect(comp1.toJSON()).toMatchInlineSnapshot(`
      <div
        className="baseStyle-Text-xxxx  variants-shape-round-efgha2"
      >
        hello
      </div>
    `);
  });

  it("render StyledComponent width dynamic variant ", () => {
    const styled = makeStyled({ ...defaultConfig, breakpoints: [320, 768] });

    const Text = styled("div", "", [], {
      "variants-shape-dynamic-2ab23": { canAddPx: true },
    });
    const comp = TestRenderer.create(<Text shape={[2, 3]}>hello</Text>);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="  variants-shape-dynamic-2ab23"
        style={
          {
            "--variants-shape-at320": "2px",
            "--variants-shape-at768": "3px",
          }
        }
      >
        hello
      </div>
    `);
  });
  it("render StyledComponent width dynamic variant support full devices ", () => {
    const styled = makeStyled({ ...defaultConfig, breakpoints: [320, 768] });

    const Text = styled("div", "", [], {
      "variants-shape-dynamic-2ab23": { canAddPx: true },
    });
    const comp = TestRenderer.create(<Text shape={3}>hello</Text>);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="  variants-shape-dynamic-2ab23"
        style={
          {
            "--variants-shape-at320": "3px",
            "--variants-shape-at768": "3px",
          }
        }
      >
        hello
      </div>
    `);
  });
  it("render StyledComponent width dynamic variant canAddPx = false ", () => {
    const Text = styled("div", "", [], {
      "variants-shape-dynamic-2ab23": { canAddPx: false },
    });
    const comp = TestRenderer.create(<Text shape={3}>hello</Text>);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="  variants-shape-dynamic-2ab23"
        style={
          {
            "--variants-shape": 3,
          }
        }
      >
        hello
      </div>
    `);
  });

  it("styled function width as option", () => {
    const Comp = styled("div", "baseStyle-gmqXFB", [], {}, [], [], { as: "a" });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
      />
    `);
  });
  it("web component should use `class` attributes", () => {
    const Comp = styled("div", "baseStyle-gmqXFB", [], {}, [], [], {
      as: "u-stack", //因为div没有as属性，所以不会被替换为u-stack
    });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <u-stack
        class="baseStyle-gmqXFB "
      />
    `);
  });

  it("native attr  ", () => {
    const Comp = styled("a", "baseStyle-gmqXFB", [], {}, [], [], {
      target: "_blank",
    });
    const comp = TestRenderer.create(<Comp target="_self" round />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
        round={true}
        target="_self"
      />
    `);
    const comp1 = TestRenderer.create(<Comp />);
    expect(comp1.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
        target="_blank"
      />
    `);
  });
  it("attrs for event ", () => {
    const Link = styled("a", "baseStyle-gmqXFB", [], {}, [], [], {
      onClick: () => {},
    });
    const comp = TestRenderer.create(<Link />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
        onClick={[Function]}
      />
    `);
  });

  //============================================================================
  // 暂时不支持在attr中使用dynamic variant
  //============================================================================
  it.skip("attr need static analysis ", () => {
    return 0;
  });

  it("render wrapper component with Component Inside", () => {
    const InnerLink = styled(
      "a",
      "baseStyle-gmqXFB",
      ["variants-shape-round-hECRKn"],
      {}
    );
    const MyLink = styled(
      InnerLink,
      "baseStyle-xxxxx",
      ["variants-rect-true-hECRKx"],
      {}
    );
    const comp = TestRenderer.create(
      <MyLink rect shape="round" unexpectForward />
    );
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB baseStyle-xxxxx  variants-rect-true-hECRKx variants-shape-round-hECRKn"
        unexpectForward={true}
      />
    `);
  });
  it("css attributes", () => {
    const Link = styled(
      "a",
      "baseStyle-gmqXFB",
      ["variants-shape-round-hECRKn"],
      {}
    );
    const code = `<Link css={{ background: "red" }}/>`;
    const res = transform_(code, "module-id", defaultConfig);
    const className = res.code.match(/className="(.*)"/)?.[1];
    const t = React.createElement(Link, {
      className: className,
      shape: "round",
    });

    const comp = TestRenderer.create(t);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB css-16n2od3 variants-shape-round-hECRKn"
      />
    `);
  });
});
