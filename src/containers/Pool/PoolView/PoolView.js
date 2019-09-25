import React, { Fragment, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import PoolCard from '../../../components/pool/poolCard';

import { ContentWrapper } from './PoolView.style';
import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';
import { getPoolData } from '../utils';

const { getPools } = statechainActions;
const { getRunePrice } = walletactions;

class PoolView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
    poolData: PropTypes.object.isRequired,
    swapData: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    runePrice: PropTypes.number.isRequired,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools, getRunePrice } = this.props;

    getPools();
    getRunePrice();
  }

  handleStake = ticker => () => {
    const URL = `/pool/${ticker}`;
    this.props.history.push(URL);
  };

  handleNewPool = () => {
    // const URL = '/pool/new/rune';
    // this.props.history.push(URL);
  };

  renderPoolList = () => {
    const { pools, poolData, swapData, runePrice, assetData } = this.props;
    const { activeAsset } = this.state;

    return pools.map((pool, index) => {
      const { ticker } = pool;
      const poolInfo = poolData[ticker] || {};
      const swapInfo = swapData[ticker] || {};

      const {
        asset,
        target,
        depth,
        volume24,
        transaction,
        liqFee,
        roiAT,
      } = getPoolData('rune', ticker, poolInfo, swapInfo, assetData, runePrice);

      if (target !== activeAsset) {
        return (
          <PoolCard
            className="pool-card"
            asset={asset}
            target={target}
            depth={depth}
            transaction={transaction}
            volume={volume24}
            liqFee={liqFee}
            roi={roiAT}
            onStake={this.handleStake(ticker)}
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
      runePrice: state.Wallet.runePrice,
      assetData: state.Wallet.assetData,
    }),
    {
      getPools,
      getRunePrice,
    },
  ),
  withRouter,
)(PoolView);
