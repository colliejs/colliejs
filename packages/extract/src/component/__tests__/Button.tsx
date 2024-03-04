import React from 'react';

const Button: React.FC = props => {
  const { ...restProps } = props;
  return <div {...restProps}>hello</div>;
};

export default Button;
