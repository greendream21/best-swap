import React from 'react';
import { getFixedNumber } from '../../../../helpers/stringHelper';

import { TokenDataWrapper } from './tokenData.style';

import Coin from '../../coins/coin';
import { CoinSize } from '../../coins/coin/types';

type Props = {
  asset: string;
  price: number;
  priceUnit: string;
  size?: CoinSize;
  className?: string;
};

const TokenData: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset,
    price,
    priceUnit,
    size = 'big',
    className = '',
    ...otherProps
  } = props;
  const priceValue = `${priceUnit} ${getFixedNumber(price)}`;
  return (
    <TokenDataWrapper
      className={`tokenData-wrapper ${className}`}
      {...otherProps}
    >
      <Coin className="coinData-coin-avatar" type={asset} size={size} />
      <div className="coinData-asset-label">{asset}</div>
      <div className="asset-price-info">{priceValue}</div>
    </TokenDataWrapper>
  );
};

export default TokenData;
