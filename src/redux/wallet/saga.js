import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import actions from './actions';
import Binance from '../../clients/binance';
import {
  getCoinGeckoURL,
  getHeaders,
  axiosRequest,
  getChainserviceURL,
  getStatechainURL,
} from '../../helpers/apiHelper';

import {
  saveWalletAddress,
  saveKeystore,
  clearWalletAddress,
  clearKeystore,
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

const getRunePriceRequest = async () => {
  const params = {
    method: 'get',
    url: getCoinGeckoURL('simple/price?ids=thorchain&vs_currencies=usd'),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);
    return data.thorchain.usd || 0;
  } catch (error) {
    return null;
  }
};

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

        // get rune price

        let price = 0;
        try {
          price = yield call(getRunePriceRequest);
          yield put(actions.getRunePriceSuccess(price));
        } catch (error) {
          console.log(error);
        }
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
    url: getChainserviceURL(`stakerData?staker=${address}`),
    headers: getHeaders(),
  };

  try {
    const data = await axiosRequest(params);
    return data || [];
  } catch (error) {
    return null;
  }
};

const getPools = async () => {
  const params = {
    method: 'get',
    url: getStatechainURL('swapservice/pools'),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);
    return data;
  } catch (error) {
    return null;
  }
};

const getRunePriceReq = async () => {
  const params = {
    method: 'get',
    url: getCoinGeckoURL('simple/price?ids=thorchain&vs_currencies=usd'),
    headers: getHeaders(),
  };

  try {
    const { data } = await axiosRequest(params);

    return data.thorchain.usd || 0;
  } catch (error) {
    return null;
  }
};

const getPoolPrice = (pools, asset, runePrice) => {
  let poolPrice = 0;

  pools.forEach(poolData => {
    const { balance_rune, balance_token, symbol } = poolData;

    if (symbol.toLowerCase() === asset.toLowerCase()) {
      const R = Number(balance_rune);
      const T = Number(balance_token);
      poolPrice = getFixedNumber((R / T) * runePrice);
    }
  });

  return poolPrice;
};

export function* getUserStakeData() {
  yield takeEvery(actions.GET_USER_STAKE_DATA_REQUEST, function*({ payload }) {
    const { staker, asset, pools, runePrice } = payload;

    const params = {
      method: 'get',
      url: getChainserviceURL(`stakerData?staker=${staker}&asset=${asset}`),
      headers: getHeaders(),
    };
    console.log(params);
    try {
      const response = yield call(axiosRequest, params);

      const price = getPoolPrice(pools, asset, runePrice);

      const data = {
        target: asset.toLowerCase(),
        targetValue: getFixedNumber(response.data.tokensStaked / BASE_NUMBER),
        assetValue: getFixedNumber(response.data.runeStaked / BASE_NUMBER),
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
      const pools = yield call(getPools);
      const runePrice = yield call(getRunePriceReq);

      try {
        const response = yield call(getStakerAssets, address);

        const stakeData = yield all(
          response.data.map(symbol => {
            return put(
              actions.getUserStakeData({
                staker: address,
                asset: symbol,
                pools,
                runePrice,
              }),
            );
          }),
        );

        yield put(actions.refreshStakeSuccess(stakeData));
      } catch (error) {
        yield put(actions.refreshStakeFailed(error));
      }
    } catch (error) {
      yield put(actions.refreshStakeFailed(error));
    }
  });
}

export function* getRunePrice() {
  yield takeEvery(actions.GET_RUNE_PRICE, function*(/* { payload } */) {
    const params = {
      method: 'get',
      url: getCoinGeckoURL('simple/price?ids=thorchain&vs_currencies=usd'),
      headers: getHeaders(),
    };

    try {
      const { data } = yield call(axiosRequest, params);
      const price = data.thorchain.usd || 0;

      yield put(actions.getRunePriceSuccess(price));
    } catch (error) {
      yield put(actions.getRunePriceFailed(error));
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
    fork(getRunePrice),
  ]);
}
