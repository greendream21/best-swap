import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SwapCardRow, SwapCardGroup, SwapCardItem } from './swapCard.style';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';
import { getActualValue } from '../../../helpers/stringHelper';

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
    const depthValue = `$${getActualValue(depth)}`;
    const volumeValue = `$${getActualValue(volume)}`;
    const transactionValue = `$${getActualValue(transaction)}`;
    const slipValue = `${getActualValue(slip)}%`;
    const tradeValue = `${getActualValue(trade)}`;

    return (
      <SwapCardRow className={className} {...props}>
        <SwapCardGroup>
          <SwapCardItem clamp={60}>
            <Coin
              className="coinData-coin-avatar"
              type={asset}
              over={target}
              size="big"
            />
          </SwapCardItem>

          <SwapCardItem min={130}>
            <Status className="pool-status" title="Pool" value={poolValue} />
          </SwapCardItem>
          <SwapCardItem showFrom="sm">
            <Status title="Depth" value={depthValue} />
          </SwapCardItem>
          <SwapCardItem showFrom="md">
            <Status title="24hr volume" value={volumeValue} />
          </SwapCardItem>
          <SwapCardItem showFrom="md">
            <Status title="Avg. Transaction" value={transactionValue} />
          </SwapCardItem>
          <SwapCardItem showFrom="lg">
            <Status title="Avg. Slip" value={slipValue} />
          </SwapCardItem>
          <SwapCardItem showFrom="lg">
            <Status title="No. Of Trades" value={tradeValue} />
          </SwapCardItem>
        </SwapCardGroup>

        <SwapCardItem showFrom="xs">
          <Button onClick={onSwap} color="success">
            swap
          </Button>
        </SwapCardItem>
      </SwapCardRow>
    );
  }
}

export default SwapCard;
