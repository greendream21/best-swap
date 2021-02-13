import React from 'react';

import Coin from '../../coins/coin';
import { CoinSize } from '../../coins/coin/types';
import { TokenDataWrapper } from './tokenData.style';

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

  const ticker = asset.split('-')[0];

  return (
    <TokenDataWrapper
      className={`tokenData-wrapper ${className}`}
      {...otherProps}
    >
      <Coin className="coinData-coin-avatar" type={ticker} size={size} />
      <div className="coinData-asset-label">{ticker}</div>
    </TokenDataWrapper>
  );
};

export default TokenData;
