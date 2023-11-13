import {
  ClassNameLiteral,
  DynamicVariantKey,
  StaticVariantKey,
  getDynamicVariable,
  getDynamicVariantKey,
  getStaticVariantKey,
} from "@colliejs/core";
import _ from "lodash";
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { MakeStyled, _Config } from "./types";
import { getCSSValue, isObject, isString, toArray } from "./utils";

export type StyledOption<
  P extends BaseStyledComponentProps,
  AS extends keyof JSX.IntrinsicElements
> = {
  as?: AS;
  wrapper?: keyof JSX.IntrinsicElements;
  attrs?: Partial<P> & JSX.IntrinsicElements[AS];
};

export type BaseStyledComponentProps = {
  //css and static variants
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  //dynamic variants
  style?: React.CSSProperties & { [x: string]: any };
  ref?: any;
};

export const makeStyled = <_MyConfig extends _Config>(config: _MyConfig) => {
  /**
   * runtime版本的styled（编译器生成的版本）
   *
   * @param component
   * @param __generatedClassNameOfBaseStyle：编译时生成的参数
   * @param __generatedClassNameByVariantsMap:编译时生成的参数
   * @param __generatedClassNameByCompoundVariantsMap:编译时生成的参数
   * @returns
   * @example
   *   const Button = styled('button',
   *    "baseStyle-Button-elTJue",
   *    {
   *       "variants-static-shape-round": "variants-static-shape-round-hECRKn",
   *       "variants-static-shape-rect": "variants-static-shape-rect-iydAuT"
   *       "variants-dynamic-shape-at": "variants-dynamic-shape-dlbLfd"
   *     },
   *     {
   *
   *     }
   *     );
   *
   *
   *
   * @todo: 使用forwardRef
   */
  return function styled<
    P1 extends BaseStyledComponentProps & P2,
    P2,
    As extends keyof JSX.IntrinsicElements,
    T = any
  >(
    component: ElementType<P2>,
    __generatedClassNameOfBaseStyle = "",
    __generatedClassNameByVariantsMap: Record<
      StaticVariantKey | DynamicVariantKey,
      ClassNameLiteral
    > = {},
    __generatedClassNameByCompoundVariantsMap: Record<
      `compoundVariants-${string}`,
      ClassNameLiteral
    > = {},

    option: StyledOption<P1, As> = {}
  ) {
    const render: ForwardRefRenderFunction<T, P1> = (props, ref) => {
      const { className, style = {}, as, ...restProps } = props;

      //查找variant对应的className
      let outputClassNames: ClassNameLiteral[] = [
        __generatedClassNameOfBaseStyle,
        className || "",
      ];
      //===========================================================
      // change variant props/value to className
      //===========================================================
      const restPropsWithoutVariant = { ...restProps };
      const propsWithStaticVariant = {} as Record<string, any>;
      const variantsKeys = Object.keys(__generatedClassNameByVariantsMap);
      for (const [prop, valOfProp] of Object.entries(restProps)) {
        const isStaticVariantExistedForProp = variantsKeys.some(e =>
          e.startsWith(`variants-static-${prop}-`)
        );
        const isDynamicVariantExistedForProp = variantsKeys.some(e =>
          e.startsWith(`variants-dynamic-${prop}`)
        );
        if (!isStaticVariantExistedForProp && !isDynamicVariantExistedForProp) {
          continue;
        }
        isStaticVariantExistedForProp &&
          (propsWithStaticVariant[prop] = valOfProp);
        restPropsWithoutVariant[prop] = undefined;
        //编译时variants

        //字符串或者boolean
        const staticVariantKey = getStaticVariantKey(prop, valOfProp);
        const isStaticVariantKey =
          staticVariantKey in __generatedClassNameByVariantsMap;
        if (isStaticVariantKey && isObject(valOfProp)) {
          throw new Error(
            "variant value must be string or number.because  it is used as css variable value. "
          );
        }

        if (isStaticVariantKey) {
          //静态variant
          outputClassNames.push(
            __generatedClassNameByVariantsMap[staticVariantKey]
          );
        } else {
          //dynamic variant
          const dynamicVariantKey = variantsKeys.find(e =>
            e.startsWith("variants-dynamic-")
          );
          outputClassNames.push(
            __generatedClassNameByVariantsMap[dynamicVariantKey]
          );

          /**
           * TODO:
           * 1: 处理各种情况，不是简单的px
           * 2.支持简称比如(w=>width)
           */
          // const cssPropKey
          const match = dynamicVariantKey.match(
            /variants-dynamic-(.*?)-(?<cssPropKey>.*)?/
          );

          const cssPropKey = match?.groups?.cssPropKey.replace(/-.*/, "");
          console.log("dynamicVariantKey=", dynamicVariantKey);
          console.log("cssPropKey=", cssPropKey);

          const isSupportBreakpoint = dynamicVariantKey.includes("-at");
          if (isSupportBreakpoint) {
            const newValOfProp = toArray(valOfProp);
            config.breakpoints.forEach((e, idx) => {
              style[getDynamicVariable(prop, e)] = getCSSValue(
                cssPropKey,
                newValOfProp[idx] ?? newValOfProp[newValOfProp.length - 1]
              );
            });
          } else {
            style[getDynamicVariable(prop)] = getCSSValue(
              cssPropKey,
              valOfProp
            );
          }
        }
      }
      //===========================================================
      // compoundVariants. FIXME: should 2x/3x/nx
      //===========================================================
      const compoundVariantKey = Object.entries(propsWithStaticVariant)
        .map(([prop, val]) => {
          return `${prop}-${val}`;
        })
        .reduce((acc, cur) => {
          {
            return `${acc}-${cur}`;
          }
        }, "compoundVariants-");
      if (compoundVariantKey in __generatedClassNameByCompoundVariantsMap) {
        outputClassNames.push(
          __generatedClassNameByCompoundVariantsMap[compoundVariantKey]
        );
      }

      const forwardProps = {
        className: outputClassNames.join(" "),
        ref,
        style: Object.keys(style).length === 0 ? undefined : style,
        ...(option.attrs || {}),
        ...restPropsWithoutVariant,
      };

      //===========================================================
      //  创建一个带classname的组件
      //===========================================================
      //@ts-ignore
      const isStyledComponent = !!component.__isStyledComponent;
      const isHostComponent = isString(component) && !component.includes("-");
      const isWebComponent = isString(component) && component.includes("-");
      const is3rdComponent = !isHostComponent && !isStyledComponent;

      if (option.wrapper) {
        //TODO: className传递到wrapper上，其他的props传递到component上
        const childProps = { ..._.omit(forwardProps, ["className", "style"]) };

        let child: React.ReactNode;
        if (isHostComponent || isWebComponent) {
          child = React.createElement(as || option.as || component, childProps);
        } else {
          // isStyledComponent || is3rdComponent
          //@ts-ignore
          childProps.as = as || option.as;
          //@ts-ignore
          child = React.createElement(component, childProps);
        }
        return React.createElement(
          option.wrapper,
          { className: forwardProps.className, style: forwardProps.style },
          child
        );
      }
      //没有添加wrapper的情况
      if (isHostComponent) {
        const _as = as || option.as;
        const asIsWebComponent = isString(_as) && _as.includes("-");
        if (asIsWebComponent) {
          //@ts-ignore
          forwardProps.class = forwardProps.className;
          //@ts-ignore
          delete forwardProps.className;
          return React.createElement(_as, forwardProps);
        }
        return React.createElement(as || option.as || component, forwardProps);
      }
      if (isStyledComponent) {
        //@ts-ignore
        forwardProps.as = as || option.as;
        //@ts-ignore
        return React.createElement(component, forwardProps);
      }
      if (isWebComponent) {
        //@ts-ignore
        forwardProps.class = forwardProps.className;
        //@ts-ignore
        delete forwardProps.className;
        return React.createElement(as || option.as || component, forwardProps);
      }
      if (is3rdComponent) {
        //@ts-ignore
        forwardProps.as = as || option.as;
        //@ts-ignore
        return React.createElement(component, forwardProps);
      }

      throw new Error("impossible");
    };
    const StyledComponent = React.forwardRef(render);
    StyledComponent.displayName =
      typeof component === "string"
        ? component
        : component.displayName || "StyledComponent";

    //@ts-ignore
    StyledComponent.__isStyledComponent = true;
    return StyledComponent;
  } as unknown as MakeStyled<_MyConfig>;
};
