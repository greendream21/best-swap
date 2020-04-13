import React from 'react';
import { Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { bn, isValidBN, formatBN } from '@thorchain/asgardex-util';
import Label from '../label';
import { TrendWrapper } from './trend.style';

type Props = {
  amount?: BigNumber;
};
const Trend: React.FC<Props> = (props: Props): JSX.Element => {
  const { amount = bn(0), ...otherProps } = props;
  const trend = isValidBN(amount) && amount.isGreaterThanOrEqualTo(0);
  const trendIcon = trend ? 'arrow-up' : 'arrow-down';
  const trendVal = `${formatBN(amount)}%`;

  return (
    <TrendWrapper trend={trend} {...otherProps}>
      <Icon type={trendIcon} />
      <Label>{trendVal}</Label>
    </TrendWrapper>
  );
};

export default Trend;
