import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link, useHistory } from 'react-router-dom';
import { sortBy as _sortBy } from 'lodash';

import * as RD from '@devexperts/remote-data-ts';
import { WalletViewWrapper } from './WalletView.style';
import { Loader } from './loader';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';
import { CoinListDataList } from '../../components/uielements/coins/coinList/coinList';
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
import {
  matchSwapDetailPair,
  matchPoolSymbol,
} from '../../helpers/routerHelper';

const { TabPane } = Tabs;

type ComponentProps = {
  status: string;
};

type ConnectedProps = {
  user: Maybe<User>;
  assetData: AssetData[];
  stakeData: StakeDataListLoadingState;
  loadingAssets: boolean;
  getPools: typeof midgardActions.getPools;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  pathname: string;
};

type Props = ComponentProps & ConnectedProps;
type State = {}

const WalletView: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    user,
    assetData,
    stakeData,
    loadingAssets,
    priceIndex,
    basePriceAsset,
    pathname,
    status,
    getPools,
  } = props;

  const history = useHistory();


  useEffect(() => {
    getPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAssetNameByIndex = (index: number): string => {
    const sortedAssets = _sortBy(assetData, ['asset']);

    return sortedAssets[index].asset || '';
  };

  const getAssetBySource = (source: string): Maybe<AssetData> => {
    const result = assetData.find((data: AssetData) => {
      const { source: assetSource } = getPair(data.asset);
      return assetSource && assetSource === source;
    });
    return result || Nothing;
  };

  const getStakeDataBySource = (symbol: string): Maybe<StakeData> => {
    const sd = RD.toNullable(stakeData);
    return sd && sd.find((data: StakeData) => symbol === data.targetSymbol);
  };

  const handleSelectAsset = (key: number) => {
    const newAssetName = getAssetNameByIndex(key);
    const ticker = getTickerFormat(newAssetName);

    const URL = `/swap/${ticker}-rune`;
    history.push(URL);
  };

  const handleSelectStake = (index: number, stakeData: StakeData[]) => {
    const selected = stakeData[index];
    const target = selected.targetSymbol;

    const URL = `/pool/${target}`;
    history.push(URL);
  };

  const getSelectedAsset = (): AssetData[] => {
    const pair = matchSwapDetailPair(pathname);
    const asset = getAssetBySource(pair?.source ?? '');
    return asset ? [asset] : [];
  };

  const getSelectedStake = (): StakeData[] => {
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

  const renderStakeTitle = (stakeData: StakeDataListLoadingState) =>
    RD.fold(
      () => <></>, // initial data
      () => <Loader />, // loading
      (error: Error) => <>{error.toString()}</>, // error
      (data: StakeData[]): JSX.Element =>
        data.length > 0 ? (
          <>Your current stakes are:</>
        ) : (
          <>You are currently not staked in any pool</>
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
              data-test="wallet-asset-list"
              data={sortedAssets}
              selected={selectedAsset as CoinListDataList}
              priceIndex={priceIndex}
              onSelect={handleSelectAsset}
              unit={basePriceAsset}
              type="wallet"
            />
          )}
        </TabPane>
        <TabPane tab="stakes" key="stakes">
          <Label className="asset-title-label">
            {renderStakeTitle(stakeData)}
          </Label>
          {sortedStakerData && (
            <CoinList
              data-test="wallet-stakes-list"
              data={sortedStakerData}
              priceIndex={priceIndex}
              selected={selectedStake as CoinListDataList}
              onSelect={(key: number) =>
                handleSelectStake(key, sortedStakerData)}
              unit={basePriceAsset}
            />
          )}
        </TabPane>
      </Tabs>
    </WalletViewWrapper>
  );
};

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
