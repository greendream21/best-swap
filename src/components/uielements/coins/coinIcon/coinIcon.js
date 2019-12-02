import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import DynamicCoin from '../dynamicCoin';

import { CoinIconWrapper } from './coinIcon.style';
import { coinIconGroup } from '../../../icons/coinIcons';

class CoinIcon extends Component {
  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'bnb',
    size: 'big',
    className: '',
  };

  renderCoinIcon = () => {
    const { type, size } = this.props;
    const coinIcon = coinIconGroup[type.toLowerCase()] || '';

    if (coinIcon) {
      return <img src={coinIcon} alt={type} />;
    }
    if (type === 'blue') {
      return <div className="blue-circle" />;
    }
    if (type === 'confirm') {
      return (
        <div className="confirm-circle">
          <Icon type="check" />
        </div>
      );
    }
    return <DynamicCoin type={type} size={size} />;
  };

  render() {
    const { type, className, ...props } = this.props;

    return (
      <CoinIconWrapper
        type={type}
        className={`coinIcon-wrapper ${className}`}
        {...props}
      >
        {this.renderCoinIcon()}
      </CoinIconWrapper>
    );
  }
}

export default CoinIcon;
