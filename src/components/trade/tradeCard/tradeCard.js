import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardLayout from '../../cardLayout';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';
import { getUserFormat } from '../../../helpers/stringHelper';

class TradeCard extends Component {
  static propTypes = {
    asset: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    depth: PropTypes.number,
    poolPrice: PropTypes.number,
    marketPrice: PropTypes.number,
    premium: PropTypes.number,
    reward: PropTypes.number,
    onTrade: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    depth: 0,
    poolPrice: 0,
    marketPrice: 0,
    premium: 0,
    reward: 0,
    className: '',
  };

  render() {
    const {
      asset,
      target,
      depth,
      poolPrice,
      marketPrice,
      premium,
      reward,
      onTrade,
      className,
      ...props
    } = this.props;

    const poolValue = `${asset}:${target}`;
    const depthValue = `$${getUserFormat(depth)}`;
    const poolPriceValue = `$${getUserFormat(poolPrice)}`;
    const marketPriceValue = `$${getUserFormat(marketPrice)}`;
    const premiumValue = `${getUserFormat(premium)}%`;
    const rewardValue = `$${getUserFormat(reward)}`;

    return (
      <CardLayout.Item className={className} {...props}>
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
          <CardLayout.Item showFrom="md">
            <Status title="Depth" value={depthValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="md">
            <Status title="Pool Price" value={poolPriceValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="Market Price" value={marketPriceValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="Premium" value={premiumValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="xl">
            <Status
              className="reward-status"
              title="Potential Reward"
              value={rewardValue}
            />
          </CardLayout.Item>
          <CardLayout.Item noShrink showFrom="xs">
            <Button data-test="trade-button" onClick={onTrade} color="success">
              trade
            </Button>
          </CardLayout.Item>
        </CardLayout.Group>
      </CardLayout.Item>
    );
  }
}

export default TradeCard;
