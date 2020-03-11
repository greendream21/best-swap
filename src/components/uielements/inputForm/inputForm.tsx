import React from 'react';

import { InputFormWrapper } from './inputForm.style';
import InputNumber from '../inputNumber';
import Label from '../label';

type Props = {
  title: string;
  type: string;
  value: number;
  reverse?: boolean;
  step?: number;
  onChange: (value?: number) => void;
  className?: string;
};

const InputForm: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    title,
    type,
    value = 0,
    step = 1,
    className = '',
    reverse = false,
    onChange = () => {},
    ...otherProps
  } = props;

  return (
    <InputFormWrapper
      className={`inputForm-wrapper ${className}`}
      reverse={reverse}
      {...otherProps}
    >
      <Label className="title-label" color="light" weight="bold">
        {title}
      </Label>
      <div className="value-wrapper">
        <InputNumber
          className="value-input"
          value={value}
          onChange={onChange}
          min={0}
          step={step}
          placeholder="100000"
        />
        <Label className="name-label" color="gray" weight="bold">
          {type}
        </Label>
      </div>
    </InputFormWrapper>
  );
};

export default InputForm;
