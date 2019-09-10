import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';

import Binance from '../../clients/binance';
import ChainService from '../../clients/chainservice';
import { getPair } from '../../helpers/stringHelper';

import walletActions from '../../redux/wallet/actions';

const { setAssetData, setStakeData } = walletActions;

const { TabPane } = Tabs;

class WalletView extends Component {
  static propTypes = {
    user: PropTypes.object,
    page: PropTypes.string,
    view: PropTypes.string,
    info: PropTypes.string,
    status: PropTypes.string,
    assetData: PropTypes.array.isRequired,
    stakeData: PropTypes.array.isRequired,
    setAssetData: PropTypes.func.isRequired,
    setStakeData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    page: '',
    view: '',
    info: '',
    status: '',
  };

  state = {
    loadingAssets: true,
    loadingStakes: false,
  };

  componentDidMount() {
    const { user } = this.props;

    if (user) {
      const { wallet } = user;
      this.refreshBalance(wallet);
    }
  }

  refreshBalance = addr => {
    const { setAssetData } = this.props;

    Binance.getBalances(addr)
      .then(response => {
        Binance.getMarkets()
          .then(markets => {
            const coins = response.map(coin => {
              const market = markets.result.find(
                market => market.base_asset_symbol === coin.symbol,
              );
              return {
                asset: coin.symbol,
                assetValue: parseFloat(coin.free),
                price: market ? parseFloat(market.list_price) : 0,
              };
            });
            setAssetData(coins);
            this.setState({ loadingAssets: false });
          })
          .catch(error => {
            this.setState({ loadingAssets: false });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({ loadingAssets: false });
        console.error(error);
      });
  };

  refreshStakes = addr => {
    const { setStakeData } = this.props;

    Binance.getMarkets()
      .then(markets => {
        ChainService.stakerData(addr)
          .then(async response => {
            const stakeData = await Promise.all(
              response.data.map(async ticker => {
                let info = await ChainService.stakerData(addr, ticker)
                  .then(response => {
                    const market = markets.result.find(
                      market => market.base_asset_symbol === ticker,
                    );

                    return {
                      target: ticker.toLowerCase(),
                      targetValue: response.data.tokensStaked,
                      assetValue: response.data.runeStaked,
                      asset: 'rune',
                      price: market ? parseFloat(market.list_price) : 0,
                    };
                  })
                  .catch(error => {
                    console.error(error);
                    return { target: ticker, asset: 'rune' };
                  });
                return info;
              }),
            );
            setStakeData(stakeData);
            this.setState({ loadingStakes: false });
          })
          .catch(error => {
            this.setState({ loadingStakes: false });
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getAssetNameByIndex = index => {
    const { assetData } = this.props;

    return assetData[index].asset || '';
  };

  getAssetIndexByName = asset => {
    const { assetData } = this.props;

    return assetData.find(data => data.asset === asset);
  };

  handleChangeTab = tag => {
    const { user } = this.props;

    if (user) {
      const { wallet } = user;

      if (tag === 'assets') {
        this.refreshBalance(wallet);
      } else if (tag === 'stakes') {
        this.refreshBalance(wallet);
      }
    }
  };

  handleConnect = () => {
    this.props.history.push('/connect');
  };

  handleSelectAsset = key => {
    const { page, view, info } = this.props;

    if (!info) return;

    const pair = getPair(info);
    const { source } = pair;
    const newAssetName = this.getAssetNameByIndex(key);

    const URL = `/${page}/${view}/${source}-${newAssetName}`;

    this.props.history.push(URL);
  };

  handleSelectStake = key => {};

  renderAssetTitle = () => {
    const { status } = this.props;

    if (this.state.loadingAssets) {
      return 'Loading...';
    }

    if (status === 'connected') {
      return 'Tokens in your wallet:';
    }
    return 'Connect your wallet';
  };

  renderStakeTitle = () => {
    const { stakeData } = this.props;

    if (this.state.loadingStakes) {
      return 'Loading...';
    }

    if (stakeData.length > 0) {
      return 'Your current stakes are:';
    }
    return 'You are currently not staked in any pool';
  };

  getSelectedAsset = pair => {
    const { page } = this.props;

    if (page === 'pool' || page === 'trade') {
      const { target } = pair;
      const targetIndex = this.getAssetIndexByName(target);

      return [targetIndex];
    }
    return [];
  };

  render() {
    const {
      info,
      user: { wallet },
      assetData,
      stakeData,
    } = this.props;
    const pair = getPair(info);
    const { source } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);

    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label className="asset-title-label">
              {this.renderAssetTitle()}
            </Label>
            {!wallet && (
              <Button onClick={this.handleConnect} color="success">
                connect
              </Button>
            )}
            {!this.state.loadingAssets && (
              <CoinList
                data={assetData}
                value={sourceIndex}
                selected={selectedAsset}
                onSelect={this.handleSelectAsset}
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle()}
            </Label>
            {!this.state.loadingStakes && (
              <CoinList
                data={stakeData}
                value={sourceIndex}
                onSelect={this.handleSelectStake}
              />
            )}
          </TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      stakeData: state.Wallet.stakeData,
    }),
    {
      setAssetData,
      setStakeData,
    },
  ),
  withRouter,
)(WalletView);
