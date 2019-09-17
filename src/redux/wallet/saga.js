import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import actions from './actions';
import Binance from '../../clients/binance';
import ChainService from '../../clients/chainservice';
import {
  getCoinGeckoURL,
  getHeaders,
  axiosRequest,
} from '../../helpers/apiHelper';

import {
  saveWalletAddress,
  saveKeystore,
  clearWalletAddress,
  clearKeystore,
} from '../../helpers/webStorageHelper';

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
  yield takeEvery(actions.FORGET_WALLET, function*({ payload }) {
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

export function* refreshStakes() {
  yield takeEvery(actions.REFRESH_STAKES, function*({ payload }) {
    const address = payload;

    try {
      const markets = yield call(Binance.getMarkets);

      try {
        const response = yield call(ChainService.stakerData, address);

        const stakeData = yield all(
          response.data.map(ticker => {
            try {
              const response = call(ChainService.stakerData, address, ticker);

              const market = markets.result.find(
                market => market.base_asset_symbol === ticker,
              );

              return {
                target: ticker.toLowerCase(),
                targetValue: response.data.tokensStaked,
                assetValue: response.data.runeStaked,
                asset: 'rune',
                price: market ? parseFloat(market.list_price) : 0,
              };
            } catch (error) {
              console.error(error);
              return { target: ticker, asset: 'rune' };
            }
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
  yield takeEvery(actions.GET_RUNE_PRICE, function*({ payload }) {
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
    fork(getRunePrice),
  ]);
}
