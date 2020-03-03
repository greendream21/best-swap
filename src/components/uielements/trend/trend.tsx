import React from 'react';
import { Icon } from 'antd';

import Label from '../label';

import { getFixedNumber } from '../../../helpers/stringHelper';

import { TrendWrapper } from './trend.style';

type Props = {
  value: number;
};
const Trend: React.FC<Props> = (props: Props): JSX.Element => {
  const { value = 0, ...otherProps } = props;
  const trend = value >= 0;
  const trendIcon = trend ? 'arrow-up' : 'arrow-down';
  const trendVal = `${getFixedNumber(Math.abs(value))}%`;

  return (
    <TrendWrapper trend={trend} {...otherProps}>
      <Icon type={trendIcon} />
      <Label>{trendVal}</Label>
    </TrendWrapper>
  );
};

export default Trend;
