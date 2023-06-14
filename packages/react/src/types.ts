import React, { ElementType } from "react";
import { type Styling } from "@border-collie-js/transform";

export type StyledOption<
  BaseProp,
  InnerAs extends keyof JSX.IntrinsicElements
> = {
  as?: InnerAs;
  wrapper?: keyof JSX.IntrinsicElements;
  attrs?: Partial<BaseProp> & JSX.IntrinsicElements[InnerAs];
};
export type BaseRetStyledComponentProps<
  RetAs extends keyof JSX.IntrinsicElements
> = {
  className?: string;
  css?: Styling;
  as?: RetAs;
  style?: React.CSSProperties & {
    [x: string]: any;
  };
  ref?: any;
};

export type RetStyledComponentProps<
  BP,
  RetAs extends keyof JSX.IntrinsicElements
> = BaseRetStyledComponentProps<RetAs> &
  BP &
  (RetAs extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[RetAs]
    : never);
/**
 * runtime版本的styled（编译器生成的版本）
 *
 * @param component
 * @param __generatedClassNameOfVariant:编译时生成的参数
 * @param __generatedClassNameOfBaseStyle：编译时生成的参数
 * @returns
 * @example
 * const Button = styled('button', {})
 * @todo: 使用forwardRef
 */
type VariantsProp<_Styling extends Styling> = {
  [k in keyof _Styling["variants"]]?: keyof _Styling["variants"][k];
};

export declare const styled: <
  BaseProp,
  RetAs extends keyof JSX.IntrinsicElements = any,
  // __Styling extends Styling,
  P extends RetStyledComponentProps<BaseProp, RetAs> = RetStyledComponentProps<
    BaseProp,
    RetAs
  >,
  // VariantsProp<__Styling>,
  T = any
>(
  component: React.ElementType<BaseProp>,
  style: Styling,
  option?: StyledOption<BaseProp, any>
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;
