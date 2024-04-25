import { toCamelCase } from "./toCamelCase.js";
import { toHyphenCase } from "./toHyphenCase.js";
import { toPolyfilledValue } from "./toPolyfilledValue.js";
import { toResolvedMediaQueryRanges } from "./toResolvedMediaQueryRanges.js";
import { toResolvedSelectors } from "./toResolvedSelectors.js";
import { toSizingValue } from "./toSizingValue.js";
import { toTailDashed } from "./toTailDashed.js";
import { toTokenizedValue } from "./toTokenizedValue.js";
import { BaseConfig } from "../type";
import { CSS } from "../types/index";
import { pxProps } from "@colliejs/shared";

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/;

/** Default toString method of Objects. */
const toStringOfObject = Object.prototype.toString;

export const toCssRules = <Config extends BaseConfig>(
  cssObject: CSS<Config>,
  selectors: string[],
  conditions: string[],
  config: Config,
  onCssText: (cssText: string) => any
) => {
  /**  CSSOM-compatible rule being created. */
  // currentRule= [declarations, selectors, conditions]
  let currentRule: [string[], string[], string[]] | undefined = undefined;

  /** Last utility that was used, cached to prevent recursion. */
  let lastUtil;

  /** Last polyfill that was used, cached to prevent recursion. */
  let lastPoly;

  /** Walks CSS styles and converts them into CSSOM-compatible rules. */
  const walk = (
    /**  Set of CSS styles */
    cssObject: CSS<Config>,
    /**  Selectors that define the elements to which a set of CSS styles apply. */
    selectors: string[],
    /**  Conditions that define the queries to which a set of CSS styles apply. */
    conditions: string[]
  ) => {
    /** @type {keyof style} Represents the left-side "name" for the property (the at-rule prelude, style-rule selector, or declaration name). */
    let key: string; //keyof CSS<Config>;

    /** @type {style[keyof style]} Represents the right-side "data" for the property (the rule block, or declaration value). */
    let value;

    const each = (cssObject: CSS<Config>) => {
      for (key in cssObject) {
        /** Whether the current name represents an at-rule.
         * @ rule
         * @supports (display: grid) {
         *    display: grid;
         * }
         */
        const isAtRuleLike = key.charCodeAt(0) === 64;

        const values =
          isAtRuleLike && Array.isArray(cssObject[key])
            ? (cssObject[key] as any[])
            : [cssObject[key]];

        for (value of values) {
          const keyInCamel = toCamelCase(key);

          /** Whether the current data represents a nesting rule, which is a plain object whose key is not already a util. */
          const isRuleLike =
            typeof value === "object" &&
            value &&
            value.toString === toStringOfObject &&
            (!config.utils[keyInCamel] || !selectors.length);

          //1.
          // if the left-hand "name" matches a configured utility
          // conditionally transform the current data using the configured utility
          if (keyInCamel in (config.utils || {}) && !isRuleLike) {
            const utilFn = config.utils[keyInCamel];

            if (utilFn !== lastUtil) {
              lastUtil = utilFn;

              each(utilFn(value)); //NOTE:return value of util is CSSObject

              lastUtil = null;

              continue;
            }
          }
          //2.
          // otherwise, if the left-hand "name" matches a configured polyfill
          // conditionally transform the current data using the polyfill
          else if (keyInCamel in toPolyfilledValue) {
            const poly = toPolyfilledValue[keyInCamel];

            if (poly !== lastPoly) {
              lastPoly = poly;

              each(poly(value)); //TODO:utils 不支持@rule?

              lastPoly = null;

              continue;
            }
          }

          // if the left-hand "name" matches a configured at-rule
          if (isAtRuleLike) {
            // transform the current name with the configured media at-rule prelude
            // name = toResolvedMediaQueryRanges(
            //   name.slice(1) in (config.media || {})
            //     ? "@media " + config.media?.[name.slice(1)]
            //     : name
            // );
          }

          if (isRuleLike) {
            /** Next conditions, which may include one new condition (if this is an at-rule). */
            const nextConditions = isAtRuleLike
              ? conditions.concat(key)
              : [...conditions];

            /** Next selectors, which may include one new selector (if this is not an at-rule). */
            const nextSelections = isAtRuleLike
              ? [...selectors]
              : toResolvedSelectors(selectors, key.split(comma));

            if (currentRule !== undefined) {
              onCssText(toCssString(...currentRule));
            }

            currentRule = undefined;

            walk(value, nextSelections, nextConditions);
          } else {
            if (currentRule === undefined)
              currentRule = [[], selectors, conditions];

            /** CSS left-hand side value, which may be a specially-formatted custom property. */
            key =
              !isAtRuleLike && key.charCodeAt(0) === 36 //'$' sign
                ? `--${toTailDashed(config.prefix)}${key
                    .slice(1)
                    .replace(/\$/g, "-")}`
                : key;

            /** CSS right-hand side value, which may be a specially-formatted custom property. */
            value =
              // preserve object-like data
              isRuleLike
                ? value
                : // replace specially-marked numeric property values with pixel versions
                typeof value === "number"
                ? value && keyInCamel in pxProps
                  ? String(value) + "px"
                  : String(value)
                : // replace tokens with stringified primitive values
                  toTokenizedValue(
                    toSizingValue(keyInCamel, value == null ? "" : value),
                    config.prefix,
                    config.themeMap[keyInCamel]
                  );

            currentRule[0].push(
              `${isAtRuleLike ? `${key} ` : `${toHyphenCase(key)}:`}${value}`
            );
          }
        }
      }
    };

    each(cssObject);

    if (currentRule !== undefined) {
      onCssText(toCssString(...currentRule));
    }
    currentRule = undefined;
  };

  walk(cssObject, selectors, conditions);
};

export const toCssString = (
  declarations: string[],
  selectors: string[],
  conditions: string[]
) =>
  `${conditions.map(condition => `${condition}{`).join("")}${
    selectors.length ? `${selectors.join(",")}{` : ""
  }${declarations.join(";")}${selectors.length ? `}` : ""}${Array(
    conditions.length ? conditions.length + 1 : 0
  ).join("}")}`;
