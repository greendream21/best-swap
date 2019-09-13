import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { CoinListWrapper } from './coinList.style';
import CoinData from '../coinData';

class CoinList extends Component {
  static propTypes = {
    data: PropTypes.array,
    value: PropTypes.string.isRequired,
    selected: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    selected: [],
    size: 'small',
    className: '',
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
      className,
      ...props
    } = this.props;

    return (
      <CoinListWrapper
        size={size}
        className={`coinList-wrapper ${className}`}
        {...props}
      >
        {data.map((coinData, index) => {
          const { asset, assetValue, target, targetValue, price } = coinData;

          const tokenName = asset.split('-')[0];

          if (!tokenName) {
            console.log(asset, 'is not a recognized token');
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
                asset={tokenName.toLowerCase()}
                assetValue={assetValue}
                target={target}
                targetValue={targetValue}
                price={price}
                size={size}
              />
            </div>
          );
        })}
      </CoinListWrapper>
    );
  }
}

export default CoinList;
