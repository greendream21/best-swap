import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TokenInfoWrapper } from './tokenInfo.style';
import Trend from '../../trend';
import Label from '../../label';

class TokenInfo extends Component {
  static propTypes = {
    asset: PropTypes.string,
    target: PropTypes.string,
    trend: PropTypes.number,
    value: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    target: 'bnb',
    value: '',
    label: '',
    trend: 0,
    className: '',
  };

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

export default TokenInfo;
