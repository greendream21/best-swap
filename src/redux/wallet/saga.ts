import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { get as _get } from 'lodash';

import { Method } from 'axios';
import Binance from '../../clients/binance';
import {
  getHeaders,
  axiosRequest,
  getMidgardURL,
} from '../../helpers/apiHelper';

import {
  saveWalletAddress,
  saveKeystore,
  clearWalletAddress,
  clearKeystore,
} from '../../helpers/webStorageHelper';

import { getFixedNumber } from '../../helpers/stringHelper';
import { BASE_NUMBER } from '../../settings/constants';
import * as actions from './actions';
import { GetUserStakeDataResult } from './types';
import { Market, Balance, Address, StakePool } from '../../types/binance';

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
      const response = yield call(Binance.getBalances, address);

      try {
        const markets: { result: Market[] } = yield call(Binance.getMarkets);
        const coins = response.map((coin: Balance) => {
          const market = markets.result.find(
            (market: Market) => market.base_asset_symbol === coin.symbol,
          );
          return {
            asset: coin.symbol,
            assetValue: parseFloat(coin.free),
            price: market ? parseFloat(market.list_price) : 0,
          };
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

const getStakerAssets = async (address: Address) => {
  const params = {
    // method: 'link',
    url: getMidgardURL(`stakers/${address}`),
    headers: getHeaders(),
  };

  try {
    const data = await axiosRequest(params);
    return data || [];
  } catch (error) {
    return null;
  }
};

const getPoolData = async (assetId: string) => {
  const params = {
    method: 'get' as Method,
    url: getMidgardURL(`pools/${assetId}`),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);

    return data;
  } catch (error) {
    console.error('get pool data from midgard error');
    return null;
  }
};

export function* getUserStakeData() {
  yield takeEvery(actions.GET_USER_STAKE_DATA_REQUEST, function*({
    payload,
  }: actions.GetUserStakeDataRequest) {
    const { address, asset } = payload;
    const { chain, symbol, ticker } = asset;
    const assetId = `${chain}.${symbol}`;

    const params = {
      method: 'get' as Method,
      url: getMidgardURL(`stakers/${address}/${assetId}`),
      headers: getHeaders(),
    };

    try {
      const { data: userStakerData } = yield call(axiosRequest, params);
      const poolData = yield call(getPoolData, assetId);
      const price = _get(poolData, 'price', 0);

      const data = {
        targetSymbol: symbol,
        target: ticker.toLowerCase(),
        targetValue: getFixedNumber(userStakerData.assetStaked / BASE_NUMBER),
        assetValue: getFixedNumber(userStakerData.runeStaked / BASE_NUMBER),
        asset: 'rune',
        price,
      } as GetUserStakeDataResult;

      yield put(actions.getUserStakeDataSuccess(data));
    } catch (error) {
      yield put(actions.getUserStakeDataFailed(error));
    }
  });
}

export function* refreshStakes() {
  yield takeEvery(actions.REFRESH_STAKES, function*({
    payload,
  }: actions.RefreshStakes) {
    const address = payload;

    try {
      const { data: stakerData } = yield call(getStakerAssets, address);
      const stakerPools = _get(stakerData, 'poolsArray');
      const stakeData = yield all(
        stakerPools.map((poolData: StakePool) => {
          return put(
            actions.getUserStakeData({
              address,
              asset: poolData,
            } as actions.GetUserStakeDataRequestPayload),
          );
        }),
      );

      yield put(actions.refreshStakeSuccess(stakeData));
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
    fork(getUserStakeData),
  ]);
}
