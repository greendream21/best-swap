import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

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
      const balances: Balance[] = yield call(Binance.getBalances, address);

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

export function* getUserStakeData(payload: {
  address: Address;
  asset: string;
}) {
  const { address, asset } = payload;
  const { symbol = '', ticker = '' } = getAssetFromString(asset);
  const { data: userStakerData }: AxiosResponse<StakersAssetData> = yield call(
    { context: midgardApi, fn: midgardApi.getStakersAddressAndAssetData },
    address,
    asset,
  );
  const { data: poolData }: AxiosResponse<PoolDetail> = yield call(
    { context: midgardApi, fn: midgardApi.getPoolsData },
    asset,
  );
  const price = poolData?.price ?? 0;

  const stakeData: StakeData = {
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
  };

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

      const stakerPools = data.poolsArray || [];
      const result: StakeData[] = yield all(
        stakerPools.map((pool: string) => {
          const payload = {
            address,
            asset: pool,
          };
          return call(getUserStakeData, payload);
        }),
      );

      yield put(actions.refreshStakeSuccess(result));
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
