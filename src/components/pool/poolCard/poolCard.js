import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PoolCardWrapper } from './poolCard.style';
import { coinGroup } from '../../../settings';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';

class PoolCard extends Component {
  static propTypes = {
    asset: PropTypes.oneOf(coinGroup).isRequired,
    target: PropTypes.oneOf(coinGroup).isRequired,
    depth: PropTypes.number,
    volumn: PropTypes.number,
    transaction: PropTypes.number,
    liq: PropTypes.number,
    roi: PropTypes.number,
    onStake: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    depth: 0,
    volumn: 0,
    transaction: 0,
    liq: 0,
    roi: 0,
    className: '',
  };

  render() {
    const {
      asset,
      target,
      depth,
      volumn,
      transaction,
      liq,
      roi,
      onStake,
      className,
      ...props
    } = this.props;

    const poolValue = `${asset}:${target}`;
    const depthValue = `$${depth}`;
    const volumnValue = `$${volumn}`;
    const transactionValue = `$${transaction}`;
    const liqValue = `${liq}%`;
    const roiValue = `${roi}% pa`;

    return (
      <PoolCardWrapper className={`poolCard-wrapper ${className}`} {...props}>
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size="big"
        />
        <Status className="pool-status" title="Pool" value={poolValue} />
        <Status title="Depth" value={depthValue} />
        <Status title="24hr Volumn" value={volumnValue} />
        <Status title="Avg. Transaction" value={transactionValue} />
        <Status title="Avg. Liq Fee" value={liqValue} />
        <Status
          className="roi-status"
          title="Historical ROI"
          value={roiValue}
        />
        <Button onClick={onStake} color="success">
          stake
        </Button>
      </PoolCardWrapper>
    );
  }
}

export default PoolCard;
