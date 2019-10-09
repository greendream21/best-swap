import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import { CoinListWrapper } from './coinList.style';
import CoinData from '../coinData';
import { getTickerFormat } from '../../../../helpers/stringHelper';

class CoinList extends Component {
  static propTypes = {
    data: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selected: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
    tokenInfo: PropTypes.object,
    runePrice: PropTypes.number.isRequired,
  };

  static defaultProps = {
    data: [],
    selected: [],
    size: 'small',
    className: '',
  };

  getTokenPrice = (asset, runePrice, tokenInfo, price) => {
    if (asset === 'RUNE-A1F') {
      return runePrice;
    }
    return !tokenInfo[asset] ? price : tokenInfo[asset].price;
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
      runePrice,
      tokenInfo,
      className,
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
            const { asset, assetValue, target, targetValue, price } = coinData;

            const tokenPrice = this.getTokenPrice(
              asset,
              runePrice,
              tokenInfo,
              price,
            );

            const tokenName = getTickerFormat(asset);

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
                  data-test={`coin-list-item-${tokenName}`}
                  asset={tokenName}
                  assetValue={assetValue}
                  target={target}
                  targetValue={targetValue}
                  price={tokenPrice}
                  size={size}
                />
              </div>
            );
          })}
        </Scrollbars>
      </CoinListWrapper>
    );
  }
}

export default CoinList;
