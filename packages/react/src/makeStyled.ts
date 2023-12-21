import type { BaseConfig } from "@colliejs/core";
import _ from "lodash";
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { MakeStyled } from "./types";
import {
  getCSSValue,
  getCSSVariable,
  getCompoundVariantClassNameUsed,
  getVariantClassNameFromCandidates,
  isObject,
  isString,
  toArray,
} from "./utils";
import type { VariantsType } from "@colliejs/transform";

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

export const makeStyled = <Config extends BaseConfig>(config: Config) => {
  /**
   * runtime版本的styled（编译器生成的版本）
   *
   * @param component
   * @param __generatedClassNameOfBaseStyle：编译时生成的参数
   * @param __generatedStaticClassNames:编译时生成的参数
   * @param __generatedCompoundVariantClassNames:编译时生成的参数
   * @returns
   * @example
   *   const Button = styled('button',
   *    "baseStyle-Button-elTJue",
   *       ["variants-shape-round-hECRKn",""variants-shape-rect-iydAuT""]
   *     {
   *       "variants-shape-dynamic": {canAddPx:true}
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
    __generatedBaseStyleClassName = "",
    __generatedStaticClassNames: VariantsType["staticClassName"][] = [],
    __generatedDynamicClassNameMap: Record<
      VariantsType["dynamicClassName"],
      { canAddPx: boolean }
    > = {},
    __generatedCompoundVariantClassNames: VariantsType["compoundClassName"][] = [],
    __generatedDefaultVariantClassNames: string[] = [],
    option: StyledOption<P1, As> = {}
  ) {
    const render: ForwardRefRenderFunction<T, P1> = (props, ref) => {
      const { className, style = {}, as, ...restProps } = props;

      //查找variant对应的className
      let outputClassNames: string[] = [
        __generatedBaseStyleClassName,
        className || "",
      ];
      //===========================================================
      // change variant props/value to className
      //===========================================================
      const restPropsWithoutVariant = { ...restProps };
      const propsWithStaticVariant = {} as Record<string, any>;
      const dynamicVariantsClassNamees = Object.keys(
        __generatedDynamicClassNameMap
      );
      //===========================================================
      // static and dynamic variants
      //===========================================================
      for (const [prop, valOfProp] of Object.entries(restProps)) {
        const staticVariantClassName = getVariantClassNameFromCandidates(
          prop,
          valOfProp,
          __generatedStaticClassNames
        );
        const isStaticVariantProp = !!staticVariantClassName;
        const isDynamicVariantProp =
          !isStaticVariantProp &&
          dynamicVariantsClassNamees.some(e =>
            e.startsWith(`variants-${prop}-dynamic`)
          );
        if (!isStaticVariantProp && !isDynamicVariantProp) {
          continue;
        }
        isStaticVariantProp && (propsWithStaticVariant[prop] = valOfProp);
        // @ts-ignore
        restPropsWithoutVariant[prop] = undefined;
        if (isStaticVariantProp && isObject(valOfProp)) {
          throw new Error(
            "variant value must be string or number.because  it is used as css variable value. "
          );
        }

        if (isStaticVariantProp) {
          //静态variant
          outputClassNames.push(staticVariantClassName);
        } else {
          //动态variant
          const className = getVariantClassNameFromCandidates(
            prop,
            "dynamic",
            Object.keys(__generatedDynamicClassNameMap)
          ) as VariantsType["dynamicClassName"];
          outputClassNames.push(className);

          const canAddPx = __generatedDynamicClassNameMap[className].canAddPx;
          if ((config.breakpoints?.length || 0) > 0) {
            const newValueOfProp = toArray(valOfProp);
            config.breakpoints?.forEach((e, idx) => {
              style[getCSSVariable(prop, e)] = getCSSValue(
                newValueOfProp[idx] ??
                  newValueOfProp[newValueOfProp.length - 1],
                canAddPx
              );
            });
          } else {
            if (Array.isArray(valOfProp)) {
              throw new Error(
                "can not use array as dynamic variant value when breakpoints is empty"
              );
            }
            style[getCSSVariable(prop)] = getCSSValue(valOfProp, canAddPx);
          }
        }
      }
      //===========================================================
      // defaultVariants
      //===========================================================
      outputClassNames.push(...__generatedDefaultVariantClassNames);

      //===========================================================
      // compoundVariants.
      //===========================================================
      const compoundClassNames = getCompoundVariantClassNameUsed(
        __generatedCompoundVariantClassNames,
        propsWithStaticVariant
      );
      outputClassNames.push(...compoundClassNames);

      //===========================================================
      // create forwardProps
      //===========================================================
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
  } as unknown as MakeStyled<Config>;
};
