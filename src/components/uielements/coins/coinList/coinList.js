import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import { CoinListWrapper } from './coinList.style';
import CoinData from '../coinData';
import { getTickerFormat } from '../../../../helpers/stringHelper';

class CoinList extends Component {
  getPrice = (asset, priceIndex) => {
    return priceIndex[asset.toUpperCase()] || 0;
  };

  toggleSelect = key => () => {
    const { onSelect } = this.props;

    onSelect(key);
  };

  render() {
    const {
      data,
      size,
      value,
      selected,
      onSelect,
      priceIndex,
      unit,
      type,
      className,
      isStakeData,
      ...props
    } = this.props;

    return (
      <CoinListWrapper
        size={size}
        className={`coinList-wrapper ${className}`}
        {...props}
      >
        <Scrollbars className="coinList-scroll">
          {data.map((coinData, index) => {
            const { asset, assetValue, target, targetValue } = coinData;

            let priceValue;
            if (!isStakeData) {
              priceValue = this.getPrice(getTickerFormat(asset), priceIndex);
            } else {
              priceValue = this.getPrice(getTickerFormat(target), priceIndex);
            }

            const tokenName = getTickerFormat(asset);

            if (!tokenName) {
              return <Fragment key={asset} />;
            }

            const isSelected = selected.includes(index);
            const activeClass = isSelected || value === index ? 'active' : '';

            return (
              <div
                className={`coinList-row ${activeClass}`}
                onClick={this.toggleSelect(index)}
                key={index}
              >
                <CoinData
                  data-test={`coin-list-item-${tokenName}`}
                  asset={tokenName}
                  assetValue={assetValue}
                  target={target}
                  targetValue={targetValue}
                  price={priceValue}
                  priceUnit={unit}
                  size={size}
                  type={type}
                />
              </div>
            );
          })}
        </Scrollbars>
      </CoinListWrapper>
    );
  }
}

CoinList.propTypes = {
  data: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'big']),
  className: PropTypes.string,
  priceIndex: PropTypes.object,
  unit: PropTypes.string,
  isStakeData: PropTypes.bool,
  type: PropTypes.string,
};

CoinList.defaultProps = {
  isStakeData: false,
  data: [],
  selected: [],
  size: 'small',
  unit: 'RUNE',
  className: '',
  type: 'normal',
};

export default CoinList;
