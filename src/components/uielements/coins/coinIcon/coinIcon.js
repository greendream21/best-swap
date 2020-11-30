import React from 'react';

import { CheckOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { coinIconsFromTrustWallet } from 'settings/logoData';

import { coinIconGroup } from '../../../icons/coinIcons';
import DynamicCoin from '../dynamicCoin';
import { CoinIconWrapper } from './coinIcon.style';

const CoinIcon = props => {
  const { type, size, className, ...otherProps } = props;

  const renderCoinIcon = () => {
    const coinIcon = coinIconGroup[type.toLowerCase()] || '';
    const liveIcon = coinIconsFromTrustWallet[type.toUpperCase()] || '';

    if (liveIcon) {
      // currently we do load assets for Binance chain only
      // Note: Trustwallet supports asset names for mainnet only.
      const imgUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${liveIcon}/logo.png`;
      return <img src={imgUrl} alt={type} />;
    }
    if (coinIcon) {
      return <img src={coinIcon} alt={type} />;
    }
    if (type === 'blue') {
      return <div className="blue-circle" />;
    }
    if (type === 'confirm') {
      return (
        <div className="confirm-circle">
          <CheckOutlined />
        </div>
      );
    }
    return <DynamicCoin type={type} size={size} />;
  };

  return (
    <CoinIconWrapper
      type={type}
      size={size}
      className={`coinIcon-wrapper ${className}`}
      {...otherProps}
    >
      {renderCoinIcon()}
    </CoinIconWrapper>
  );
};

CoinIcon.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf(['small', 'big']),
  className: PropTypes.string,
};

CoinIcon.defaultProps = {
  type: 'bnb',
  size: 'big',
  className: '',
};

export default CoinIcon;
