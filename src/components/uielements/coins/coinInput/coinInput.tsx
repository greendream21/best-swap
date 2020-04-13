import React from 'react';

import BigNumber from 'bignumber.js';
import { util } from 'asgardex-common';
import { CoinInputWrapper } from './coinInput.style';
import { CoinType } from '../../../../settings';
import CoinButton from '../coinButton';
import InputNumber from '../../inputNumber';
import Label from '../../label';
import { TokenAmount } from '../../../../types/token';

type Props = {
  title: string;
  asset: CoinType;
  amount: TokenAmount;
  price: BigNumber;
  slip?: BigNumber;
  step?: number;
  reverse?: boolean;
  className?: string;
  onChange?: (_: number | undefined) => void;
};

const CoinInput: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    title,
    asset,
    amount,
    price,
    slip,
    step = 1,
    className = '',
    reverse = false,
    onChange = (_: number | undefined) => {},
    ...otherProps
  } = props;

  const totalPrice = util.formatBN(amount.amount().multipliedBy(price));
  const priceLabel = `$${totalPrice} (USD)`;

  const amountNumber = amount.amount().toNumber();

  return (
    <CoinInputWrapper
      className={`coinInput-wrapper ${className}`}
      reverse={reverse}
      {...otherProps}
    >
      <Label className="title-label" color="light" weight="bold">
        {title}
      </Label>
      <div className="coin-button-wrapper">
        <CoinButton
          className="coin-button"
          cointype={asset}
          reversed={reverse}
        />
      </div>
      <Label className="amount-label" color="light" weight="bold">
        Set amount:
      </Label>
      <div className="amount-wrapper">
        <InputNumber
          className="asset-amount-input"
          value={amountNumber}
          onChange={onChange}
          min={0}
          step={step}
          placeholder="100000"
        />
        <Label className="asset-name-label" color="gray" weight="bold">
          {asset}
        </Label>
      </div>
      <Label className="asset-price-label" color="gray">
        {priceLabel}
      </Label>
      {slip !== undefined && (
        <Label className="asset-price-label" color="gray">
          SLIP: {util.formatBN(slip, 8)} %
        </Label>
      )}
    </CoinInputWrapper>
  );
};

export default CoinInput;
