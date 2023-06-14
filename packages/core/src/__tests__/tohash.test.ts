import { toHash } from "../";

describe('toHash', () => {
  it('should work ', () => {
    const x = toHash({ a: 1, b: 3 });
    expect(x).toBe('idzpNY');
  });
});
