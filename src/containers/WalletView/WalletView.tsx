import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { sortBy as _sortBy } from 'lodash';

import * as RD from '@devexperts/remote-data-ts';
import { WalletViewWrapper } from './WalletView.style';
import { Loader } from './loader';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from  '../../components/uielements/coins/coinList';
import { CoinListDataList } from  '../../components/uielements/coins/coinList/coinList';
import * as midgardActions from '../../redux/midgard/actions';
import { getTickerFormat, getPair } from '../../helpers/stringHelper';
import { Maybe, Nothing } from '../../types/bepswap';
import {
  User,
  AssetData,
  StakeData,
  StakeDataListLoadingState,
} from '../../redux/wallet/types';
import { RootState } from '../../redux/store';
import { PriceDataIndex } from '../../redux/midgard/types';
import { matchSwapDetailPair, matchPoolSymbol } from '../../helpers/routerHelper';

const { TabPane } = Tabs;

type ComponentProps = {
  status?: string;
  view?: string;
};

type ConnectedProps = {
  user: Maybe<User>;
  assetData: AssetData[];
  stakeData: StakeDataListLoadingState;
  loadingAssets: boolean;
  getPools: typeof midgardActions.getPools;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  history: H.History;
  pathname: string;
};

type Props = ComponentProps & ConnectedProps;

type State = {};

class WalletView extends React.Component<Props, State> {
  static readonly defaultProps: Partial<Props> = {
    view: '',
    status: '',
  };

  componentDidMount() {
    const { getPools } = this.props;
    getPools();
  }

  getAssetNameByIndex = (index: number): string => {
    const { assetData } = this.props;
    const sortedAssets = _sortBy(assetData, ['asset']);

    return sortedAssets[index].asset || '';
  };

  getAssetBySource = (source: string): Maybe<AssetData> => {
    const { assetData } = this.props;
    const result = assetData.find((data: AssetData) => {
      const { source: assetSource } = getPair(data.asset);
      return assetSource && (assetSource === source);
    });
    return result || Nothing;
  };

  getStakeDataBySource = (symbol: string): Maybe<StakeData> => {
    const { stakeData } = this.props;
    const sd = RD.toNullable(stakeData);
    return sd && sd.find((data: StakeData) => symbol === data.targetSymbol);
  };

  handleSelectAsset = (key: number) => {
    const newAssetName = this.getAssetNameByIndex(key);
    const ticker = getTickerFormat(newAssetName);

    const URL = `/swap/${ticker}-rune`;
    this.props.history.push(URL);
  };

  handleSelectStake = (index: number, stakeData: StakeData[]) => {
    const selected = stakeData[index];
    const target = selected.targetSymbol;

    const URL = `/pool/${target}`;
    this.props.history.push(URL);
  };

  renderAssetTitle = () => {
    const { status, loadingAssets, assetData } = this.props;

    if (loadingAssets) {
      return <Loader />;
    }

    if (status === 'connected' && assetData.length === 0) {
      return 'Looks like you don\'t have anything in your wallet';
    }

    if (status === 'connected') {
      return 'Tokens in your wallet:';
    }
    return 'Connect your wallet';
  };

  renderStakeTitle = (stakeData: StakeDataListLoadingState) =>
    RD.fold(
      () => null, // initial data
      () => <Loader />, // loading
      (error: Error) => <>{error.toString()}</>, // error
      (data: StakeData[]): JSX.Element =>
        data.length > 0 ? (
          <>Your current stakes are:</>
        ) : (
          <>You are currently not staked in any pool</>
        ),
    )(stakeData);

  getSelectedAsset = (): AssetData[] => {
    const { pathname } = this.props;
    const pair = matchSwapDetailPair(pathname);
    const asset = this.getAssetBySource(pair?.source ?? '');
    return asset ? [asset] : [];
  };

  getSelectedStake = (): StakeData[] => {
    const { pathname } = this.props;
    const symbol = matchPoolSymbol(pathname);
    const stake = this.getStakeDataBySource(symbol || '');
    return stake ? [stake] : [];
  };

  render() {
    const {
      user,
      assetData,
      stakeData,
      priceIndex,
      basePriceAsset,
      loadingAssets,
    } = this.props;
    const hasWallet = user && user.wallet;
    const selectedAsset = this.getSelectedAsset();
    const selectedStake = this.getSelectedStake();
    const sortedAssets = _sortBy(assetData, ['asset']);
    const stakeDataForSorting = RD.toNullable(stakeData);
    const sortedStakerData = stakeDataForSorting ? _sortBy(stakeDataForSorting, ['target']) : null;

    return (
      <WalletViewWrapper data-test="wallet-view">
        <Tabs data-test="wallet-view-tabs" defaultActiveKey="assets" withBorder>
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
                selected={selectedAsset as CoinListDataList}
                priceIndex={priceIndex}
                onSelect={this.handleSelectAsset}
                unit={basePriceAsset}
                type="wallet"
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle(stakeData)}
            </Label>
            {sortedStakerData && (
              <CoinList
                data-test="wallet-stakes-list"
                data={sortedStakerData}
                priceIndex={priceIndex}
                selected={selectedStake as CoinListDataList}
                onSelect={(key: number) =>
                  this.handleSelectStake(key, sortedStakerData)}
                unit={basePriceAsset}
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
    (state: RootState) => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      stakeData: state.Wallet.stakeData,
      loadingAssets: state.Wallet.loadingAssets,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      pathname: state.router.location.pathname,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(WalletView) as React.ComponentClass<ComponentProps, State>;
