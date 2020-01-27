import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import Label from '../label';

import { getFixedNumber } from '../../../helpers/stringHelper';

import { TrendWrapper } from './trend.style';

class Trend extends Component {
  render() {
    const { value, ...otherProps } = this.props;
    const trend = value >= 0;
    const trendIcon = trend ? 'arrow-up' : 'arrow-down';
    const trendVal = `${getFixedNumber(Math.abs(value))}%`;

    return (
      <TrendWrapper trend={trend} {...otherProps}>
        <Icon type={trendIcon} />
        <Label>{trendVal}</Label>
      </TrendWrapper>
    );
  }
}

Trend.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Trend;
