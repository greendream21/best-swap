import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardLayout from '../../cardLayout';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';
import { getUserFormat } from '../../../helpers/stringHelper';

class SwapCard extends Component {
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
    const depthValue = `$${getUserFormat(depth).toLocaleString()}`;
    const volumeValue = `$${getUserFormat(volume)}`;
    const transactionValue = `$${getUserFormat(transaction)}`;
    const slipValue = `${getUserFormat(slip)}%`;
    const tradeValue = `${trade}`;

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <CardLayout.Row className={className} {...props}>
        <CardLayout.Group>
          <CardLayout.Item clamp={80}>
            <Coin
              className="coinData-coin-avatar"
              type={asset}
              over={target}
              size="big"
            />
          </CardLayout.Item>
          <CardLayout.Item>
            <Status className="pool-status" title="Pool" value={poolValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="sm">
            <Status title="Depth" value={depthValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="md">
            <Status title="24hr volume" value={volumeValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="md">
            <Status title="Avg. Transaction" value={transactionValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="Avg. Slip" value={slipValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="No. Of Trades" value={tradeValue} />
          </CardLayout.Item>
        </CardLayout.Group>
        <CardLayout.Item noShrink showFrom="xs">
          <Button data-test="swap-button" onClick={onSwap} color="success">
            swap
          </Button>
        </CardLayout.Item>
      </CardLayout.Row>
    );
  }
}

SwapCard.propTypes = {
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

SwapCard.defaultProps = {
  depth: 0,
  volume: 0,
  transaction: 0,
  slip: 0,
  trade: 0,
  className: '',
};

export default SwapCard;
