import React, { useCallback } from 'react';

import { connect } from 'react-redux';
import { withRouter, Link, useHistory } from 'react-router-dom';

import { LinkOutlined } from '@ant-design/icons';
import * as RD from '@devexperts/remote-data-ts';
import { sortBy as _sortBy } from 'lodash';
import { compose } from 'redux';

import { getAssetFromString } from 'redux/midgard/utils';
import { RootState } from 'redux/store';
import { User, AssetData, StakeDataListLoadingState } from 'redux/wallet/types';

import {
  matchSwapDetailPair,
  matchAddLiquiditySymbol,
  getRuneStakeURL,
} from 'helpers/routerHelper';

import { RUNE_SYMBOL } from 'settings/assetData';

import { Maybe } from 'types/bepswap';

import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';
import { CoinListDataList } from '../../components/uielements/coins/coinList/coinList';
import Label from '../../components/uielements/label';
import Tabs from '../../components/uielements/tabs';
import { Loader } from './loader';
import { WalletViewWrapper, RuneStakeView } from './WalletView.style';

const { TabPane } = Tabs;

type ComponentProps = {
  status: string;
  onClose: () => void;
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
  const {
    user,
    assetData,
    stakeData,
    loadingAssets,
    pathname,
    status,
    onClose,
  } = props;

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

  const handleSwap = useCallback(
    (asset: string) => {
      const { symbol } = getAssetFromString(asset);

      if (symbol === RUNE_SYMBOL) {
        history.push('/pools');
      } else {
        history.push(`/swap/${symbol}:${RUNE_SYMBOL}`);
      }

      onClose();
    },
    [history, onClose],
  );

  const handleSend = useCallback(
    (asset: string) => {
      const { symbol } = getAssetFromString(asset);
      history.push(`/send/${symbol}`);

      onClose();
    },
    [history, onClose],
  );

  const handleSelectAsset = (key: number) => {
    const newAssetName = getAssetNameByIndex(key);

    if (newAssetName === RUNE_SYMBOL) {
      history.push('/pools');
    } else {
      history.push(`/swap/${newAssetName}:${RUNE_SYMBOL}`);
    }

    onClose();
  };

  const handleSelectStake = (index: number, stakeData: AssetData[]) => {
    const selected = stakeData[index];
    const { asset } = selected;

    const URL = `/liquidity/${asset}`;
    history.push(URL);

    onClose();
  };

  const getSelectedAsset = (): AssetData[] => {
    const symbolPair = matchSwapDetailPair(pathname);
    const asset = getAssetBySource(symbolPair?.target ?? '');

    return asset ? [asset] : [];
  };

  const getSelectedStake = (): AssetData[] => {
    const symbol = matchAddLiquiditySymbol(pathname);
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
          <>
            <RuneStakeView>
              <a
                href={getRuneStakeURL(user?.wallet)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Label>View on RuneStake.Info</Label>
                <LinkOutlined />
              </a>
            </RuneStakeView>
            <Label>Liquidity Pool Shares:</Label>
          </>
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
              onSend={handleSend}
              onSwap={handleSwap}
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
