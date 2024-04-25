import { getImports } from "../importer";
import { parseCode } from "../../utils/parse";

describe("test cases", () => {
  it("should work ", () => {
    const source = `
        import _ from 'lodash';
        import {stripUnit} from 'polished';
        import {Button} from './fixtures/Button';
        import {RedButton as BeautifulButton} from './fixtures/Button';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const home = process.env.HOME;
    expect(getImports(ast.program, curFile)).toMatchInlineSnapshot(`
      {
        "BeautifulButton": {
          "importedName": "RedButton",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "Button": {
          "importedName": "Button",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "_": {
          "importedName": "default",
          "moduleId": "/Users/tom/code/personal/colliejs/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js",
        },
        "stripUnit": {
          "importedName": "stripUnit",
          "moduleId": "/Users/tom/code/personal/colliejs/node_modules/.pnpm/polished@4.2.2/node_modules/polished/dist/polished.cjs.js",
        },
      }
    `);
  });

  it("get default export", () => {
    const source = `
    import hello from './fixtures/hello';
`;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(ast.program, curFile, {});
    const home = process.env.HOME;
    expect(importers).toMatchInlineSnapshot(`
      {
        "hello": {
          "importedName": "default",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/hello.ts",
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
    const curFile = __filename;
    const importers = getImports(ast.program, curFile, {
      "@fixtures": "/fixtures",
    });
    const home = process.env.HOME;
    expect(importers).toMatchInlineSnapshot(`
      {
        "Button": {
          "importedName": "Button",
          "moduleId": "/fixtures/Button",
        },
      }
    `);
    // const x = require(importers["Button"].moduleId);
    // expect(x.default).toBe("");
  });

  it("absolute path", () => {
    const source = `
    import {toHash} from '@src/utils/__tests__/fixtures/abs';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(
      ast.program,
      curFile,
      { "@src": "/src" },
      process.cwd() + "/packages/transform"
    );
    expect(importers).toMatchInlineSnapshot(`
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/abs.ts",
        },
      }
    `);
  });
  it("index", () => {
    const source = `
    import {toHash} from '@src/utils/__tests__/fixtures';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(
      ast.program,
      curFile,
      { "@src": "/src" },
      process.cwd() + "/packages/transform"
    );
    expect(importers).toMatchInlineSnapshot(`
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/index.ts",
        },
      }
    `);
  });
  it("..", () => {
    const source = `
    import {fnUtils} from '..';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(
      ast.program,
      curFile,
      {},
      process.cwd() + "/packages/transform"
    );
    expect(importers).toMatchInlineSnapshot(`
      {
        "fnUtils": {
          "importedName": "fnUtils",
          "moduleId": "/Users/tom/code/personal/colliejs/packages/transform/src/utils/index.ts",
        },
      }
    `);
  });
});
