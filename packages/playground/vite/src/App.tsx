import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import MyButton from './MyButton';
import Input from './Input';
import { SpecialButton } from './SpeciButton';

export default function App() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    ref.current?.focus?.();
  }, []);
  return (
    <div>
      <Button
        shape="round"
        onClick={() => {
          setCount(x => x + 1);
        }}
      >
        click
      </Button>
      count:{count}
      <MyButton shape={'round'}>dynmic variant MyButton</MyButton>
      <MyButton
        shape="rect"
        css={{
          background: 'yellow',
          color: 'blue',
        }}
      >
        MyButton
      </MyButton>
      <Input ref={ref} />
      <SpecialButton>SpecialButton1</SpecialButton>
      <Button as="a">button as link</Button>
      <SpecialButton>SpecialButton12</SpecialButton>
    </div>
  );
}
