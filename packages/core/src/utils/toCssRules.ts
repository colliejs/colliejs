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
import { pxProps } from "@c3/css";

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/;

/** Default toString method of Objects. */
const toStringOfObject = Object.prototype.toString;

export const toCssRules = <Config extends BaseConfig>(
  style: CSS<Config>,
  selectors: string[],
  conditions: string[],
  config: Config,
  onCssText: (cssText: string) => any
) => {
  /**  CSSOM-compatible rule being created. */
  let currentRule: [string[], string[], string[]] | undefined = undefined;

  /** Last utility that was used, cached to prevent recursion. */
  let lastUtil;

  /** Last polyfill that was used, cached to prevent recursion. */
  let lastPoly;

  /** Walks CSS styles and converts them into CSSOM-compatible rules. */
  const walk = (
    /**  Set of CSS styles */
    style: CSS<Config>,
    /**  Selectors that define the elements to which a set of CSS styles apply. */
    selectors: string[],
    /**  Conditions that define the queries to which a set of CSS styles apply. */
    conditions: string[]
  ) => {
    /** @type {keyof style} Represents the left-side "name" for the property (the at-rule prelude, style-rule selector, or declaration name). */
    let name: string;

    /** @type {style[keyof style]} Represents the right-side "data" for the property (the rule block, or declaration value). */
    let data;

    const each = (style: CSS<Config>) => {
      for (name in style) {
        /** Whether the current name represents an at-rule. */
        const isAtRuleLike = name.charCodeAt(0) === 64;

        const datas =
          isAtRuleLike && Array.isArray(style[name])
            ? (style[name] as any[])
            : [style[name]];

        for (data of datas) {
          const camelName = toCamelCase(name);

          /** Whether the current data represents a nesting rule, which is a plain object whose key is not already a util. */
          const isRuleLike =
            typeof data === "object" &&
            data &&
            data.toString === toStringOfObject &&
            (!config.utils[camelName] || !selectors.length);

          // if the left-hand "name" matches a configured utility
          // conditionally transform the current data using the configured utility
          if (camelName in (config.utils || {}) && !isRuleLike) {
            const util = config.utils[camelName];

            if (util !== lastUtil) {
              lastUtil = util;

              each(util(data)); //NOTE:return value of util is CSSObject

              lastUtil = null;

              continue;
            }
          }
          // otherwise, if the left-hand "name" matches a configured polyfill
          // conditionally transform the current data using the polyfill
          else if (camelName in toPolyfilledValue) {
            const poly = toPolyfilledValue[camelName];

            if (poly !== lastPoly) {
              lastPoly = poly;

              each(poly(data)); //TODO:utils 不支持@rule?

              lastPoly = null;

              continue;
            }
          }

          // if the left-hand "name" matches a configured at-rule
          if (isAtRuleLike) {
            // transform the current name with the configured media at-rule prelude
            name = toResolvedMediaQueryRanges(
              name.slice(1) in config.media
                ? "@media " + config.media[name.slice(1)]
                : name
            );
          }

          if (isRuleLike) {
            /** Next conditions, which may include one new condition (if this is an at-rule). */
            const nextConditions = isAtRuleLike
              ? conditions.concat(name)
              : [...conditions];

            /** Next selectors, which may include one new selector (if this is not an at-rule). */
            const nextSelections = isAtRuleLike
              ? [...selectors]
              : toResolvedSelectors(selectors, name.split(comma));

            if (currentRule !== undefined) {
              onCssText(toCssString(...currentRule));
            }

            currentRule = undefined;

            walk(data, nextSelections, nextConditions);
          } else {
            if (currentRule === undefined)
              currentRule = [[], selectors, conditions];

            /** CSS left-hand side value, which may be a specially-formatted custom property. */
            name =
              !isAtRuleLike && name.charCodeAt(0) === 36 //'$' sign
                ? `--${toTailDashed(config.prefix)}${name
                    .slice(1)
                    .replace(/\$/g, "-")}`
                : name;

            /** CSS right-hand side value, which may be a specially-formatted custom property. */
            data =
              // preserve object-like data
              isRuleLike
                ? data
                : // replace specially-marked numeric property values with pixel versions
                typeof data === "number"
                ? data && camelName in pxProps
                  ? String(data) + "px"
                  : String(data)
                : // replace tokens with stringified primitive values
                  toTokenizedValue(
                    toSizingValue(camelName, data == null ? "" : data),
                    config.prefix,
                    config.themeMap[camelName]
                  );

            currentRule[0].push(
              `${isAtRuleLike ? `${name} ` : `${toHyphenCase(name)}:`}${data}`
            );
          }
        }
      }
    };

    each(style);

    if (currentRule !== undefined) {
      onCssText(toCssString(...currentRule));
    }
    currentRule = undefined;
  };

  walk(style, selectors, conditions);
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
