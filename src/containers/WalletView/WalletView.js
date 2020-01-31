import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sortBy as _sortBy } from 'lodash';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';
import midgardActions from '../../redux/midgard/actions';
import { getPair, getTickerFormat } from '../../helpers/stringHelper';
import {
  AssetLoader,
  StakeLoader,
} from '../../components/utility/loaders/wallet';

const { getPools } = midgardActions;

const { TabPane } = Tabs;

class WalletView extends Component {
  componentDidMount() {
    const { getPools } = this.props;

    getPools();
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

  handleSelectAsset = key => {
    const newAssetName = this.getAssetNameByIndex(key);
    const ticker = getTickerFormat(newAssetName);

    const URL = `/swap/detail/${ticker}-rune`;
    this.props.history.push(URL);
  };

  handleSelectStake = key => {
    const { stakeData } = this.props;

    const selected = stakeData[key];
    const target = selected.targetSymbol;

    const URL = `/pool/${target}`;
    this.props.history.push(URL);
  };

  renderAssetTitle = () => {
    const { status, loadingAssets, assetData } = this.props;

    if (loadingAssets) {
      return <AssetLoader />;
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
      return <StakeLoader />;
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
      user,
      assetData,
      stakeData,
      priceIndex,
      basePriceAsset,
      loadingAssets,
      loadingStakes,
    } = this.props;
    const hasWallet = user && user.wallet;
    const pair = getPair(info);
    const { source } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);
    const sortedAssets = _sortBy(assetData, ['asset']);
    const sortedStakerData = _sortBy(stakeData, ['target']);

    return (
      <WalletViewWrapper data-test="wallet-view">
        <Tabs
          data-test="wallet-view-tabs"
          defaultActiveKey="assets"
          onChange={this.handleChangeTab}
          withBorder
        >
          <TabPane tab="assets" key="assets">
            <Label className="asset-title-label" weight="600">
              {this.renderAssetTitle()}
            </Label>
            {!hasWallet && (
              <Link to="/connect">
                <Button color="success">CONNECT</Button>
              </Link>
            )}
            {!loadingAssets && (
              <CoinList
                data-test="wallet-asset-list"
                data={sortedAssets}
                value={sourceIndex}
                selected={selectedAsset}
                priceIndex={priceIndex}
                onSelect={this.handleSelectAsset}
                unit={basePriceAsset}
                type="wallet"
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle()}
            </Label>
            {!loadingStakes && (
              <CoinList
                data-test="wallet-stakes-list"
                data={sortedStakerData}
                priceIndex={priceIndex}
                onSelect={this.handleSelectStake}
                unit={basePriceAsset}
                isStakeData
              />
            )}
          </TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

WalletView.propTypes = {
  user: PropTypes.object, // Maybe<User>
  page: PropTypes.string,
  view: PropTypes.string,
  info: PropTypes.string,
  status: PropTypes.string,
  assetData: PropTypes.array.isRequired,
  stakeData: PropTypes.array.isRequired,
  loadingAssets: PropTypes.bool.isRequired,
  loadingStakes: PropTypes.bool.isRequired,
  getPools: PropTypes.func.isRequired,
  priceIndex: PropTypes.object.isRequired,
  basePriceAsset: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

WalletView.defaultProps = {
  page: '',
  view: '',
  info: '',
  status: '',
};

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      stakeData: state.Wallet.stakeData,
      loadingAssets: state.Wallet.loadingAssets,
      loadingStakes: state.Wallet.loadingStakes,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
    }),
    {
      getPools,
    },
  ),
  withRouter,
)(WalletView);
