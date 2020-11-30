import React from 'react';

import Label from '../../label';
import { TokenInfoWrapper } from './tokenInfo.style';

type Props = {
  asset: string;
  target: string;
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
    loading,
    className = '',
    ...otherProps
  } = props;

  return (
    <TokenInfoWrapper
      className={`tokenInfo-wrapper ${className}`}
      {...otherProps}
    >
      <Label size="big">{value}</Label>
      <Label color="light">{label}</Label>
    </TokenInfoWrapper>
  );
};

export default TokenInfo;
