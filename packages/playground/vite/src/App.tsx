import { useEffect, useRef, useState } from 'react';
import MyButton from './MyButton';
import { SpecialButton, SpecialButton2 } from './SpeciButton';

export default function App() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    ref.current?.focus?.();
  }, []);
  
  return (
    <div>
      {/* <Button
        shape="round"
        onClick={() => {
          setCount(x => x + 1);
        }}
      >
        click
      </Button>
      count:{count} */}
      <MyButton shape={'round'}>dynmic variant MyButton</MyButton>
      <br/>
      <SpecialButton shape={'round'} css={{background:'lightblue'}}>SpecialButton1</SpecialButton>
      <SpecialButton2 shape={'round'} css={{background:'lightyellow'}}>SpecialButton1</SpecialButton2>

      {/* <MyButton
        shape="rect"
        css={{
          background: 'yellow',
          color: 'blue',
        }}
      >
        MyButton
      </MyButton>
      <Input ref={ref} />
      <Button as="a">button as link</Button>
      <SpecialButton>SpecialButton12</SpecialButton> */}
    </div>
  );
}
