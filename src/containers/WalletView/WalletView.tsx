import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { sortBy as _sortBy } from 'lodash';

import * as RD from '@devexperts/remote-data-ts';
import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';
import * as midgardActions from '../../redux/midgard/actions';
import { getPair, getTickerFormat } from '../../helpers/stringHelper';
import {
  AssetLoader,
  StakeLoader,
} from '../../components/utility/loaders/wallet';
import { Maybe } from '../../types/bepswap';
import { User, AssetData, StakeData, StakeDataListLoadingState } from '../../redux/wallet/types';
import { RootState } from '../../redux/store';
import { PriceDataIndex } from '../../redux/midgard/types';

const { TabPane } = Tabs;

type ComponentProps = {
  status?: string;
  page?: string;
  view?: string;
  info?: string;
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
};

type Props = ComponentProps & ConnectedProps;

type State = {};

// TODO(Veado): Pair type should go into `stringHelper` (<- needs to be migrated to TS before)
type Pair = { source?: string; target?: string };

class WalletView extends React.Component<Props, State> {
  static readonly defaultProps: Partial<Props> = {
    page: '',
    view: '',
    info: '',
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

  getAssetIndexByName = (asset: string) => {
    const { assetData } = this.props;

    return assetData.find(data => data.asset === asset);
  };

  handleSelectAsset = (key: number) => {
    const newAssetName = this.getAssetNameByIndex(key);
    const ticker = getTickerFormat(newAssetName);

    const URL = `/swap/detail/${ticker}-rune`;
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
      return <AssetLoader />;
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
      () => <StakeLoader />, // loading
      () => <></>, // error
      (data: StakeData[]): JSX.Element =>
        data.length > 0 ? (
          <>Your current stakes are:</>
        ) : (
          <>You are currently not staked in any pool</>
        ),
    )(stakeData);

  getSelectedAsset = (pair: Pair) => {
    const { page } = this.props;

    if (page === 'pool' || page === 'trade') {
      const { target = '' } = pair;
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
    } = this.props;
    const hasWallet = user && user.wallet;
    const pair: Pair = getPair(info);
    const { source = '' } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);
    const sortedAssets = _sortBy(assetData, ['asset']);
    const stakeDataForSorting = RD.toNullable(stakeData);
    const sortedStakerData = _sortBy(stakeDataForSorting, ['target']);

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
              {this.renderStakeTitle(stakeData)}
            </Label>
            {sortedStakerData && (
              <CoinList
                data-test="wallet-stakes-list"
                data={sortedStakerData}
                priceIndex={priceIndex}
                onSelect={(key: number) =>
                  this.handleSelectStake(key, sortedStakerData)}
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

export default compose(
  connect(
    (state: RootState) => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      stakeData: state.Wallet.stakeData,
      loadingAssets: state.Wallet.loadingAssets,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(WalletView) as React.ComponentClass<ComponentProps, State>;
