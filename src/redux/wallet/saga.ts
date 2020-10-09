import {
  all,
  takeEvery,
  put,
  fork,
  call,
  delay,
  select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { isEmpty as _isEmpty } from 'lodash';

import { AxiosResponse } from 'axios';
import { Balance, Address } from '@thorchain/asgardex-binance';
import { bnOrZero } from '@thorchain/asgardex-util';
import {
  baseToToken,
  baseAmount,
  tokenAmount,
} from '@thorchain/asgardex-token';
import { RootState } from '../store';
import * as api from '../../helpers/apiHelper';

import { saveWallet, clearWallet } from '../../helpers/webStorageHelper';

import * as actions from './actions';
import { AssetData } from './types';
import {
  StakersAddressData,
  PoolDetail,
  StakersAssetData,
} from '../../types/generated/midgard';
import { getAssetFromString } from '../midgard/utils';

import { asgardexBncClient, getNet } from '../../env';
import {
  getApiBasePath,
  MIDGARD_MAX_RETRY,
  MIDGARD_RETRY_DELAY,
} from '../midgard/saga';
import { UnpackPromiseResponse } from '../../types/util';
import { isBEP8Token } from '../../helpers/utils/walletUtils';

export function* saveWalletSaga() {
  yield takeEvery('SAVE_WALLET', function*({
    payload,
  }: ReturnType<typeof actions.saveWallet>) {
    const { wallet } = payload;

    saveWallet(payload);

    // update wallet balance and stake data
    yield put(actions.refreshBalance(wallet));
    yield put(actions.refreshStakes(wallet));
  });
}

export function* forgetWalletSaga() {
  yield takeEvery('FORGET_WALLET', function*() {
    clearWallet();

    yield put(push('/connect'));
  });
}

export function* refreshBalance() {
  yield takeEvery('REFRESH_BALANCE', function*({
    payload,
  }: ReturnType<typeof actions.refreshBalance>) {
    const address = payload;

    try {
      const balances: Balance[] = yield call(
        asgardexBncClient.getBalance,
        address,
      );

      try {
        const filteredBalance = balances.filter(
          (balance: Balance) => !isBEP8Token(balance.symbol),
        );
        const coins = filteredBalance.map((coin: Balance) => {
          return {
            asset: coin.symbol,
            assetValue: tokenAmount(coin.free),
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

export function* getUserStakeData(
  payload: {
    address: Address;
    assets: string[];
  },
  basePath: string,
) {
  const { address, assets } = payload;

  let midgardApi = api.getMidgardDefaultApi(basePath);
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
  midgardApi = api.getMidgardDefaultApi(basePath);
  const { data: poolDataList }: AxiosResponse<PoolDetail[]> = yield call(
    { context: midgardApi, fn: midgardApi.getPoolsDetails },
    assets.join(),
  );

  // Transform results of requests 1 + 2 into `StakeData[]`
  const stakeDataList: AssetData[] = poolDataList.reduce(
    (acc: AssetData[], poolData: PoolDetail) => {
      const userStakerData = poolData.asset
        ? poolDetailMap[poolData.asset]
        : null;
      if (userStakerData && poolData.asset) {
        const { symbol = '' } = getAssetFromString(poolData.asset);
        const { poolUnits, runeDepth } = poolData;
        const { units: stakeUnits } = userStakerData;

        const poolUnitsBN = bnOrZero(poolUnits);
        const runeDepthBN = bnOrZero(runeDepth);
        const stakeUnitsBN = bnOrZero(stakeUnits);

        // formula: units / poolUnits * runeDepth * 2
        const value = stakeUnitsBN
          .dividedBy(poolUnitsBN)
          .multipliedBy(runeDepthBN)
          .multipliedBy(2);

        const stakeData: AssetData = {
          asset: symbol,
          assetValue: baseToToken(baseAmount(value)),
        };
        return [...acc, stakeData];
      } else {
        return acc;
      }
    },
    [],
  );
  return stakeDataList;
}

function* tryRefreshStakes(address: Address) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getStakersAddressData;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        address,
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get stakers address data');
}

export function* tryGetUserStakeData(address: Address, pools: string[]) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      // Unsafe: `StakeData[]` can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const result: AssetData[] = yield call(
        getUserStakeData,
        {
          address,
          assets: pools,
        },
        basePath,
      );
      return result;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get user staked data');
}

export function* refreshStakes() {
  yield takeEvery('REFRESH_STAKES', function*({
    payload: address,
  }: ReturnType<typeof actions.refreshStakes>) {
    try {
      const data: StakersAddressData = yield call(tryRefreshStakes, address);

      if (data?.poolsArray && !_isEmpty(data?.poolsArray)) {
        const result = yield call(
          tryGetUserStakeData,
          address,
          data.poolsArray,
        );
        yield put(actions.refreshStakesSuccess(result));
      } else {
        yield put(actions.refreshStakesSuccess([]));
      }
    } catch (error) {
      yield put(actions.refreshStakesFailed(error));
    }
  });
}

export function* refreshWallet() {
  yield takeEvery('REFRESH_WALLET', function*() {
    const user = yield select((state: RootState) => state.Wallet.user);
    const wallet = user?.wallet;

    if (wallet) {
      yield put(actions.refreshBalance(wallet));
      yield put(actions.refreshStakes(wallet));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(saveWalletSaga),
    fork(forgetWalletSaga),
    fork(refreshBalance),
    fork(refreshStakes),
    fork(refreshWallet),
  ]);
}
