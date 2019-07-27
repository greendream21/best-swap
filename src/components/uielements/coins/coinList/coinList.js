import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoinListWrapper } from './coinList.style';
import CoinData from '../coinData';

class CoinList extends Component {
  static propTypes = {
    data: PropTypes.array,
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    size: 'small',
    className: '',
  };

  state = {
    selected: {},
  };

  toggleSelect = key => () => {
    const { selected } = this.state;
    const update = selected;
    if (selected[key]) {
      update[key] = false;
    } else {
      update[key] = true;
    }

    this.setState({
      selected: update,
    });
  };

  render() {
    const { data, size, className, ...props } = this.props;
    const { selected } = this.state;

    return (
      <CoinListWrapper
        size={size}
        className={`coinList-wrapper ${className}`}
        {...props}
      >
        {data.map((coinData, index) => {
          const { asset, assetValue, target, targetValue, price } = coinData;
          const activeClass = selected[index] ? 'active' : '';

          return (
            <div
              className={`coinList-row ${activeClass}`}
              onClick={this.toggleSelect(index)}
              key={index}
            >
              <CoinData
                asset={asset}
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
