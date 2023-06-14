import { toCssString } from '../toCssRules';

describe('test cases', () => {
  it('should work ', () => {
    expect(0).toBe(0);
    const x = toCssString(
      ['color: red', 'background: blue'],
      ['.button', '.card'],
      ['@media (min-width:100px)', '@media (min-width:200px)']
    );
    expect(x).toMatchInlineSnapshot(
      `"@media (min-width:100px){@media (min-width:200px){.button,.card{color: red;background: blue}}}"`
    );
  });
  it('& sign ', () => {
    expect(0).toBe(0);
    const x = toCssString(
      ['color: red', 'background: blue'],
      ['.button', '&.card'],
      ['@media (min-width:100px)', '@media (min-width:200px)']
    );
    expect(x).toMatchInlineSnapshot(
      `"@media (min-width:100px){@media (min-width:200px){.button,&.card{color: red;background: blue}}}"`
    );
  });
});
