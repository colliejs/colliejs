import { styled } from '@colliejs/react';
import { BaseButton } from './AntdButton';

const Button = styled(BaseButton, {
  color: 'red',
  variants: {
    shape: {
      square: {
        borderRadius: 0,
      },
      round: {
        borderRadius: 9999,
      },
    },
  },
});

export default Button;
