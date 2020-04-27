import React from 'react';

import BigNumber from 'bignumber.js';
import { TokenInfoWrapper } from './tokenInfo.style';
import Trend from '../../trend';
import Label from '../../label';

type Props = {
  asset: string;
  target: string;
  trend: BigNumber;
  value: string;
  label: string;
  loading: boolean;
  className?: string;
};

const TokenInfo: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    asset,
    target,
    value,
    label,
    trend,
    loading,
    className = '',
    ...otherProps
  } = props;
  const poolLabel = `${asset} / ${target}`;

  return (
    <TokenInfoWrapper
      className={`tokenInfo-wrapper ${className}`}
      {...otherProps}
    >
      <div className="tokenInfo-header">
        <Label className="pool-label">{poolLabel}</Label>
        <Trend amount={trend} />
      </div>
      <Label size="big">{value}</Label>
      <Label color="light">{label}</Label>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
