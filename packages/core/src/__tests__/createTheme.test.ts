import { defaultConfig } from "../config";
import { createTheme } from "../createTheme";

describe("test cases", () => {
  it("should work ", () => {
    const x = createTheme({
      ...defaultConfig,
      theme: {
        colors: { primary: "blue", secondary: "white", positiveColor: "blue" },
      },
    });
    x;
    expect(x).toMatchInlineSnapshot(
      `":root{--co-colors-primary:blue;--co-colors-secondary:white;--co-colors-positiveColor:blue}"`
    );
  });
});
