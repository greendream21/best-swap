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
    poolData: PropTypes.object.isRequired,
    swapData: PropTypes.object.isRequired,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools } = this.props;
    getPools();
  }

  handleStake = ticker => () => {
    // const URL = `/pool/${ticker}`;
    // this.props.history.push(URL);
  };

  handleNewPool = () => {
    // const URL = '/pool/new/rune';
    // this.props.history.push(URL);
  };

  renderPoolList = () => {
    const { pools, poolData, swapData } = this.props;
    const { activeAsset } = this.state;

    return pools.map((pool, index) => {
      const { ticker } = pool;
      const poolInfo = poolData[ticker] || {};
      const swapInfo = swapData[ticker] || {};

      const assetData = {
        asset: 'rune',
        target: ticker,
        depth: poolInfo.depth || 0,
        volume: poolInfo.vol24hr || 0,
        transaction: swapInfo.aveTxTkn || 0,
        roi: poolInfo.roiAT || 0,
      };
      const { asset, volume, transaction, liq, roi } = assetData;
      const target = assetData.target.split('-')[0];
      const depth = Number(assetData.depth.toFixed(2));
      const hisRoi = Number(roi.toFixed(2));

      if (target !== activeAsset) {
        return (
          <PoolCard
            className="pool-card"
            asset={asset}
            target={target}
            depth={depth}
            volume={volume}
            transaction={transaction}
            liq={liq}
            roi={hisRoi}
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
        {/* { TODO: hide addpool button in the testnet } */}
        {/* <div className="add-new-pool" onClick={this.handleNewPool}>
          <AddIcon />
          <Label size="normal" weight="bold" color="normal">
            ADD NEW POOL
          </Label>
        </div> */}
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      pools: state.Statechain.pools,
      poolData: state.Statechain.poolData,
      swapData: state.Statechain.swapData,
    }),
    {
      getPools,
    },
  ),
  withRouter,
)(PoolView);
