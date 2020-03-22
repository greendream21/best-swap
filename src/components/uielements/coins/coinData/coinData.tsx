import React from 'react';

import BigNumber from 'bignumber.js';
import { CoinDataWrapper, CoinDataWrapperType, CoinDataWrapperSize } from './coinData.style';
import Coin from '../coin';
import Label from '../../label';
import { Maybe, Nothing } from '../../../../types/bepswap';
import { BN_ZERO, formatBN } from '../../../../helpers/bnHelper';
import { TokenAmount } from '../../../../types/token';
import { formatTokenAmount } from '../../../../helpers/tokenHelper';

type Props = {
  'data-test'?: string;
  asset?: string;
  assetValue?: Maybe<TokenAmount>;
  target?: Maybe<string>;
  targetValue?: Maybe<TokenAmount>;
  price?: BigNumber;
  priceUnit?: string;
  size?: CoinDataWrapperSize;
  className?: string;
  type?: CoinDataWrapperType | undefined;
};

const CoinData: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset = 'bnb',
    assetValue = Nothing,
    target = Nothing,
    targetValue = Nothing,
    price = BN_ZERO,
    priceUnit = 'RUNE',
    size = 'small',
    className = '',
    type = 'normal',
    ...otherProps
  } = props;

  const priceLabel = `${priceUnit.toUpperCase()} ${formatBN(price)}`;

  return (
    <CoinDataWrapper
      size={size}
      target={target}
      type={type}
      className={`coinData-wrapper ${className}`}
      {...otherProps}
    >
      <Coin
        className="coinData-coin-avatar"
        type={asset}
        over={target}
        size={size}
      />
      <div className="coinData-asset-info" data-test="coin-data-asset-info">
        <Label
          className="coinData-asset-label"
          data-test="coin-data-asset-label"
          type="normal"
          weight="600"
        >
          {`${asset} ${target ? ':' : ''}${type !== 'normal' ? '/ ' : ''}`}
        </Label>
        {assetValue && (
          <Label
            className="coinData-asset-value"
            data-test="coin-data-asset-value"
            type="normal"
            weight="600"
          >
            {formatTokenAmount(assetValue)}
          </Label>
        )}
      </div>
      {target && (
        <div className="coinData-target-info">
          <Label className="coinData-target-label" type="normal" weight="600">
            {target}
          </Label>
          {targetValue && (
            <Label className="coinData-target-value" type="normal" weight="600">
              {formatTokenAmount(targetValue)}
            </Label>
          )}
        </div>
      )}
      <div className="asset-price-info">
        <Label size="small" color="gray" weight="bold">
          {priceLabel}
        </Label>
      </div>
    </CoinDataWrapper>
  );
};

export default CoinData;
