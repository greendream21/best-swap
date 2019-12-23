import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { get as _get } from 'lodash';

import actions from './actions';
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
  saveBasePriceAsset,
} from '../../helpers/webStorageHelper';
import { getFixedNumber } from '../../helpers/stringHelper';
import { BASE_NUMBER } from '../../settings/constants';

export function* saveWalletSaga() {
  yield takeEvery(actions.SAVE_WALLET, function*({ payload }) {
    const { wallet, keystore } = payload;

    saveWalletAddress(wallet);
    saveKeystore(keystore);

    yield put(actions.refreshBalance(wallet));
    yield put(actions.refreshStake(wallet));

    yield put(push('/swap'));
  });
}

export function* forgetWalletSaga() {
  yield takeEvery(actions.FORGET_WALLET, function*(/* { payload } */) {
    clearWalletAddress();
    clearKeystore();

    yield put(push('/connect'));
  });
}

export function* setBasePriceAsset() {
  yield takeEvery(actions.SET_BASE_PRICE_ASSET, function*({ payload }) {
    yield call(saveBasePriceAsset, payload);
  });
}

export function* refreshBalance() {
  yield takeEvery(actions.REFRESH_BALANCE, function*({ payload }) {
    const address = payload;

    try {
      const response = yield call(Binance.getBalances, address);

      try {
        const markets = yield call(Binance.getMarkets);
        const coins = response.map(coin => {
          const market = markets.result.find(
            market => market.base_asset_symbol === coin.symbol,
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

const getStakerAssets = async address => {
  const params = {
    method: 'get',
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

const getPoolData = async assetId => {
  const params = {
    method: 'get',
    url: getMidgardURL(`pools/${assetId}`),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);

    return data;
  } catch (error) {
    console.log('get pool data from midgard error');
    return null;
  }
};

export function* getUserStakeData() {
  yield takeEvery(actions.GET_USER_STAKE_DATA_REQUEST, function*({ payload }) {
    const { address, asset } = payload;
    const { chain, symbol, ticker } = asset;
    const assetId = `${chain}.${symbol}`;

    const params = {
      method: 'get',
      url: getMidgardURL(`stakers?${address}/${assetId}`),
      headers: getHeaders(),
    };
    console.log('getUserStakeData Param: ', params);

    try {
      const { data: userStakerData } = yield call(axiosRequest, params);
      const poolData = yield call(getPoolData, assetId);
      const price = _get(poolData, 'price', 0);

      const data = {
        target: ticker.toLowerCase(),
        targetValue: getFixedNumber(userStakerData.assetStaked / BASE_NUMBER),
        assetValue: getFixedNumber(userStakerData.runeStaked / BASE_NUMBER),
        asset: 'rune',
        price,
      };

      yield put(actions.getUserStakeDataSuccess(data));
    } catch (error) {
      yield put(actions.getUserStakeDataFailed(error));
    }
  });
}

export function* refreshStakes() {
  yield takeEvery(actions.REFRESH_STAKES, function*({ payload }) {
    const address = payload;

    try {
      const { data: stakerData } = yield call(getStakerAssets, address);
      const stakerPools = _get(stakerData, 'poolsArray');

      const stakeData = yield all(
        stakerPools.map(poolData => {
          return put(
            actions.getUserStakeData({
              address,
              asset: poolData,
            }),
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
    fork(setBasePriceAsset),
    fork(saveWalletSaga),
    fork(forgetWalletSaga),
    fork(refreshBalance),
    fork(refreshStakes),
    fork(getUserStakeData),
  ]);
}
