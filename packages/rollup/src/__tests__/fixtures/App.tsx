import { CSSPropertiesComplex } from '@colliejs/core';
import React from 'react';
import Button from './Button';

export default function App() {
  return (
    <Button shape="round" css={{ background: 'red' } }>
      My button
    </Button>
  );
}