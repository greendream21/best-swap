import React, { Fragment, useCallback } from 'react';

import { Scrollbars } from 'react-custom-scrollbars';
import { tokenToBase } from '@thorchain/asgardex-token';

import CoinData from '../coinData';
import Label from '../../label';
import { CoinListWrapper, CoinListWrapperSize } from './coinList.style';
import { getTickerFormat } from '../../../../helpers/stringHelper';
import { Maybe } from '../../../../types/bepswap';
import { AssetData } from '../../../../redux/wallet/types';
import { CoinDataWrapperType } from '../coinData/coinData.style';

import usePrice from '../../../../hooks/usePrice';

export type CoinListDataList = AssetData[];

type Props = {
  data?: CoinListDataList;
  selected?: Maybe<CoinListDataList>;
  onSelect?: (key: number) => void;
  size?: CoinListWrapperSize;
  className?: string;
  type?: CoinDataWrapperType;
};

export const CoinList: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    data = [],
    selected = [],
    onSelect = (_: number) => {},
    size = 'small',
    className = '',
    type = 'liquidity',
    ...otherProps
  } = props;

  const { getReducedPriceLabel } = usePrice();

  const toggleSelect = useCallback(
    (key: number) => () => {
      onSelect(key);
    },
    [onSelect],
  );

  const displayPrice = type === 'liquidity';

  return (
    <CoinListWrapper
      size={size}
      className={`coinList-wrapper ${className}`}
      {...otherProps}
    >
      <Scrollbars className="coinList-scroll">
        {data.map((coinData: AssetData, index: number) => {
          const { asset, assetValue } = coinData;

          const tokenName = getTickerFormat(asset);

          if (!tokenName) {
            return <Fragment key={asset} />;
          }

          const isSelected = selected && selected.includes(coinData);
          const activeClass = isSelected ? 'active' : '';

          const priceAmount = tokenToBase(assetValue);
          const priceLabel = getReducedPriceLabel(priceAmount.amount());

          return (
            <div
              className={`coinList-row ${activeClass}`}
              onClick={toggleSelect(index)}
              key={index}
            >
              <CoinData
                asset={tokenName}
                assetValue={assetValue}
                size={size}
              />
              {displayPrice && (
                <Label>
                  {priceLabel}
                </Label>
              )}
            </div>
          );
        })}
      </Scrollbars>
    </CoinListWrapper>
  );
};
