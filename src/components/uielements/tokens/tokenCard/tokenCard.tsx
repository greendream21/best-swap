import React from 'react';
import { sortBy as _sortBy } from 'lodash';

import BigNumber from 'bignumber.js';
import { TokenCardWrapper } from './tokenCard.style';

import Label from '../../label';
import TokenSelect from '../tokenSelect';
import TokenInput from '../tokenInput';
import { AssetPair, Nothing } from '../../../../types/bepswap';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { TokenAmount } from '../../../../types/token';
import { tokenAmount } from '../../../../helpers/tokenHelper';
import { formatBN, bn } from '../../../../helpers/bnHelper';
import { TokenInputProps } from '../tokenInput/types';

type Props = {
  asset: string;
  assetData: AssetPair[];
  amount: TokenAmount;
  price: BigNumber;
  priceIndex: PriceDataIndex;
  unit: string;
  slip?: BigNumber;
  title: string;
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
};

const TokenCard: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset = 'bnb',
    assetData = [],
    amount = tokenAmount(0),
    price = bn(0),
    priceIndex,
    unit = 'RUNE',
    slip,
    title = '',
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

  const slipValue = slip ? `slip ${formatBN(slip, 2)}%` : Nothing;
  // formula: amount * price
  const priceResult = amount.amount().multipliedBy(price);
  const priceValue = `${unit} ${formatBN(priceResult)}`;
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
          amount={amount.amount()}
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
