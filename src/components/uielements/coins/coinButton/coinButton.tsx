import React from 'react';

import { ButtonProps } from 'antd/lib/button';
import { CoinButtonWrapper } from './coinButton.style';
import CoinIcon from '../coinIcon';
import Label from '../../label';

import { getFixedNumber } from '../../../../helpers/stringHelper';

type CustomProps = {
  cointype: string;
  price?: number;
  priceUnit?: string;
  reversed?: boolean;
};

type Props = CustomProps & ButtonProps;

const CoinButton: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    cointype,
    price = 0,
    priceUnit = 'RUNE',
    reversed = false,
    className = '',
    ...otherProps
  } = props;
  const priceValue = getFixedNumber(price);
  const priceLabel = `${priceUnit.toUpperCase()} ${priceValue}`;

  return (
    <CoinButtonWrapper
      className={`coinButton-wrapper ${className}`}
      reversed={reversed}
      {...otherProps}
    >
      <div className="coinButton-content">
        <CoinIcon type={cointype} />
        <div className="coin-value">
          <Label size="big" weight="bold">
            {cointype}
          </Label>
          <Label color="input">{priceLabel}</Label>
        </div>
      </div>
    </CoinButtonWrapper>
  );
};

export default CoinButton;
