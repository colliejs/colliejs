import * as t from "@babel/types";
import {isPlainObject} from "lodash-es";
import log from "npmlog";

/**
 * 支持数组和对象
 * @param obj {a:2,}
 * @param replacer
 * @returns
 */

export const buildObjectExpression = (
  obj: Record<string, any>,
  replacer?: (val: any) => any
) => {
  const isArray = Array.isArray(obj);
  let exp: t.ObjectExpression | t.ArrayExpression;
  if (isArray) {
    exp = t.arrayExpression([]);
  } else if (isPlainObject(obj)) {
    exp = t.objectExpression([]);
  } else {
    throw new Error("not support type");
  }
  for (const [key, val] of Object.entries(obj)) {
    let value: t.Expression;

    if (Array.isArray(val)) {
      value = t.arrayExpression(
        val.map(v => buildObjectExpression(v, replacer))
      );
    } else {
      switch (typeof val) {
        case "string": {
          value = replacer?.(val) || t.stringLiteral(val);
          break;
        }
        case "number":
          value = t.numericLiteral(val);
          break;
        case "boolean":
          value = t.booleanLiteral(val);
          break;
        case "object": {
          if (val === null) {
            continue;
          }
          value = buildObjectExpression(val, replacer);
          break;
        }
        case "undefined":
          continue;
        default:
          log.error("val=", typeof val);
          throw new Error(`not support type ${typeof val}`);
      }
    }
    if (t.isArrayExpression(exp)) {
      exp.elements.push(value);
    } else {
      const prop = t.objectProperty(t.stringLiteral(key), value);
      exp.properties.push(prop);
    }
  }
  return exp;
};

export const buildArrayExpression = buildObjectExpression;
