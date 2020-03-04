import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { isEmpty as _isEmpty } from 'lodash';

import { AxiosResponse } from 'axios';
import Binance from '../../clients/binance';
import { MIDGARD_API_URL } from '../../helpers/apiHelper';

import {
  saveWalletAddress,
  saveKeystore,
  clearWalletAddress,
  clearKeystore,
} from '../../helpers/webStorageHelper';

import { getFixedNumber } from '../../helpers/stringHelper';
import { BASE_NUMBER } from '../../settings/constants';
import * as actions from './actions';
import { AssetData, StakeData } from './types';
import {
  DefaultApi,
  StakersAddressData,
  PoolDetail,
  StakersAssetData,
} from '../../types/generated/midgard';
import { Market, Balance, Address } from '../../types/binance';
import { getAssetFromString } from '../midgard/utils';

const midgardApi = new DefaultApi({ basePath: MIDGARD_API_URL });

export function* saveWalletSaga() {
  yield takeEvery(actions.SAVE_WALLET, function*({
    payload,
  }: actions.SaveWallet) {
    const { wallet, keystore } = payload;

    saveWalletAddress(wallet);
    saveKeystore(keystore);

    yield put(actions.refreshBalance(wallet));
    yield put(actions.refreshStake(wallet));

    yield put(push('/swap'));

    // force reload the page to init websocket

    window.location.href = '/swap';
  });
}

export function* forgetWalletSaga() {
  yield takeEvery(actions.FORGET_WALLET, function*() {
    clearWalletAddress();
    clearKeystore();

    yield put(push('/connect'));
  });
}

export function* refreshBalance() {
  yield takeEvery(actions.REFRESH_BALANCE, function*({
    payload,
  }: actions.RefreshBalance) {
    const address = payload;

    try {
      const balances: Balance[] = yield call(Binance.getBalance, address);

      try {
        const markets: { result: Market[] } = yield call(Binance.getMarkets);
        const coins = balances.map((coin: Balance) => {
          const market = markets.result.find(
            (market: Market) => market.base_asset_symbol === coin.symbol,
          );
          return {
            asset: coin.symbol,
            assetValue: parseFloat(coin.free),
            price: market ? parseFloat(market.list_price) : 0,
          } as AssetData;
        });

        yield put(actions.refreshBalanceSuccess(coins));
      } catch (error) {
        yield put(actions.refreshBalanceFailed(error));
      }
    } catch (error) {
      yield put(actions.refreshBalanceFailed(error));
    }
  });
}

type StakersAssetDataMap = {
  [symbol: string]: StakersAssetData;
};

export function* getUserStakeData(payload: {
  address: Address;
  assets: string[];
}) {
  const { address, assets } = payload;

  // (Request 1) Load list of possible `StakersAssetData`
  const { data }: AxiosResponse<StakersAssetData[]> = yield call(
    { context: midgardApi, fn: midgardApi.getStakersAddressAndAssetData },
    address,
    assets.join(),
  );

  // Transform `StakersAssetData[]` into a map of `{[symbol]: StakersAssetData}` to access data it more easily
  const poolDetailMap: StakersAssetDataMap =
    data && !_isEmpty(data)
      ? data.reduce((acc: StakersAssetDataMap, assetData: StakersAssetData) => {
          const asset = assetData.asset;
          return asset
            ? {
                ...acc,
                [asset]: assetData,
              }
            : acc;
        }, {})
      : {};

  // (Request 2) Load list of possible `PoolDetail`
  const { data: poolDataList }: AxiosResponse<PoolDetail[]> = yield call(
    { context: midgardApi, fn: midgardApi.getPoolsData },
    assets.join(),
  );

  // Transform results of requests 1 + 2 into `StakeData[]`
  const stakeData: StakeData[] = poolDataList.reduce(
    (acc: StakeData[], poolData: PoolDetail) => {
      const userStakerData = poolData.asset
        ? poolDetailMap[poolData.asset]
        : null;
      if (userStakerData && poolData.asset) {
        const price = poolData?.price ?? 0;
        const { symbol = '', ticker = '' } = getAssetFromString(poolData.asset);
        const stakeData = {
          targetSymbol: symbol,
          target: ticker.toLowerCase(),
          targetValue: userStakerData.assetStaked
            ? getFixedNumber(userStakerData.assetStaked / BASE_NUMBER)
            : 0,
          assetValue: userStakerData.runeStaked
            ? getFixedNumber(userStakerData.runeStaked / BASE_NUMBER)
            : 0,
          asset: 'rune',
          price,
        } as StakeData;
        return [...acc, stakeData];
      } else {
        return acc;
      }
    },
    [],
  );

  return stakeData;
}

export function* refreshStakes() {
  yield takeEvery(actions.REFRESH_STAKES, function*({
    payload,
  }: actions.RefreshStakes) {
    const address = payload;

    try {
      const { data }: AxiosResponse<StakersAddressData> = yield call(
        { context: midgardApi, fn: midgardApi.getStakersAddressData },
        address,
      );

      if (data.poolsArray && !_isEmpty(data?.poolsArray)) {
        const result: StakeData[] = yield call(getUserStakeData, {
          address,
          assets: data?.poolsArray,
        });
        yield put(actions.refreshStakeSuccess(result));
      } else {
        yield put(actions.refreshStakeSuccess([]));
      }
    } catch (error) {
      yield put(actions.refreshStakeFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(saveWalletSaga),
    fork(forgetWalletSaga),
    fork(refreshBalance),
    fork(refreshStakes),
  ]);
}
