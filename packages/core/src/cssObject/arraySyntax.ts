import _ from "lodash-es";

/**
 * @param propertyKey: "width"
 * @param valueInArray: [10,20]
 * @param breakpoints: [768]
 * @returns :{'@media (max-width:breakpoints[0])':{width:10},'@media (min-width:(breakpoints[0]+1)px)':{width:20}}
 * 实现：
 * - breakpoints[a,b,c]变为区间[[undefined,a],[a,b],[b,c],[c,undefined]]
 * - 每一个区间对应一个media query
 */
export function arraySyntax(
  propertyKey: string,
  valueInArray: any[],
  breakpoints: readonly number[] = []
): Record<`@media ${string}`, object> {
  const mediaQueries = breakpoints
    .map((bk, index) => {
      if (!valueInArray[index]) {
        return undefined;
      }
      return {
        [`@media (min-width:${bk}px)`]: { [propertyKey]: valueInArray[index] },
      };
    })
    .filter(Boolean);
  return mediaQueries.reduce((acc, cur) => ({ ...acc, ...cur }), {});
}

export function isArraySyntax(value: any): value is any[] {
  return Array.isArray(value) && value.length > 0;
}
