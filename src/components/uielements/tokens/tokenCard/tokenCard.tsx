import React from 'react';
import { sortBy as _sortBy } from 'lodash';

import BigNumber from 'bignumber.js';
import { bn, formatBNCurrency } from '@thorchain/asgardex-util';
import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import { TokenCardWrapper } from './tokenCard.style';

import TokenSelect from '../tokenSelect';
import TokenInput from '../tokenInput';
import { AssetPair } from '../../../../types/bepswap';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { TokenInputProps } from '../tokenInput/types';

type Props = {
  asset: string;
  assetData: AssetPair[];
  amount: TokenAmount;
  price: BigNumber;
  priceIndex: PriceDataIndex;
  status?: string;
  inputTitle: string;
  searchDisable?: string[];
  withSearch: boolean;
  onSelect?: (_: number) => void;
  onChange?: (_: BigNumber) => void;
  onChangeAsset: (_: string) => void;
  className?: string;
  dataTestWrapper?: string;
  dataTestInput?: string;
  'data-test': string;
  inputProps: TokenInputProps;
  showPrice?: boolean;
};

const TokenCard: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset = 'bnb',
    assetData = [],
    amount = tokenAmount(0),
    price = bn(0),
    priceIndex,
    status = '',
    showPrice = false,
    inputTitle = '',
    withSearch = false,
    searchDisable = [],
    onSelect = () => {},
    onChange = (_: BigNumber) => {},
    onChangeAsset = () => {},
    className = '',
    inputProps = {},
    'data-test': dataTest = '',
    ...otherProps
  } = props;

  // formula: amount * price
  const priceResult = amount.amount().multipliedBy(price);
  const priceValue = `${formatBNCurrency(priceResult)}`;
  const tokenSelectDataTest = `${dataTest}-select`;
  const sortedAssetData = _sortBy(assetData, ['asset']);

  return (
    <TokenCardWrapper
      className={`tokenCard-wrapper ${className}`}
      {...otherProps}
    >
      <div className="token-card-content">
        <TokenInput
          title={inputTitle}
          amount={amount.amount()}
          onChange={onChange}
          label={showPrice ? priceValue : ''}
          inputProps={inputProps}
          status={status}
        />
        <TokenSelect
          asset={asset}
          price={price}
          priceIndex={priceIndex}
          assetData={sortedAssetData}
          withSearch={withSearch}
          searchDisable={searchDisable}
          onSelect={onSelect}
          onChangeAsset={onChangeAsset}
          data-test={tokenSelectDataTest}
        />
      </div>
    </TokenCardWrapper>
  );
};

export default TokenCard;
