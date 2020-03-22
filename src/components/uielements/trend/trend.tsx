import React from 'react';
import { Icon } from 'antd';
import BigNumber from 'bignumber.js';
import Label from '../label';
import { TrendWrapper } from './trend.style';
import { formatBN, isValidBN, BN_ZERO } from '../../../helpers/bnHelper';

type Props = {
  amount?: BigNumber;
};
const Trend: React.FC<Props> = (props: Props): JSX.Element => {
  const { amount = BN_ZERO, ...otherProps } = props;
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
