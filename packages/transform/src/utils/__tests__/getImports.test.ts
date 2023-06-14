import { getImportDeclarations, getImports, parseCode } from "../..";

describe("test cases", () => {
  it("should work ", () => {
    const source = `
        import _ from 'lodash';
        import {stripUnit} from 'polished';
        import * as t from '@colliejs/core';
        import {Button} from './fixtures/Button';
        import {RedButton as BeautifulButton} from './fixtures/Button';
    `;
    const ast = parseCode(source);
    const modulePath = __dirname;
    expect(getImports(ast.program, modulePath)).toMatchInlineSnapshot(`
      {
        "BeautifulButton": {
          "importedName": "RedButton",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "Button": {
          "importedName": "Button",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/Button.tsx",
        },
        "_": {
          "importedName": "default",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js",
        },
        "stripUnit": {
          "importedName": "stripUnit",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/node_modules/.pnpm/polished@4.2.2/node_modules/polished/dist/polished.cjs.js",
        },
        "t": {
          "importedName": "*",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/packages/core/dist/index.cjs",
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
    const importers = getImports(ast.program, modulePath);
    expect(importers).toMatchInlineSnapshot(`
      {
        "hello": {
          "importedName": "default",
          "moduleId": "/Users/colliejs.org/code/personal/colliejs/packages/transform/src/utils/__tests__/fixtures/hello.ts",
        },
      }
    `);
    const x = require(importers["hello"].moduleId);
    expect(x.default).toEqual("hello,world");
  });
});
