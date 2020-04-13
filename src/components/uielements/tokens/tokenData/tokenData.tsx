import React from 'react';

import { TokenDataWrapper } from './tokenData.style';

import Coin from '../../coins/coin';
import { CoinSize } from '../../coins/coin/types';

type Props = {
  asset: string;
  priceValue: string;
  priceUnit: string;
  size?: CoinSize;
  className?: string;
};

const TokenData: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset,
    priceValue,
    priceUnit,
    size = 'big',
    className = '',
    ...otherProps
  } = props;

  return (
    <TokenDataWrapper
      className={`tokenData-wrapper ${className}`}
      {...otherProps}
    >
      <Coin className="coinData-coin-avatar" type={asset} size={size} />
      <div className="coinData-asset-label">{asset}</div>
      <div className="asset-price-info">{priceUnit} {priceValue}</div>
    </TokenDataWrapper>
  );
};

export default TokenData;
