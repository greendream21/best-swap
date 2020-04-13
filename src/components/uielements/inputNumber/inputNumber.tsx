import React from 'react';
import { InputNumberProps } from 'antd/lib/input-number';
import { InputNumberWrapper } from './inputNumber.style';
import { InputNumberWrapperColor, InputNumberWrapperSize } from './types';

type CustomProps = {
  size?: InputNumberWrapperSize;
  color?: InputNumberWrapperColor;
};

type Props = CustomProps & InputNumberProps

const InputNumber: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    size = 'small',
    color = 'primary',
    ...otherProps
  } = props;
  return (
    <InputNumberWrapper
      size={size}
      color={color}
      {...otherProps}
    />
  );
};

export default InputNumber;
