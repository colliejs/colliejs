import {
  toCamelCase,
  unitProps,
  getStaticVariantKey,
  getDynamicVariantKey,
  StaticVariantKey,
} from "@colliejs/core";
import _ from "lodash";
import React, { ElementType, ForwardRefRenderFunction } from "react";

export type StyledOption<
  P extends BaseStyledComponentProps,
  AS extends keyof JSX.IntrinsicElements
> = {
  as?: AS;
  wrapper?: keyof JSX.IntrinsicElements;
  attrs?: Partial<P> & JSX.IntrinsicElements[AS];
};

const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

const isString = (x: unknown): x is string => typeof x === "string";

export type BaseStyledComponentProps = {
  //css and static variants
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  //dynamic variants
  style?: React.CSSProperties & { [x: string]: any };
  ref?: any;
};

/**
 * runtime版本的styled（编译器生成的版本）
 *
 * @param component
 * @param __generatedClassNameOfAllVariants:编译时生成的参数
 * @param __generatedClassNameOfBaseStyle：编译时生成的参数
 * @returns
 * @example
 * const Button = styled('button', {})
 * @todo: 使用forwardRef
 */
export const styled = <
  P1 extends BaseStyledComponentProps & P2,
  P2,
  As extends keyof JSX.IntrinsicElements,
  T = any
>(
  component: ElementType<P2>,
  __generatedClassNameOfAllVariants: Record<StaticVariantKey, string>,
  __generatedClassNameOfBaseStyle = "",
  option: StyledOption<P1, As> = {}
) => {
  const render: ForwardRefRenderFunction<T, P1> = (props, ref) => {
    const { className, style = {}, as, ...restProps } = props;
    //查找variant对应的className
    let classNames: string[] = [
      __generatedClassNameOfBaseStyle,
      className || "",
    ];
    const restPropsWithoutVariant = { ...restProps };
    for (const [prop, valOfProp] of Object.entries(restProps)) {
      const isVariant = Object.keys(__generatedClassNameOfAllVariants).some(
        e =>
          e.startsWith(`variants-static-${prop}-`) ||
          e.startsWith(`variants-dynamic-${prop}`)
      );
      if (!isVariant) {
        continue;
      }
      //@ts-ignore
      restPropsWithoutVariant[prop] = undefined;
      //编译时variants
      if (!isObject(valOfProp)) {
        //字符串或者boolean
        const staticVariantKey = getStaticVariantKey(prop, valOfProp);
        const dynamicVariantKey = getDynamicVariantKey(prop);

        if (staticVariantKey in __generatedClassNameOfAllVariants) {
          //静态variant
          classNames.push(__generatedClassNameOfAllVariants[staticVariantKey]);
        } else if (dynamicVariantKey in __generatedClassNameOfAllVariants) {
          //dynamic variant
          //@ts-ignore
          classNames.push(__generatedClassNameOfAllVariants[dynamicVariantKey]);

          //TODO: 处理各种情况，不是简单的px
          const cssValue =
            typeof valOfProp === "number" && prop in unitProps
              ? `${valOfProp}px`
              : valOfProp;
          style[`--${dynamicVariantKey}`] = cssValue;
        }
      } else {
        throw new Error(
          "variant value must be string or number.because  it is used as css variable value. "
        );
      }
    }

    const forwardProps = {
      className: classNames.join(" "),
      ref,
      style: Object.keys(style).length === 0 ? undefined : style,
      ...(option.attrs || {}),
      ...restPropsWithoutVariant,
    };

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
};
