import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenInfoWrapper } from './tokenInfo.style';
import Trend from '../../trend';
import Label from '../../label';

class TokenInfo extends Component {
  render() {
    const {
      asset,
      target,
      value,
      label,
      trend,
      className,
      ...props
    } = this.props;
    const poolLabel = `${asset} / ${target}`;

    return (
      <TokenInfoWrapper className={`tokenInfo-wrapper ${className}`} {...props}>
        <div className="tokenInfo-header">
          <Label className="pool-label">{poolLabel}</Label>
          <Trend value={trend} />
        </div>
        <Label size="big">{value}</Label>
        <Label color="light">{label}</Label>
      </TokenInfoWrapper>
    );
  }
}

TokenInfo.propTypes = {
  asset: PropTypes.string,
  target: PropTypes.string,
  trend: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  className: PropTypes.string,
};

TokenInfo.defaultProps = {
  asset: 'bnb',
  target: 'bnb',
  value: '',
  label: '',
  trend: 0,
  className: '',
};

export default TokenInfo;
