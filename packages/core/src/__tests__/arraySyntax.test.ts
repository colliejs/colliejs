import { arraySyntax } from "../css";

describe('arraySyntax', () => {
    it('arraySyntax', () => {
      const x = arraySyntax('width', [10, 20, 30], [768, 1366]);
      expect(x).toMatchInlineSnapshot(`
        {
          "@media (max-width:767.9999px)": {
            "width": 10,
          },
          "@media (min-width:1366px)": {
            "width": 30,
          },
          "@media (min-width:768px) and (max-width:1365.9999px)": {
            "width": 20,
          },
        }
      `);
    });

  });