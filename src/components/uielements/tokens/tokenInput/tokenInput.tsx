import React, { useRef, useCallback } from 'react';

import BigNumber from 'bignumber.js';
import { TokenInputWrapper } from './tokenInput.style';
import CoinInputAdvanced from '../../coins/coinInputAdvanced';
import { FixmeType, Maybe } from '../../../../types/bepswap';
import { TokenInputProps } from './types';

type Props = {
  title: string;
  status: Maybe<string>;
  amount: BigNumber;
  label: string;
  inputProps?: TokenInputProps;
  onChange: (value: BigNumber) => void;
  className?: string;
};

const TokenInput: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    title,
    amount,
    status,
    label,
    inputProps = {},
    className = '',
    onChange,
    ...otherProps
  } = props;

  const inputRef = useRef<FixmeType>();

  const onChangeHandler = useCallback(
    (value: BigNumber) => {
      onChange(value);
    },
    [onChange],
  );

  const handleClickWrapper = useCallback(() => {
    inputRef.current.firstChild.focus();
  }, []);

  return (
    <TokenInputWrapper
      className={`tokenInput-wrapper ${className}`}
      onClick={handleClickWrapper}
      {...otherProps}
    >
      <div className="token-input-header">
        <p className="token-input-title">{title}</p>
        {status && <p className="token-input-header-label">{status}</p>}
      </div>
      <div className="token-input-content" ref={inputRef}>
        <CoinInputAdvanced
          className="token-amount-input"
          value={amount}
          onChangeValue={onChangeHandler}
          {...inputProps}
        />
        <p className="token-amount-label">{label}</p>
      </div>
    </TokenInputWrapper>
  );
};

export default TokenInput;
