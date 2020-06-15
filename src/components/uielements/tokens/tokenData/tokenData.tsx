import React from 'react';

import { TokenDataWrapper } from './tokenData.style';

import Coin from '../../coins/coin';
import { CoinSize } from '../../coins/coin/types';

type Props = {
  asset: string;
  priceValue: string;
  size?: CoinSize;
  className?: string;
};

const TokenData: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset,
    priceValue,
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
    </TokenDataWrapper>
  );
};

export default TokenData;
