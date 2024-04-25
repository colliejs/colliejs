import type { CSSObject, VariantsType } from "@colliejs/core";
import { type BaseConfig } from "@colliejs/core";
import _ from "lodash";
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { Styled } from "./types";
import {
  getCSSValue,
  getCSSVariable,
  getCompoundVariantClassNameUsed,
  getVariantClassNameFromCandidates,
  isPlainObject,
  isString,
  toArray,
} from "./utils";

export type BaseStyledComponentProps<Config extends BaseConfig> = {
  className?: string; //static variants
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties & { [x: string]: any }; //dynamic variants
  ref?: any;
  css?: CSSObject<Config>;
};

export const makeStyled = <Config extends BaseConfig>(config: Config) => {
  /**
   * runtime版本的styled（编译器生成的版本）
   *
   * @param component
   * @param __generatedBaseStyleClassName
   * @param __generatedStaticClassNames:编译时生成的参数
   * @param __generatedDynamicClassNameMap:编译时生成的参数
   * @param __generatedCompoundVariantClassNames:编译时生成的参数
   * @param __generatedDefaultVariantClassNames:编译时生成的参数
   * @param option
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
  return function styled<P1 extends BaseStyledComponentProps<Config>, T = any>(
    component: ElementType<P1>,
    __generatedBaseStyleClassName = "",
    __generatedStaticClassNames: VariantsType["staticClassName"][] = [],
    __generatedDynamicClassNameMap: Record<
      VariantsType["dynamicClassName"],
      { canAddPx: boolean }
    > = {},
    __generatedCompoundVariantClassNames: VariantsType["compoundClassName"][] = [],
    __generatedDefaultVariantClassNames: string[] = [],
    // option: React.ComponentProps<ElementType<P1>> = {}
    defaultPropsOfBaseComponent: React.ComponentProps<any> = {}
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
        if (isStaticVariantProp && isPlainObject(valOfProp)) {
          throw new Error(
            `invalid value ${valOfProp} for static variant ${prop} `
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
              console.error("prop", prop, "valOfProp", valOfProp);
              throw new Error(
                "can not use array as dynamic variant value when breakpoints is empty"
              );
            }
            style[getCSSVariable(prop)] = getCSSValue(valOfProp, canAddPx);
          }
        }
      }
      //===========================================================
      // get ClassName of defaultVariants
      //===========================================================
      outputClassNames.push(...__generatedDefaultVariantClassNames);

      //===========================================================
      // get ClassName of  compoundVariants.
      //===========================================================
      const compoundClassNames = getCompoundVariantClassNameUsed(
        __generatedCompoundVariantClassNames,
        propsWithStaticVariant
      );
      outputClassNames.push(...compoundClassNames);

      //===========================================================
      // finally got forwardProps
      //===========================================================
      const forwardProps = {
        className: outputClassNames.join(" "),
        ref,
        style: Object.keys(style).length === 0 ? undefined : style,
        ...defaultPropsOfBaseComponent,
        ...restPropsWithoutVariant,
      };

      //===========================================================
      //  创建一个带classname的组件
      //===========================================================
      const nAs = as || defaultPropsOfBaseComponent.as;
      //@ts-ignore
      const isStyledComponent = !!component.__isStyledComponent;
      const isHostComponent = isString(component) && !component.includes("-");
      const isWebComponent = isString(component) && component.includes("-");
      const is3rdComponent = !isHostComponent && !isStyledComponent;
      const isAsWebComponent = isString(nAs) && nAs.includes("-");

      if (isStyledComponent || is3rdComponent) {
        return React.createElement(component, {
          ...forwardProps,
          as: as || defaultPropsOfBaseComponent.as,
        });
      }
      if (isWebComponent || (isHostComponent && isAsWebComponent)) {
        return React.createElement(nAs || component, {
          ..._.omit(forwardProps, ["className", "as"]),
          class: forwardProps.className,
        });
      }
      if (isHostComponent) {
        if (isAsWebComponent) {
          throw new Error(`impossible react type: ${component} as ${nAs}`);
        }
        return React.createElement(
          nAs || component,
          _.omit(forwardProps, "as")
        );
      }

      throw new Error("impossible react type");
    };
    const StyledComponent = React.forwardRef(render);
    StyledComponent.displayName =
      typeof component === "string"
        ? component
        : component.displayName || "StyledComponent";

    //@ts-ignore
    StyledComponent.__isStyledComponent = true;
    return React.memo(StyledComponent);
  } as unknown as Styled<Config>;
};
