import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardLayout from '../../cardLayout';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';
import { getActualValue } from '../../../helpers/stringHelper';

class PoolCard extends Component {
  static propTypes = {
    asset: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    depth: PropTypes.number,
    volume: PropTypes.number,
    transaction: PropTypes.number,
    liqFee: PropTypes.number,
    roi: PropTypes.number,
    onStake: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    depth: 0,
    volume: 0,
    transaction: 0,
    liqFee: 0,
    roi: 0,
    className: '',
  };

  render() {
    const {
      asset,
      target,
      depth,
      volume,
      transaction,
      liqFee,
      roi,
      onStake,
      className,
      ...props
    } = this.props;

    const poolValue = `${asset}:${target}`;
    const depthValue = `$${getActualValue(depth)}`;
    const volumeValue = `$${getActualValue(volume)}`;
    const transactionValue = `$${getActualValue(transaction)}`;
    const liqFeeValue = `${getActualValue(liqFee)}%`;
    const roiValue = `${getActualValue(roi)}% pa`;

    return (
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
          <CardLayout.Item showFrom="md">
            <Status title="Depth" value={depthValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="md">
            <Status title="24hr volume" value={volumeValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="Avg. Transaction" value={transactionValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="lg">
            <Status title="Avg. Liq Fee" value={liqFeeValue} />
          </CardLayout.Item>
          <CardLayout.Item showFrom="xl">
            <Status
              className="roi-status"
              title="Historical ROI"
              value={roiValue}
            />
          </CardLayout.Item>
        </CardLayout.Group>
        <CardLayout.Item noShrink showFrom="xs">
          <Button onClick={onStake} color="success">
            stake
          </Button>
        </CardLayout.Item>
      </CardLayout.Row>
    );
  }
}

export default PoolCard;
