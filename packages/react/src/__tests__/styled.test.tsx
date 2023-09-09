import { defaultConfig } from "@colliejs/core";
import generate from "@babel/generator";
import * as t from "@babel/types";
import {
  getImports,
  parseCode,
  parseCodeAndGetBodyN,
  StyledComponent,
  transform as transform_,
} from "@colliejs/transform";

import { styled } from "../styled";
import TestRenderer from "react-test-renderer";
import React, { AnchorHTMLAttributes, HTMLAttributes } from "react";
import traverse_ from "@babel/traverse";
const traverse = traverse_.default || traverse_;

const transform = (source: string, n: number = 0) => {
  console.log("parseCodeAndGetBodyN", parseCodeAndGetBodyN);
  const ast = parseCodeAndGetBodyN(source, n);
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
      `"const Button = styled('button', "baseStyle-Button-gmqXFB", {}, {});"`
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
    expect(x).toMatchInlineSnapshot(`
      "const Button = styled('button', "baseStyle-Button-gmqXFB", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-static-shape-rect": "variants-static-shape-rect-ehcAoa"
      }, {});"
    `);
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
      "const Button = styled('button', "baseStyle-Button-gmqXFB", {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-dynamic-shape": "variants-dynamic-shape-dlbLfd",
        "variants-static-big-true": "variants-static-big-true-euIQPz"
      }, {});"
    `);
  });
});

describe("render StyledComponent", () => {
  it("render StyledComponent", () => {
    const Text = styled(
      "div",
      "baseStyle-Text-xxxx",
      {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
        "variants-dynamic-width": "variants-dynamic-width-dBkvcz",
      },
      {}
    );
    const comp = TestRenderer.create(<Text width={2}>hello</Text>);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="baseStyle-Text-xxxx  variants-dynamic-width-dBkvcz"
        style={
          {
            "--variants-dynamic-width": 2,
          }
        }
      >
        hello
      </div>
    `);
    const comp1 = TestRenderer.create(<Text shape={"round"}>hello</Text>);
    expect(comp1.toJSON()).toMatchInlineSnapshot(`
      <div
        className="baseStyle-Text-xxxx  variants-static-shape-round-hECRKn"
      >
        hello
      </div>
    `);
  });
  it("styled function width as option", () => {
    const Comp = styled("div", "baseStyle-gmqXFB", {}, {}, { as: "a" });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
      />
    `);
  });
  it("web component should use `class` attributes", () => {
    const Comp = styled("div", "baseStyle-gmqXFB", {}, {}, { as: "u-stack" });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <u-stack
        class="baseStyle-gmqXFB "
      />
    `);
  });

  it("enable wrapper", () => {
    const Comp = styled("div", "baseStyle-gmqXFB", {}, {}, { wrapper: "a" });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB "
      >
        <div />
      </a>
    `);
  });

  it("add wrapper for 3rd component", () => {
    const Button = props => {
      return <button>hello</button>;
    };
    const Comp = styled(Button, "baseStyle-gmqXFB", {}, {}, { wrapper: "div" });
    const comp = TestRenderer.create(<Comp />);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <div
        className="baseStyle-gmqXFB "
      >
        <button>
          hello
        </button>
      </div>
    `);
  });
  it("native attr  ", () => {
    const Comp = styled(
      "a",
      "baseStyle-gmqXFB",
      {},
      {},
      {
        attrs: { target: "_blank" },
      }
    );
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
    const Link = styled(
      "a",
      "baseStyle-gmqXFB",
      {},
      {},
      {
        attrs: { onClick: () => {} },
      }
    );
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
      {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
      },
      {}
    );
    const MyLink = styled(
      InnerLink,
      "baseStyle-xxxxx",
      {
        "variants-static-rect-true": "variants-static-rect-true-hECRKx",
      },
      {}
    );
    const comp = TestRenderer.create(
      <MyLink rect shape="round" unexpectForward />
    );
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB baseStyle-xxxxx  variants-static-rect-true-hECRKx variants-static-shape-round-hECRKn"
        unexpectForward={true}
      />
    `);
  });
  it("css attributes", () => {
    const Link = styled(
      "a",
      "baseStyle-gmqXFB",
      {
        "variants-static-shape-round": "variants-static-shape-round-hECRKn",
      },
      {}
    );
    const code = `<Link css={{ background: "red" }} />`;
    const res = transform_(code, "module-id", defaultConfig);
    const className = res.code.match(/className="(.*)"/)?.[1];
    const t = React.createElement(Link, {
      className: className,
    });

    const comp = TestRenderer.create(t);
    expect(comp.toJSON()).toMatchInlineSnapshot(`
      <a
        className="baseStyle-gmqXFB css-elTJue"
      />
    `);
  });
});
