import React, { Fragment, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { notification } from 'antd';

import PoolCard from '../../../components/pool/poolCard';
import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import PoolLoader from '../../../components/utility/loaders/pool';

import { ContentWrapper } from './PoolView.style';
import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';
import { getPoolData, getCreatePoolTokens } from '../utils';
import { getTickerFormat } from '../../../helpers/stringHelper';

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
    loading: PropTypes.bool.isRequired,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools, getRunePrice } = this.props;

    getPools();
    getRunePrice();
  }

  handleStake = symbol => () => {
    const URL = `/pool/${symbol}`;
    this.props.history.push(URL);
  };

  handleNewPool = () => {
    const { assetData, pools } = this.props;
    const possibleTokens = getCreatePoolTokens(assetData, pools);
    console.log(possibleTokens);
    if (possibleTokens.length) {
      const symbol = possibleTokens[0].asset;
      if (getTickerFormat(symbol) !== 'rune') {
        const URL = `/pool/${symbol}/new`;
        this.props.history.push(URL);
      }
    } else {
      notification.warning({
        message: 'Create Pool Failed',
        description: 'You cannot create a new pool.',
      });
    }
  };

  renderPoolList = () => {
    const { pools, poolData, swapData, runePrice, assetData } = this.props;
    const { activeAsset } = this.state;

    return pools.map((pool, index) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};
      const swapInfo = swapData[symbol] || {};

      const {
        asset,
        target,
        depth,
        volume24,
        transaction,
        liqFee,
        roiAT,
      } = getPoolData('rune', symbol, poolInfo, swapInfo, assetData, runePrice);

      if (target !== activeAsset) {
        return (
          <PoolCard
            className="pool-card"
            data-test={`pool-card-${symbol}`}
            asset={asset}
            target={target}
            depth={depth}
            transaction={transaction}
            volume={volume24}
            liqFee={liqFee}
            roi={roiAT}
            onStake={this.handleStake(symbol)}
            key={index}
          />
        );
      }
      return <Fragment />;
    });
  };

  render() {
    const { loading } = this.props;

    return (
      <ContentWrapper className="pool-view-wrapper">
        {loading && <PoolLoader />}
        {!loading && (
          <>
            <div className="pool-list-view">{this.renderPoolList()}</div>
            <div className="add-new-pool" onClick={this.handleNewPool}>
              <AddIcon />
              <Label size="normal" weight="bold" color="normal">
                ADD NEW POOL
              </Label>
            </div>
          </>
        )}
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
      loading: state.Statechain.loading,
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
