import { toSizingValue } from '../toSizingValue';
import { describe, it, expect } from "vitest";

describe('test cases', () => {
  it('should work ', () => {
    expect(0).toBe(0);
    const x = toSizingValue('width', '100px');
    expect(x).toMatchInlineSnapshot(`"100px"`);
  });
  it('should work ', () => {
    expect(0).toBe(0);
    const x = toSizingValue('maxWidth', 'stretch');
    expect(x).toMatchInlineSnapshot(
      `"-moz-available;max-width:-webkit-fill-available"`
    );
  });
});
