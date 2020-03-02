import React, { Fragment, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { CoinListWrapper, CoinListWrapperSize } from './coinList.style';
import CoinData from '../coinData';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import { Maybe, Nothing } from '../../../../types/bepswap';
import { AssetData, StakeData, StakeOrAssetData, isStakeData } from '../../../../redux/wallet/types';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { CoinDataWrapperType } from '../coinData/coinData.style';

export type CoinListDataList = AssetData[] | StakeData[]

type Props = {
  data?: CoinListDataList;
  value?: Maybe<StakeOrAssetData>;
  selected?: AssetData[];
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
    value = Nothing,
    selected = [],
    onSelect = (_: number) => {},
    priceIndex,
    size = 'small',
    unit = 'RUNE',
    className = '',
    type = 'normal',
    ...otherProps
  } = props;

  const getPrice = useCallback((asset: string) => {
    const ticker = getTickerFormat(asset);
    return priceIndex[ticker.toUpperCase()] || 0;
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
            let targetValue: Maybe<number> = Nothing;

            const { asset, assetValue } = coinData;

            let priceValue;

            if (isStakeData(coinData)) {
              target = coinData.target;
              targetValue = coinData.targetValue;
              priceValue = getPrice(target);
            } else {
              priceValue = getPrice(asset);
            }


            const tokenName = getTickerFormat(asset);

            if (!tokenName) {
              return <Fragment key={asset} />;
            }

            const isSelected = selected.includes(data[index]);
            const activeClass = isSelected || value === data[index] ? 'active' : '';

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
                  price={priceValue}
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
