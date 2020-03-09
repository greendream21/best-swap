import React from 'react';
import { sortBy as _sortBy } from 'lodash';

import { TokenCardWrapper } from './tokenCard.style';

import { getFixedNumber } from '../../../../helpers/stringHelper';

import Label from '../../label';
import TokenSelect from '../tokenSelect';
import TokenInput from '../tokenInput';
import { AssetPair, Nothing } from '../../../../types/bepswap';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { TokenInputProps } from '../tokenInput/types';

type Props = {
  asset: string;
  assetData: AssetPair[];
  amount: number;
  price: number;
  priceIndex: PriceDataIndex;
  unit: string;
  slip?: number;
  title: string;
  inputTitle: string;
  searchDisable?: string[];
  withSearch: boolean;
  onSelect?: (_: number) => void;
  onChange?: (_: number) => void;
  onChangeAsset: (_: string) => void;
  className?: string;
  dataTestWrapper?: string;
  dataTestInput?: string;
  'data-test': string;
  inputProps: TokenInputProps;
};

const TokenCard: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset = 'bnb',
    assetData = [],
    amount = 0,
    price = 0,
    priceIndex,
    unit = 'RUNE',
    slip,
    title = '',
    inputTitle = '',
    withSearch = false,
    searchDisable = [],
    onSelect = () => {},
    onChange = (_: number) => {},
    onChangeAsset = () => {},
    className = '',
    inputProps = {},
    'data-test': dataTest = '',
    ...otherProps
  } = props;

  const slipValue = slip ? `slip ${slip}%` : Nothing;
  const priceValue = `${unit} ${getFixedNumber(amount * price)}`;
  const tokenSelectDataTest = `${dataTest}-select`;
  const sortedAssetData = _sortBy(assetData, ['asset']);

  return (
    <TokenCardWrapper
      className={`tokenCard-wrapper ${className}`}
      {...otherProps}
    >
      {title && <Label className="title-label">{title}</Label>}
      <div className="token-card-content">
        <TokenInput
          title={inputTitle}
          status={slipValue}
          amount={amount}
          onChange={onChange}
          label={priceValue}
          inputProps={inputProps}
        />
        <TokenSelect
          asset={asset}
          price={price}
          priceIndex={priceIndex}
          priceUnit={unit}
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
