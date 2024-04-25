- [] render(<App/>) 不支持 rende 函数，不识别
- `

const Button = styled(button,{ color: red; }) <Button css={{color:'red'}}/>

` 为了能覆盖 css 属性中的样式，需要吧 css 属性生成的 class 也放入到 Button 所在 layers 中.但是如果不在同一个文件中，会比较麻烦。如果是第三方库，就更麻烦了（不处理）。所以最近策略是只在最外层写 css 属性

//BUG1: TODO: //这种情况会编译失败 const accountStyle = { opacity: 0.3, w: vw(180, "auto"), }; const Address = styled(Text, accountStyle);

//BUG2: 现在不支持 styled的第一个参数是一个函数。而非Identifer/string的情况
TODO: const TxId = styled(props => { return <Text {...props} />; })

//BUG3: 默认有status=error?为啥
import { Stack } from "@collie-ui/layout";
import { styled } from "@src/styled";
import React from "react";
import classNames from "classnames";
import { vw } from "@src/common/vw";
import { log } from "@src/common/log";

const StyledInput = styled("input", {
  h: 40,
  w: vw(320, "100%"),
  fontWeight: 500,
  lineHeight: 1,
  outline: "none",
  appearance: "none",
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: vw(8),
  pl: vw(20),
  caretColor: "#0CFFA7",
  alignItems: "center",
  color: "White",
  fontSize: vw(16),
  "&[disabled]": {
    border: "1px solid rgba(255, 255, 255, 0.05)",
    _placeholder: {
      fontweight: 400,
      color: "rgba(255, 255, 255, 0.3)",
    },
  },

  // color: "rgba(255, 255, 255, 0.3)",
  _placeholder: {
    fontweight: 400,
    color: "rgba(255, 255, 255, 0.3)",
  },
  variants: {
    status: {
      yes: {
        border: "1px solid #D13333",
      },
      no: {
        border: "none",
      },
    },
  },
});

export type InputProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const _Input = (props: InputProps) => {
  const { prefix, suffix, className, ...restProps } = props;
  log("==>status", restProps);

  return (
    <Stack
      className={classNames(className, "input-container")}
      css={{ w: "100%" }}
      body={<StyledInput {...restProps} />}
    >
      {prefix}
      {suffix}
    </Stack>
  );
};

export const Input = styled(_Input, {});
export default Input;

//NOTE:提取子类型的 variant的类型提示有问题


FEAT1:
- 支持variants的组合。比如variants:{
- title:['gray','big']
- }

BUG: TITLE 未生效。正常应该是覆盖掉BaseCompoennt的对应的默认配置

export const GasText = styled('p', {
  color: 'white',
  variants: {
    size: {
      sm: {
        fontSize: vw(14),
        fontWeight: 400,
        lineHeight: 1,
      },
      md: {
        fontSize: vw(16),
        fontWeight: 500,
        lineHeight: 1,
      },
    },
    color: {
      gray: {
        opacity: 0.3,
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    // color: 'white',
  },
});

export const Title = styled(GasText, {
  defaultVariants: {
    size: 'sm',
    color: 'gray',
  },
});
