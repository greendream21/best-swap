import React from 'react';

import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import { InputFormWrapper } from './inputForm.style';
import InputNumber from '../inputNumber';
import Label from '../label';

type Props = {
  title: string;
  type: string;
  amount: TokenAmount;
  reverse?: boolean;
  step?: number;
  onChange?: (value: number | undefined) => void;
  className?: string;
};

const InputForm: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    title,
    type,
    amount = tokenAmount(0),
    step = 1,
    className = '',
    reverse = false,
    onChange = () => {},
    ...otherProps
  } = props;

  const valueNumber = amount.amount().toNumber();

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
          value={valueNumber}
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
