import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AssetInfoWrapper } from './assetInfo.style';

import Coin from '../../coins/coin';

class AssetInfo extends Component {
  static propTypes = {
    asset: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    asset: 'bnb',
    size: 'small',
    className: '',
  };

  render() {
    const { asset, size, className, ...props } = this.props;

    return (
      <AssetInfoWrapper className={`assetInfo-wrapper ${className}`} {...props}>
        <Coin className="asset-avatar" type={asset} size={size} />
        <div className="asset-label">{asset}</div>
      </AssetInfoWrapper>
    );
  }
}

export default AssetInfo;
