import { defaultConfig } from "../config";
import { createTheme } from "../createTheme";

describe("test cases", () => {
  it("should work ", () => {
    const x = createTheme(defaultConfig);
    expect(x).toMatchInlineSnapshot(
      `":root{--co--colors-primary:blue;--co--colors-secondary:white}"`
    );
  });
});
