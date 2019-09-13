import React, { Fragment, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import PoolCard from '../../../components/pool/poolCard';

import { ContentWrapper } from './PoolView.style';
import statechainActions from '../../../redux/statechain/actions';

const { getPools } = statechainActions;

class PoolView extends Component {
  static propTypes = {
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools } = this.props;
    getPools();
  }

  handleStake = ticker => () => {
    const URL = `/pool/${ticker}`;

    this.props.history.push(URL);
  };

  handleNewPool = () => {
    const URL = '/pool/new/rune';

    this.props.history.push(URL);
  };

  renderPoolList = () => {
    const { pools } = this.props;
    const { activeAsset } = this.state;

    return (pools || []).map((pool, index) => {
      const assetData = {
        asset: 'rune',
        target: pool.ticker,
        depth: pool.poolData.depth,
        volume: pool.poolData.vol24hr,
        transaction: pool.swapData.aveTxTkn,
        roi: pool.poolData.roiAT,
      };
      const { asset, volume, transaction, liq, roi } = assetData;
      const target = assetData.target.split('-')[0];
      const depth = assetData.depth.toFixed(2);
      // TODO: add liquidity fee in `liq`
      if (target !== activeAsset) {
        return (
          <PoolCard
            className="pool-card"
            asset={asset}
            target={target}
            depth={depth}
            volume={volume}
            transaction={transaction}
            liq={''}
            roi={roi}
            onStake={this.handleStake(target)}
            key={index}
          />
        );
      }
      return <Fragment />;
    });
  };

  render() {
    return (
      <ContentWrapper className="pool-view-wrapper">
        <div className="pool-list-view">{this.renderPoolList()}</div>
        <div className="add-new-pool" onClick={this.handleNewPool}>
          <AddIcon />
          <Label size="normal" weight="bold" color="normal">
            ADD NEW POOL
          </Label>
        </div>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      pools: state.Statechain.pools,
    }),
    {
      getPools,
    },
  ),
  withRouter,
)(PoolView);
