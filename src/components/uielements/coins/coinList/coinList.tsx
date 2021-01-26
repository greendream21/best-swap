import React, { Fragment, useCallback } from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import { tokenToBase } from '@thorchain/asgardex-token';

import Button from 'components/uielements/button';

import { AssetData } from 'redux/wallet/types';

import usePrice from 'hooks/usePrice';

import { getTickerFormat } from 'helpers/stringHelper';

import { Maybe } from 'types/bepswap';

import Label from '../../label';
import CoinData from '../coinData';
import { CoinDataWrapperType } from '../coinData/coinData.style';
import {
  CoinListWrapper,
  CoinListWrapperSize,
  ButtonWrapper,
} from './coinList.style';

export type CoinListDataList = AssetData[];

type Props = {
  data?: CoinListDataList;
  selected?: Maybe<CoinListDataList>;
  onSelect?: (key: number) => void;
  onSwap?: (asset: string) => void;
  onSend?: (asset: string) => void;
  size?: CoinListWrapperSize;
  className?: string;
  type?: CoinDataWrapperType;
};

export const CoinList: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    data = [],
    selected = [],
    size = 'small',
    className = '',
    type = 'liquidity',
    onSelect = (_: number) => {},
    onSwap = () => {},
    onSend = () => {},
    ...otherProps
  } = props;

  const { getReducedPriceLabel } = usePrice();

  const handleClick = useCallback(
    (key: number) => () => {
      onSelect(key);
    },
    [onSelect],
  );

  const handleSwap = useCallback(
    (asset: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onSwap(asset);
    },
    [onSwap],
  );

  const handleSend = useCallback(
    (asset: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      onSend(asset);
    },
    [onSend],
  );

  const displayPrice = type === 'liquidity';
  const isWalletType = type === 'wallet';

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
              onClick={handleClick(index)}
              key={index}
            >
              <CoinData
                asset={tokenName}
                assetValue={!displayPrice ? assetValue : undefined}
                size={size}
              />
              {isWalletType && (
                <ButtonWrapper>
                  <Button
                    sizevalue="small"
                    color="primary"
                    typevalue="outline"
                    onClick={handleSwap(asset)}
                  >
                    Swap
                  </Button>
                  <Button
                    sizevalue="small"
                    color="primary"
                    typevalue="outline"
                    onClick={handleSend(asset)}
                  >
                    Send
                  </Button>
                </ButtonWrapper>
              )}
              {displayPrice && <Label>{priceLabel}</Label>}
            </div>
          );
        })}
      </Scrollbars>
    </CoinListWrapper>
  );
};
