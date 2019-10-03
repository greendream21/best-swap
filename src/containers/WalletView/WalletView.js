import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sortBy as _sortBy } from 'lodash';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';
import chainActions from '../../redux/chainservice/actions';
import walletActions from '../../redux/wallet/actions';
import { getPair } from '../../helpers/stringHelper';

const { getTokens } = chainActions;
const { getRunePrice } = walletActions;

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
    loadingAssets: PropTypes.bool.isRequired,
    loadingStakes: PropTypes.bool.isRequired,
    setAssetData: PropTypes.func.isRequired,
    setStakeData: PropTypes.func.isRequired,
    getTokens: PropTypes.func.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    chainData: PropTypes.object.isRequired,
    runePrice: PropTypes.object,
  };

  static defaultProps = {
    page: '',
    view: '',
    info: '',
    status: '',
  };

  componentDidMount() {
    const { getTokens, getRunePrice } = this.props;
    getTokens();
    getRunePrice();
  }

  getAssetNameByIndex = index => {
    const { assetData } = this.props;
    const sortedAssets = _sortBy(assetData, ['asset']);

    return sortedAssets[index].asset || '';
  };

  getAssetIndexByName = asset => {
    const { assetData } = this.props;

    return assetData.find(data => data.asset === asset);
  };

  handleChangeTab = (/* tag */) => {};

  handleConnect = () => {
    this.props.history.push('/connect');
  };

  handleSelectAsset = key => {
    const newAssetName = this.getAssetNameByIndex(key);
    const ticker = newAssetName.split('-')[0].toLowerCase();

    const URL = `/swap/detail/${ticker}-rune`;
    this.props.history.push(URL);
  };

  handleSelectStake = (/* key */) => {};

  renderAssetTitle = () => {
    const { status, loadingAssets, assetData } = this.props;

    if (loadingAssets) {
      return 'Loading...';
    }

    if (status === 'connected' && assetData.length === 0) {
      return "Looks like you don't have anything in your wallet"; // eslint-disable-line quotes
    }

    if (status === 'connected') {
      return 'Tokens in your wallet:';
    }
    return 'Connect your wallet';
  };

  renderStakeTitle = () => {
    const { stakeData, loadingStakes } = this.props;

    if (loadingStakes) {
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
      chainData: { tokenInfo },
      runePrice,
      loadingAssets,
      loadingStakes,
    } = this.props;
    const pair = getPair(info);
    const { source } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);
    const sortedAssets = _sortBy(assetData, ['asset']);

    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label className="asset-title-label" weight="bold">
              {this.renderAssetTitle()}
            </Label>
            {!wallet && (
              <Button onClick={this.handleConnect} color="success">
                connect
              </Button>
            )}
            {!loadingAssets && (
              <CoinList
                data={sortedAssets}
                value={sourceIndex}
                selected={selectedAsset}
                tokenInfo={tokenInfo}
                runePrice={runePrice}
                onSelect={this.handleSelectAsset}
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle()}
            </Label>
            {!loadingStakes && (
              <CoinList
                data={stakeData}
                value={sourceIndex}
                runePrice={runePrice}
                tokenInfo={tokenInfo}
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
      loadingAssets: state.Wallet.loadingAssets,
      loadingStakes: state.Wallet.loadingStakes,
      chainData: state.ChainService,
      runePrice: state.Wallet.runePrice,
    }),
    {
      getTokens,
      getRunePrice,
    },
  ),
  withRouter,
)(WalletView);
