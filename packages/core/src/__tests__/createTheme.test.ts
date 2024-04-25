import { createTheme } from "../createTheme";

describe("test cases", () => {
  it("should work ", () => {
    const config = {
      prefix: "co",
      theme: {
        colors: { primary: "blue", secondary: "white", positiveColor: "blue" },
      },
    };
    const x = createTheme(config.prefix, config.theme);
    expect(x).toMatchInlineSnapshot(
      `":root{--co-colors-primary:blue;--co-colors-secondary:white;--co-colors-positiveColor:blue}"`
    );
  });
});
