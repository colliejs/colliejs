import { abs } from '@unstyled-ui/css';
import { styled } from '@colliejs/react';
import { Button } from './Button';
const width = 200;
const height = 40;

const MyButton = styled(Button, {
  // background: 'orange',
  w: width,
  height: height,
  border: '3px solid orange',

  variants: {
    shape: {
      square: {
        borderRadius: 0,
      },
      round: {
        borderRadius: 92299,
      },
      dynamic(x) {
        return {
          borderRadius: x,
        };
      },
    },
  },
} );

export default MyButton;
