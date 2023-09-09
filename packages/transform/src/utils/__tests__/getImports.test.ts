import { getImports, parseCode } from "../..";

describe("test cases", () => {
  it("should work ", () => {
    const source = `
        import _ from 'lodash';
        import {stripUnit} from 'polished';
        import {Button} from './fixtures/Button';
        import {RedButton as BeautifulButton} from './fixtures/Button';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const home = process.env.HOME;
    expect(getImports(ast.program, modulePath)).toMatchInlineSnapshot(`
      {
        "BeautifulButton": {
          "importedName": "RedButton",
          "moduleId": "${home}/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "Button": {
          "importedName": "Button",
          "moduleId": "${home}/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "_": {
          "importedName": "default",
          "moduleId": "${home}/code/personal/colliejs/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js",
        },
        "stripUnit": {
          "importedName": "stripUnit",
          "moduleId": "${home}/code/personal/colliejs/node_modules/.pnpm/polished@4.2.2/node_modules/polished/dist/polished.cjs.js",
        },
      }
    `);
  });

  it("get default export", () => {
    const source = `
    import hello from './fixtures/hello';
`;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const importers = getImports(ast.program, modulePath, {});
    const home = process.env.HOME;
    expect(importers).toMatchInlineSnapshot(`
      {
        "hello": {
          "importedName": "default",
          "moduleId": "${home}/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/hello.ts",
        },
      }
    `);
    const x = require(importers["hello"].moduleId);
    expect(x.default).toEqual("hello,world");
  });

  it("alias", () => {
    const source = `
    import {Button} from '@fixtures/Button';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const importers = getImports(ast.program, modulePath, {
      "@fixtures": "/fixtures",
    });
    const home = process.env.HOME;
    expect(importers).toMatchInlineSnapshot(
      `
      {
        "Button": {
          "importedName": "Button",
          "moduleId": "/fixtures/Button",
        },
      }
    `
    );
    // const x = require(importers["Button"].moduleId);
    // expect(x.default).toBe("");
  });

  it("packages", () => {
    const source = `
    import {toHash} from '@colliejs/core';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const importers = getImports(ast.program, modulePath, {});
    const home = process.env.HOME;
    expect(importers).toMatchInlineSnapshot(
      `
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/che3vinci/code/personal/colliejs/packages/core/dist/index.cjs",
        },
      }
    `
    );
    const { toHash } = require(importers["toHash"].moduleId);
    expect(toHash({ a: 1 })).toBe("fRCpkX");
  });

  it("absolute path", () => {
    const source = `
    import {toHash} from '@src/utils/__tests__/fixtures/abs';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const importers = getImports(
      ast.program,
      modulePath,
      { "@src": "/src" },
      process.cwd() + "/packages/transform"
    );
    expect(importers).toMatchInlineSnapshot(
      `
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/che3vinci/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/abs.ts",
        },
      }
    `
    );
  });
  it("index", () => {
    const source = `
    import {toHash} from '@src/utils/__tests__/fixtures';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    const importers = getImports(
      ast.program,
      modulePath,
      { "@src": "/src" },
      process.cwd() + "/packages/transform"
    );
    expect(importers).toMatchInlineSnapshot(
      `
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/che3vinci/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/index.ts",
        },
      }
    `
    );
  });
});
