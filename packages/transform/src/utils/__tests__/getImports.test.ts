import { getImports } from "../importer";
import { parseCode } from "../../utils/parse";
import { describe, it, expect } from "vitest";

describe("test cases", () => {
  it("relative path ", () => {
    const source = `
        import _ from 'lodash';
        import {stripUnit} from 'polished';
        import {Button} from './fixtures/Button';
        import {RedButton as BeautifulButton} from './fixtures/Button';
        import * as MyButton from './fixtures/Button';
        import { parse } from "@babel/parser";

    `;
    const ast = parseCode(source);
    const curFile = __filename;
    expect(getImports(ast.program, curFile)).toMatchInlineSnapshot(`
      {
        "BeautifulButton": {
          "importedName": "RedButton",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "Button": {
          "importedName": "Button",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "MyButton": {
          "importedName": "*",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "_": {
          "importedName": "default",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js",
        },
        "parse": {
          "importedName": "parse",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/node_modules/.pnpm/@babel+parser@7.22.5/node_modules/@babel/parser/lib/index.js",
        },
        "stripUnit": {
          "importedName": "stripUnit",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/node_modules/.pnpm/polished@4.2.2/node_modules/polished/dist/polished.cjs.js",
        },
      }
    `);
  });

  it("with alias", () => {
    const source = `
    import {toHash} from '@fixtures/abs';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(
      ast.program,
      curFile,
      { "@fixtures": "/fixtures" },
      __dirname
    );
    expect(importers).toMatchInlineSnapshot(`
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/__tests__/fixtures/abs.ts",
        },
      }
    `);
  });
  it("index", () => {
    const source = `
    import {toHash} from '@fixtures';
    `;
    const ast = parseCode(source);
    const curFile = __filename;
    const importers = getImports(
      ast.program,
      curFile,
      { "@fixtures": "/fixtures" },
      __dirname
    );
    expect(importers).toMatchInlineSnapshot(`
      {
        "toHash": {
          "importedName": "toHash",
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/__tests__/fixtures/index.ts",
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
          "moduleId": "/Users/tom/code/colliedog001/colliejs/packages/transform/src/utils/index.ts",
        },
      }
    `);
  });
});
