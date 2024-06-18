import { toResolvedSelectors } from '../toResolvedSelectors';
import { describe, it, expect } from "vitest";

describe('test cases', () => {
  it('selector nested ', () => {
    expect(0).toBe(0);
    const x = toResolvedSelectors(['.card'], ['footer', '&.body', '& header']);
    expect(x).toMatchInlineSnapshot(`
      [
        ".card footer",
        ".card.body",
        ".card header",
      ]
    `);
  });
  it('should work ', () => {
    expect(0).toBe(0);
    const x = toResolvedSelectors(
      ['.card', '.modal'],
      ['footer', '&.body', '& header']
    );
    expect(x).toMatchInlineSnapshot(`
      [
        ".card footer",
        ".card.body",
        ".card header",
        ".modal footer",
        ".modal.body",
        ".modal header",
      ]
    `);
  });
  it(':is() ', () => {
    expect(0).toBe(0);
    const x = toResolvedSelectors(
      ['+ .card'],
      ['& header &', 'footer', '&.body']
    );
    expect(x).toMatchInlineSnapshot(`
      [
        ":is(+ .card) header :is(+ .card)",
        "+ .card footer",
        "+ .card.body",
      ]
    `);
  });
});
