import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SwapCardWrapper } from './swapCard.style';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';

class SwapCard extends Component {
  static propTypes = {
    asset: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    depth: PropTypes.number,
    volume: PropTypes.number,
    transaction: PropTypes.number,
    slip: PropTypes.number,
    trade: PropTypes.number,
    onSwap: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    depth: 0,
    volume: 0,
    transaction: 0,
    slip: 0,
    trade: 0,
    className: '',
  };

  render() {
    const {
      asset,
      target,
      depth,
      volume,
      transaction,
      slip,
      trade,
      onSwap,
      className,
      ...props
    } = this.props;

    const poolValue = `${asset}:${target}`;
    const depthValue = `$${depth}`;
    const volumeValue = `$${volume}`;
    const transactionValue = `$${transaction}`;
    const slipValue = `${slip}%`;
    const tradeValue = `${trade}`;

    return (
      <SwapCardWrapper className={`SwapCard-wrapper ${className}`} {...props}>
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size="big"
        />
        <Status className="pool-status" title="Pool" value={poolValue} />
        <Status title="Depth" value={depthValue} />
        <Status title="24hr volume" value={volumeValue} />
        <Status title="Avg. Transaction" value={transactionValue} />
        <Status title="Avg. Slip" value={slipValue} />
        <Status
          title="No. Of Trades"
          value={tradeValue}
          className="trade-status"
        />
        <Button onClick={onSwap} color="success">
          swap
        </Button>
      </SwapCardWrapper>
    );
  }
}

export default SwapCard;
