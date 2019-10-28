import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { notification, Icon } from 'antd';

import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import PoolLoader from '../../../components/utility/loaders/pool';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Trend from '../../../components/uielements/trend';
import Table from '../../../components/uielements/table';
import Button from '../../../components/uielements/button';

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

  renderPoolTable = swapViewData => {
    const columns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }) => <CoinPair from={asset} to={target} />,
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
      },
      {
        key: 'volume24',
        title: '24h vol',
        dataIndex: 'volume24',
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
      },
      {
        key: 'liqFee',
        title: 'avg. liq fee',
        dataIndex: 'liqFee',
        render: slip => <Trend value={slip} />,
      },
      {
        key: 'roiAT',
        title: 'historical roi',
        dataIndex: 'roiAT',
      },
      {
        key: 'stake',
        title: (
          <Button typevalue="outline">
            <Icon type="sync" />
            refresh
          </Button>
        ),
        render: (text, record) => {
          const {
            pool: { target },
          } = record;
          return (
            <Button
              onClick={this.handleStake(target)}
              style={{ margin: 'auto' }}
              round
            >
              <Icon type="database" />
              stake
            </Button>
          );
        },
      },
    ];

    return <Table columns={columns} dataSource={swapViewData} />;
  };

  renderPoolList = () => {
    const { pools, poolData, swapData, runePrice, assetData } = this.props;
    const { activeAsset } = this.state;

    const stakeViewData = pools.reduce((result, pool) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};
      const swapInfo = swapData[symbol] || {};

      const { values: stakeCardData } = getPoolData(
        'rune',
        symbol,
        poolInfo,
        swapInfo,
        assetData,
        runePrice,
      );

      if (stakeCardData.target !== activeAsset) {
        result.push(stakeCardData);
      }

      return result;
    }, []);

    return this.renderPoolTable(stakeViewData);
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
