import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { createRequire } from "module";
import log from "npmlog";
import {
  ImportsByName,
  buildObjectExpression,
  fnUtils,
  generate,
  getFileModuleImport,
  getVariableValueInFile,
  load,
  traverse,
} from "../utils/index";
import { evalExp } from "../utils/eval/eval";
import { isNull } from "lodash";
import { evalIdentifer } from "../utils/eval/evalIdentifier";

//@ts-ignore
if (!global.__JEST__) {
  global.require = global.require || createRequire(import.meta.url);
}

//TODO:可不可能重名
export class ObjectExpressionEval {
  constructor(public objectExp: t.ObjectExpression) {}

  /**
   * 将objectExpression中的变量替换为真实值,以便最后计算
   * @param:
   * @returns: [name,args]
   */

  prepareEvaluableObjectExp(imports: ImportsByName = {}, fileAst: t.File) {
    traverse(
      this.objectExp,
      {
        /**
         *
         * @param path
         * @example
         * {
         *  ...abs
         * }
         */
        SpreadElement(path) {
          const varName = path.node.argument;
          if (t.isIdentifier(varName)) {
            //@ts-ignore
            path.node.argument = evalIdentifer(varName, imports, fileAst);
          }
        },
        ObjectProperty(path) {
          const { key, value } = path.node;
          /**
           * 计算属性
           * o={
           *  [foo]:'bar'
           * }
           **/

          if (path.node.computed) {
            path.node.computed = false;
            let newKey = key;
            if (t.isIdentifier(newKey)) {
              //@ts-ignore
              path.node.key = evalIdentifer(newKey, imports, fileAst);
            }
          }

          //处理value
          /**
           * 计算出mycolor的值
           * {
           *    color:mycolor
           * }
           */
          if (t.isIdentifier(value)) {
            if (isArgOfDynamicFunc(path, value.name)) {
              return;
            }
            //@ts-ignore
            path.node.value = evalIdentifer(value, imports, fileAst);
            return;
          }
          /**
           *  o = {
           *   background:colors.grey[100]
           * }
           */
          if (t.isMemberExpression(value)) {
          } else {
            // throw new Error("TODO: not support");
          }
        },
        ObjectMethod(path) {
          // path.skip();
        },
        TSTypeAnnotation(path) {
          path.remove();
        },
        /**
         * 可能在如下几种情况：
         * 1.可能是在ObjectProperty中
         * 2.可能是在SpreadElement中
         * 3.可能在ObjectMethod/ArrowFunctionExpress/FunctionExpression中出现。
         * @example
         * {
         *    ...pos('fixed'),
         *    color:color(),
         *    dynamic(x){return {...pos(x)}} //x是ObjectMethod的参数，此时不做处理即可
         * }
         */
        CallExpression(path) {
          let isInObjectMethodLike = false;
          let argNameIfInObjectMethodLike: string | undefined;

          const callee = path.node.callee;
          let fnName = "";
          switch (callee.type) {
            case "ArrayExpression":
              console.warn("path", path);
              throw new Error("TODO: not support ArrayExpression");
            case "Identifier":
              fnName = callee.name;
              break;
            default:
              //TODO:添加更多类型支持
              console.warn("path", path, "callee.type", callee.type);
              throw new Error("TODO: not supported callee.type" + callee.type);
          }
          const fnArgs = path.node.arguments.map(arg => {
            try {
              if (!t.isExpression(arg)) {
                log.error(
                  "TODO: NOT SUPPORT:CallExpression,argument",
                  generate(arg).code
                );
                throw new Error("TODO: NOT SUPPORT");
              }
              //如果是ObjectMethod或者函数的参数则不做处理
              let params: t.Node[] = [];
              const objectMethod = path.findParent(p => p.isObjectMethod());
              if (objectMethod) {
                params = (objectMethod.node as t.ObjectMethod).params;
              } else {
                const fnPath = path.findParent(
                  p =>
                    p.isObjectProperty() &&
                    (t.isArrowFunctionExpression(p.node.value) ||
                      t.isFunctionExpression(p.node.value))
                );
                if (fnPath) {
                  params = (
                    (fnPath.node as t.ObjectProperty)
                      .value as t.FunctionExpression
                  ).params;
                }
              }
              //TODO:这里不太严谨. 这里其实有且仅有一个参数
              const names = params.map(
                // @ts-ignore
                e => e.name
              );
              //TODO:这里不太严谨
              if (names.includes((arg as t.Identifier).name)) {
                isInObjectMethodLike = true;
                argNameIfInObjectMethodLike = (arg as t.Identifier).name;
                return `__PLACEHOLDER__`; //其实上一定是"var(--variants-xxx-dynamic)"
              } else {
                const context = getFileModuleImport(imports);
                return evalExp(arg, context);
              }
            } catch (err) {
              log.error("CallExpression,argument", generate(arg).code);
              throw err;
            }
          });

          //2.计算函数的值
          let result;
          if (fnName in imports) {
            result = load(imports, fnName)(...fnArgs);
          } else {
            if (!fileAst) {
              throw new Error("fileAst is undefined");
            }
            const fn = getVariableValueInFile(fileAst, fnName) as any;
            if (!fn) {
              throw new Error(`fnName=${fnName} not found in fileAst`);
            } else {
              result = fnUtils.makeFnRunable(fn)(...fnArgs);
            }
          }
          if (result === undefined || result === null) {
            path.replaceWith(t.nullLiteral());
            return;
          }
          if (Array.isArray(result)) {
            path.replaceWith(
              buildObjectExpression(result, str => {
                if (typeof str !== "string") {
                  log.error("not support type str=", str);
                  throw new Error("not support type");
                }
                if (str === "__PLACEHOLDER__" && isInObjectMethodLike) {
                  return t.identifier(argNameIfInObjectMethodLike!);
                }
                return t.stringLiteral(str);
              })
            );
            return;
          }

          switch (typeof result) {
            case "string": {
              //TODO:如果result中包括有__PLACEHOLDER__，则需要替换回来.(拆分成多个stringLiteral)
              path.replaceWith(t.stringLiteral(result));
              break;
            }
            case "number":
              path.replaceWith(t.numericLiteral(result));
              break;
            case "object":
              path.replaceWith(
                buildObjectExpression(result, str => {
                  if (typeof str !== "string") {
                    log.error("not support type str=", str);
                    throw new Error("not support type");
                  }
                  if (str === "__PLACEHOLDER__" && isInObjectMethodLike) {
                    return t.identifier(argNameIfInObjectMethodLike!);
                  }
                  return t.stringLiteral(str);
                })
              );
              break;
            default:
              log.error("eval failed:res=", typeof result, "fnName=", fnName);
              throw new Error("eval failed");
          }
        },
        noScope: true, //TODO: fixme later
      }
      // new Scope(programPath)
    );
    return this;
  }

  eval(context: object) {
    return evalExp(this.objectExp, context);
  }
}

/**
 * x is the args of  dynamic function
 * o={
 *  dynamic(x){return {...pos(x)}}
 * }
 */
export const isArgOfDynamicFunc = (path: NodePath, arg: string) => {
  const objectMethod = path.findParent(
    p =>
      p.isObjectMethod() &&
      // p.node.key.name === "dynamic" &&
      //@ts-ignore
      p.node.params[0].name === arg
  );
  if (objectMethod) {
    return true;
  }
  const fnPath = path.findParent(
    p =>
      p.isObjectProperty() &&
      (t.isArrowFunctionExpression(p.node.value) ||
        t.isFunctionExpression(p.node.value)) &&
      // p.node.key.name === "dynamic" &&
      //@ts-ignore
      p.node.value.params[0].name === arg
  );
  return fnPath ? true : false;
};
