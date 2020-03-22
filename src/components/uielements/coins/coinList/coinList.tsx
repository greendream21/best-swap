import React, { Fragment, useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { Scrollbars } from 'react-custom-scrollbars';
import { CoinListWrapper, CoinListWrapperSize } from './coinList.style';
import CoinData from '../coinData';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import { Maybe, Nothing } from '../../../../types/bepswap';
import { StakeOrAssetData, isStakeData } from '../../../../redux/wallet/types';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { CoinDataWrapperType } from '../coinData/coinData.style';
import { validBNOrZero } from '../../../../helpers/bnHelper';
import { TokenAmount } from '../../../../types/token';

// This does not work anymore
// export type CoinListDataList = AssetData[] | StakeData[]
// ^ Maybe similar issue to "error on valid array with union type" https://github.com/microsoft/TypeScript/issues/36390

export type CoinListDataList = StakeOrAssetData[]

type Props = {
  data?: CoinListDataList;
  selected?: Maybe<CoinListDataList>;
  onSelect?: (key: number) => void;
  size?: CoinListWrapperSize;
  className?: string;
  priceIndex: PriceDataIndex;
  unit?: string;
  type?: CoinDataWrapperType;
};

export const CoinList: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    data = [],
    selected = [],
    onSelect = (_: number) => {},
    priceIndex,
    size = 'small',
    unit = 'RUNE',
    className = '',
    type = 'normal',
    ...otherProps
  } = props;

  const getPrice = useCallback((asset: string): BigNumber => {
    const ticker = getTickerFormat(asset);
    return validBNOrZero(priceIndex[ticker.toUpperCase()]);
  }, [priceIndex]);

  const toggleSelect = useCallback((key: number) => () => {
    onSelect(key);
  }, [onSelect]);

  return (
    <CoinListWrapper
      size={size}
      className={`coinList-wrapper ${className}`}
      {...otherProps}
    >
      <Scrollbars className="coinList-scroll">
        {data.map((coinData: StakeOrAssetData, index: number) => {
            let target: Maybe<string> = Nothing;
            let targetValue: Maybe<TokenAmount> = Nothing;

            const { asset, assetValue } = coinData;

            let price;

            if (isStakeData(coinData)) {
              target = coinData.target;
              targetValue = coinData.targetValue;
              price = getPrice(target);
            } else {
              price = getPrice(asset);
            }

            const tokenName = getTickerFormat(asset);

            if (!tokenName) {
              return <Fragment key={asset} />;
            }

            const isSelected = selected && selected.includes(coinData);
            const activeClass = isSelected ? 'active' : '';

            return (
              <div
                className={`coinList-row ${activeClass}`}
                onClick={toggleSelect(index)}
                key={index}
              >
                <CoinData
                  data-test={`coin-list-item-${tokenName}`}
                  asset={tokenName}
                  assetValue={assetValue}
                  target={target}
                  targetValue={targetValue}
                  price={price}
                  priceUnit={unit}
                  size={size}
                  type={type}
                />
              </div>
            );
          })}
      </Scrollbars>
    </CoinListWrapper>
    );
};
