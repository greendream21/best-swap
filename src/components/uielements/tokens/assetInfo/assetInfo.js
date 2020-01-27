import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AssetInfoWrapper } from './assetInfo.style';

import Coin from '../../coins/coin';

class AssetInfo extends Component {
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

AssetInfo.propTypes = {
  asset: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};
AssetInfo.defaultProps = {
  asset: 'bnb',
  size: 'small',
  className: '',
};

export default AssetInfo;
