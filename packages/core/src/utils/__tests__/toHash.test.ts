import { toHash } from "../toHash";

describe("test cases", () => {
  it("should work ", () => {
    expect(toHash({})).toBe("PJLV");
  });
});
