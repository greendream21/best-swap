import React from 'react';

import BigNumber from 'bignumber.js';
import { bn, formatBN } from '@thorchain/asgardex-util';
import { TokenAmount, formatTokenAmount } from '@thorchain/asgardex-token';
import {
  CoinDataWrapper,
  CoinDataWrapperType,
  CoinDataWrapperSize,
} from './coinData.style';
import Coin from '../coin';
import Label from '../../label';
import { Maybe, Nothing } from '../../../../types/bepswap';

type Props = {
  'data-test'?: string;
  asset?: string;
  assetValue?: Maybe<TokenAmount>;
  target?: Maybe<string>;
  targetValue?: Maybe<TokenAmount>;
  price?: BigNumber;
  priceUnit?: string;
  priceValid?: boolean;
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
    price = bn(0),
    priceUnit = 'RUNE',
    priceValid = true,
    size = 'small',
    className = '',
    type = 'normal',
    ...otherProps
  } = props;

  const totalPrice =
    type === 'wallet'
      ? price.multipliedBy(assetValue?.amount() ?? 0)
      : price.multipliedBy(targetValue?.amount() ?? 0);

  const priceLabel = priceValid ? `${priceUnit.toUpperCase()}` : 'NOT LISTED';

  return (
    <CoinDataWrapper
      size={size}
      target={target}
      type={type}
      className={`coinData-wrapper ${className}`}
      {...otherProps}
    >
      <div className="coinData-content">
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size={size}
        />
        <div className="coinData-info-wrapper">
          <div className="coinData-asset-info" data-test="coin-data-asset-info">
            <Label
              className="coinData-asset-label"
              data-test="coin-data-asset-label"
              type="normal"
              weight="600"
            >
              {asset}
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
              <Label
                className="coinData-target-label"
                type="normal"
                weight="600"
              >
                {target}
              </Label>
              {targetValue && (
                <Label
                  className="coinData-target-value"
                  type="normal"
                  weight="600"
                >
                  {formatTokenAmount(targetValue)}
                </Label>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="asset-price-info">
        {priceValid && (
          <Label size="small" color="gray" weight="bold">
            {formatBN(totalPrice)}
          </Label>
        )}
        <Label size="small" color="gray" weight="bold">
          {priceLabel}
        </Label>
      </div>
    </CoinDataWrapper>
  );
};

export default CoinData;
