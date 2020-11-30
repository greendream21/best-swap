import React from 'react';

import { connect } from 'react-redux';
import { withRouter, Link, useHistory } from 'react-router-dom';

import * as RD from '@devexperts/remote-data-ts';
import { sortBy as _sortBy } from 'lodash';
import { compose } from 'redux';


import Button from 'components/uielements/button';
import CoinList from 'components/uielements/coins/coinList';
import { CoinListDataList } from 'components/uielements/coins/coinList/coinList';
import Label from 'components/uielements/label';
import Tabs from 'components/uielements/tabs';

import { RootState } from 'redux/store';
import {
  User,
  AssetData,
  StakeDataListLoadingState,
} from 'redux/wallet/types';

import {
  matchSwapDetailPair,
  matchPoolSymbol,
} from 'helpers/routerHelper';

import { RUNE_SYMBOL } from 'settings/assetData';

import { Maybe } from 'types/bepswap';

import { Loader } from './loader';
import { WalletViewWrapper } from './WalletView.style';

const { TabPane } = Tabs;

type ComponentProps = {
  status: string;
};

type ConnectedProps = {
  user: Maybe<User>;
  assetData: AssetData[];
  stakeData: StakeDataListLoadingState;
  loadingAssets: boolean;
  pathname: string;
};

type Props = ComponentProps & ConnectedProps;
type State = Record<string, never>;

const WalletView: React.FC<Props> = (props: Props): JSX.Element => {
  const { user, assetData, stakeData, loadingAssets, pathname, status } = props;

  const history = useHistory();

  const getAssetNameByIndex = (index: number): string => {
    const sortedAssets = _sortBy(assetData, ['asset']);

    return sortedAssets[index].asset || '';
  };

  const getAssetBySource = (source: string): Maybe<AssetData> => {
    const result = assetData.find((data: AssetData) => {
      return data.asset === source && source;
    });
    return result;
  };

  const getStakeDataBySource = (symbol: string): Maybe<AssetData> => {
    const sd = RD.toNullable(stakeData);
    return sd && sd.find((data: AssetData) => symbol === data.asset);
  };

  const handleSelectAsset = (key: number) => {
    const newAssetName = getAssetNameByIndex(key);

    let URL = `/swap/${newAssetName}:${RUNE_SYMBOL}`;
    if (newAssetName === RUNE_SYMBOL) {
      URL = '/pools';
    }
    history.push(URL);
  };

  const handleSelectStake = (index: number, stakeData: AssetData[]) => {
    const selected = stakeData[index];
    const { asset } = selected;

    const URL = `/pool/${asset}`;
    history.push(URL);
  };

  const getSelectedAsset = (): AssetData[] => {
    const symbolPair = matchSwapDetailPair(pathname);
    const asset = getAssetBySource(symbolPair?.source ?? '');

    return asset ? [asset] : [];
  };

  const getSelectedStake = (): AssetData[] => {
    const symbol = matchPoolSymbol(pathname);
    const stake = getStakeDataBySource(symbol || '');
    return stake ? [stake] : [];
  };

  const renderAssetTitle = () => {
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

  const renderPoolShareTitle = (stakeData: StakeDataListLoadingState) =>
    RD.fold(
      () => <></>, // initial data
      () => <Loader />, // loading
      (error: Error) => <>{error.toString()}</>, // error
      (data: AssetData[]): JSX.Element =>
        data.length > 0 ? (
          <>Liquidity Pool Shares:</>
        ) : (
          <>You currently do not have any liquidity</>
        ),
    )(stakeData);

  const hasWallet = user && user.wallet;
  const selectedAsset = getSelectedAsset();
  const selectedStake = getSelectedStake();
  const sortedAssets = _sortBy(assetData, ['asset']);
  const stakeDataForSorting = RD.toNullable(stakeData);
  const sortedStakerData = stakeDataForSorting
    ? _sortBy(stakeDataForSorting, ['target'])
    : null;

  return (
    <WalletViewWrapper data-test="wallet-view">
      <Tabs data-test="wallet-view-tabs" defaultActiveKey="assets" withBorder>
        <TabPane tab="assets" key="assets">
          <Label className="asset-title-label" weight="600">
            {renderAssetTitle()}
          </Label>
          {!hasWallet && (
            <Link to="/connect">
              <Button color="success">CONNECT</Button>
            </Link>
          )}
          {!loadingAssets && (
            <CoinList
              data={sortedAssets}
              selected={selectedAsset as CoinListDataList}
              onSelect={handleSelectAsset}
              type="wallet"
            />
          )}
        </TabPane>
        <TabPane tab="pool shares" key="pool shares">
          <Label className="asset-title-label">
            {renderPoolShareTitle(stakeData)}
          </Label>
          {sortedStakerData && (
            <CoinList
              data={sortedStakerData}
              selected={selectedStake as CoinListDataList}
              onSelect={(key: number) => {
                handleSelectStake(key, sortedStakerData);
              }}
            />
          )}
        </TabPane>
      </Tabs>
    </WalletViewWrapper>
  );
};

export default compose(
  connect((state: RootState) => ({
    user: state.Wallet.user,
    assetData: state.Wallet.assetData,
    stakeData: state.Wallet.stakeData,
    loadingAssets: state.Wallet.loadingAssets,
    pathname: state.router.location.pathname,
  })),
  withRouter,
)(WalletView) as React.ComponentClass<ComponentProps, State>;
