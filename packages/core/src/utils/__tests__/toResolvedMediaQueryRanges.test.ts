import { toResolvedMediaQueryRanges } from '../toResolvedMediaQueryRanges';

describe('test cases', () => {
  it('should work ', () => {
    const mediaQuery =
      '(min-width: 100px) and (max-width< 200px) and (height < 50px)';
    const resolvedMediaQuery = toResolvedMediaQueryRanges(mediaQuery);
    expect(resolvedMediaQuery).toMatchInlineSnapshot(
      `"(min-width: 100px) and (max-max-width:199.9375px) and (max-height:49.9375px)"`
    );
  });
});
