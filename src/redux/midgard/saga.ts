import byzantine from '@thorchain/byzantine-module';
import { isEmpty as _isEmpty } from 'lodash';
import {
  all,
  takeEvery,
  put,
  fork,
  call,
  delay,
  select,
} from 'redux-saga/effects';

import { axiosRequest } from 'helpers/apiHelper';
import * as api from 'helpers/apiHelper';
import {
  saveBasePriceAsset,
  getBasePriceAsset,
} from 'helpers/webStorageHelper';

import {
  PoolDetail,
  AssetDetail,
  PoolEarningDetail,
} from 'types/generated/midgard/api';
import { UnpackPromiseResponse } from 'types/util';

import { NET, getNet } from '../../env';
import { RootState } from '../store';
import * as actions from './actions';
import {
  GetAssetsPayload,
  GetTxByAddressPayload,
  GetTxByAddressTxIdPayload,
  GetTxByAssetPayload,
  GetTxByAddressAssetPayload,
  GetStakerPoolDataPayload,
  GetTransactionPayload,
  GetRTAggregateByAssetPayload,
  GetRTStatsPayload,
  PoolStatus,
  PoolDataMap,
} from './types';
import {
  getAssetDetailIndex,
  getPriceIndex,
  getOrderedPoolString,
  getEoDTime,
  getWeekAgoTime,
  getAssetSymbolFromPayload,
} from './utils';

export const MIDGARD_MAX_RETRY = 3;
export const MIDGARD_RETRY_DELAY = 1000; // ms

export function* getApiBasePath(net: NET, noCache = false) {
  const baseAPIURL: string = api.getMidgardBaseURL();
  const hostname = window.location.hostname;

  const isMainnet = hostname === 'bepswap.com';
  if (!isMainnet) {
    yield put(actions.getApiBasePathSuccess(baseAPIURL));
    return baseAPIURL;
  }

  // mainnet will use byzantine

  try {
    yield put(actions.getApiBasePathPending());
    const fn = byzantine;
    const basePath: UnpackPromiseResponse<typeof fn> = yield call(
      fn,
      net === NET.MAIN,
      noCache,
    );
    yield put(actions.getApiBasePathSuccess(basePath));
    return basePath;
  } catch (error) {
    yield put(actions.getApiBasePathFailed(error));
    throw new Error(error);
  }
}

function* tryGetPools(status: PoolStatus = 'enabled') {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getPools;
      const { data: poolAssets }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        status,
      );
      return poolAssets;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get pools');
}

function* tryGetStats() {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getStats;
      const { data: stats }: UnpackPromiseResponse<typeof fn> = yield call({
        context: midgardApi,
        fn,
      });
      return stats;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
}

function* tryGetAssets(poolAssets: string[]) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const orderedPools = getOrderedPoolString(poolAssets);

      if (!_isEmpty(poolAssets)) {
        const fn = midgardApi.getAssetInfo;
        const {
          data: assetDetails,
        }: UnpackPromiseResponse<typeof fn> = yield call(
          {
            context: midgardApi,
            fn,
          },
          orderedPools,
        );
        return assetDetails;
      } else {
        throw new Error('No pools available');
      }
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get pools');
}

export function* getPoolAssets() {
  yield takeEvery('GET_POOL_ASSETS_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getPoolAssets>) {
    try {
      const assetDetails: AssetDetail[] = yield call(tryGetAssets, payload);
      const assetDetailIndex = getAssetDetailIndex(assetDetails);
      const assetsPayload: GetAssetsPayload = {
        assetDetails,
        assetDetailIndex,
      };

      yield put(actions.getPoolAssetsSuccess(assetsPayload));
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
      yield put(actions.getPoolAssetsFailed(error));
    }
  });
}

export function* getPools() {
  yield takeEvery('GET_POOLS_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getPools>) {
    try {
      // get pools
      const pools = yield call(tryGetPools, payload);

      yield put(actions.getPoolsSuccess(pools));

      yield put(actions.getPoolData({ assets: pools }));
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

export function* getStats() {
  yield takeEvery('GET_STATS_REQUEST', function*() {
    try {
      // Unsafe: Can't infer type of `GetStatsResult` in a Generator function - known TS/Generator/Saga issue
      const stats = yield call(tryGetStats);

      yield put(actions.getStatsSuccess(stats));
    } catch (error) {
      yield put(actions.getStatsFailed(error));
    }
  });
}

function* tryGetNetworkInfo() {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getNetworkData;
      const {
        data: networkInfo,
      }: UnpackPromiseResponse<typeof fn> = yield call({
        context: midgardApi,
        fn,
      });
      return networkInfo;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
}

export function* getNetworkInfo() {
  yield takeEvery('GET_NETWORK_INFO_REQUEST', function*() {
    try {
      const networkInfo = yield call(tryGetNetworkInfo);
      const { data: mimir } = yield call(getThorchainMimir);
      const { data: queue } = yield call(getThorchainQueue);

      yield put(actions.getThorchainDataSuccess({ mimir, queue }));
      yield put(actions.getNetworkInfoSuccess(networkInfo));
    } catch (error) {
      yield put(actions.getNetworkInfoFailed(error));
    }
  });
}

function* tryGetPoolDataFromAsset(
  asset: string,
  view: 'balances' | 'simple' | 'full',
) {
  try {
    const basePath: string = yield call(getApiBasePath, getNet());
    const midgardApi = api.getMidgardDefaultApi(basePath);
    const fn = midgardApi.getPoolsDetails;

    const { data }: UnpackPromiseResponse<typeof fn> = yield call(
      { context: midgardApi, fn },
      asset,
      view,
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function* getPoolData() {
  yield takeEvery('GET_POOL_DATA_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getPoolData>) {
    const { assets, type = 'simple' } = payload;
    try {
      // sort assets to support cache by sending fixed request URL.
      const sortedAssets = getOrderedPoolString(assets);
      const poolDetails: PoolDetail[] = yield call(
        tryGetPoolDataFromAsset,
        sortedAssets,
        type,
      );

      // merge pool data to the current pool data state
      const curPoolData = yield select(
        (state: RootState) => state.Midgard.poolData,
      );

      const newPoolData = poolDetails.reduce(
        (acc: PoolDataMap, poolDetail: PoolDetail) => {
          const symbol = getAssetSymbolFromPayload(poolDetail);
          return symbol
            ? {
                ...acc,
                [symbol]: poolDetail,
              }
            : acc;
        },
        {} as PoolDataMap,
      );

      const mergedPoolData = {
        ...curPoolData,
        ...newPoolData,
      };

      const baseTokenTicker = getBasePriceAsset() || 'RUNE';
      const priceIndex = getPriceIndex(mergedPoolData, baseTokenTicker);
      yield put(actions.setPriceIndex(priceIndex));

      yield put(
        actions.getPoolDataSuccess({
          poolData: mergedPoolData,
        }),
      );
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
    }
  });
}

export function* getPoolDetailByAsset() {
  yield takeEvery('GET_POOL_DETAIL_BY_ASSET', function*({
    payload,
  }: ReturnType<typeof actions.getPoolDetailByAsset>) {
    const { asset } = payload;
    try {
      const data = yield call(tryGetPoolDataFromAsset, asset, 'full');
      yield put(actions.getPoolDetailByAssetSuccess(data));
    } catch (error) {
      yield put(actions.getPoolDetailByAssetFailed(error));
    }
  });
}

function* tryGetStakerPoolData(payload: GetStakerPoolDataPayload) {
  const { address, asset } = payload;

  // TODO (Chris): currently hardcode the Chain as BNB
  const assetId = `BNB.${asset}`;

  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getStakersAddressAndAssetData;
      const response: UnpackPromiseResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        address,
        assetId,
      );
      const { data } = response;
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get stakers pool data');
}

const getThorchainConstants = () => {
  return axiosRequest({
    url: `${api.getThorchainBaseURL()}/constants`,
    method: 'GET',
  });
};

const getThorchainLastBlock = () => {
  return axiosRequest({
    url: `${api.getThorchainBaseURL()}/lastblock`,
    method: 'GET',
  });
};

const getThorchainMimir = () => {
  return axiosRequest({
    url: `${api.getThorchainBaseURL()}/mimir`,
    method: 'GET',
  });
};

const getThorchainQueue = () => {
  return axiosRequest({
    url: `${api.getThorchainBaseURL()}/queue`,
    method: 'GET',
  });
};

export function* getStakerPoolData() {
  yield takeEvery('GET_STAKER_POOL_DATA_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getStakerPoolData>) {
    try {
      const data = yield call(tryGetStakerPoolData, payload);

      // TODO: (CHRIS) create a separate get thorchaindata actions
      const { data: constants } = yield call(getThorchainConstants);
      const { data: lastBlock } = yield call(getThorchainLastBlock);

      yield put(actions.getStakerPoolDataSuccess(data));
      yield put(
        actions.getThorchainDataSuccess({
          constants,
          lastBlock,
        }),
      );
    } catch (error) {
      yield put(actions.getStakerPoolDataFailed(error));
    }
  });
}

function* tryGetPoolAddressRequest() {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getThorchainProxiedEndpoints;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call({
        context: midgardApi,
        fn,
      });
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get pool addresses');
}

export function* getPoolAddress() {
  yield takeEvery('GET_POOL_ADDRESSES_REQUEST', function*() {
    try {
      const data = yield call(tryGetPoolAddressRequest);
      yield put(actions.getPoolAddressSuccess(data));
    } catch (error) {
      yield put(actions.getPoolAddressFailed(error));
    }
  });
}

function* tryGetTransactions(payload: GetTransactionPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      const { asset, offset, limit, type } = payload;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getTxDetails;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        offset,
        limit,
        undefined,
        undefined,
        asset,
        type,
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get transaction details');
}

export function* getTransactions() {
  yield takeEvery('GET_TRANSACTION', function*({
    payload,
  }: ReturnType<typeof actions.getTransaction>) {
    try {
      const data = yield call(tryGetTransactions, payload);
      yield put(actions.getTransactionSuccess(data));
    } catch (error) {
      yield put(actions.getTransactionFailed(error));
    }
  });
}

export function* getTransactionWithRefresh() {
  yield takeEvery('GET_TRANSACTION_WITH_REFRESH', function*({
    payload,
  }: ReturnType<typeof actions.getTransaction>) {
    try {
      const data = yield call(tryGetTransactions, payload);
      yield put(actions.getTransactionWithRefreshSuccess(data));
    } catch (error) {
      yield put(actions.getTransactionWithRefreshFailed(error));
    }
  });
}

function* tryGetTxByAddress(payload: GetTxByAddressPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      const { address, offset, limit, type } = payload;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getTxDetails;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        offset,
        limit,
        address,
        undefined,
        undefined,
        type,
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get tx details by address');
}

export function* getTxByAddress() {
  yield takeEvery('GET_TX_BY_ADDRESS', function*({
    payload,
  }: ReturnType<typeof actions.getTxByAddress>) {
    try {
      const data = yield call(tryGetTxByAddress, payload);
      yield put(actions.getTxByAddressSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressFailed(error));
    }
  });
}

function* tryTxByAddressTxId(payload: GetTxByAddressTxIdPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe: Can't infer type of `string` in a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getTxDetails;
      const { address, txId, offset, limit, type } = payload;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        offset,
        limit,
        address,
        txId,
        undefined,
        type,
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get tx details by tx id');
}

export function* getTxByAddressTxId() {
  yield takeEvery('GET_TX_BY_ADDRESS_TXID', function*({
    payload,
  }: ReturnType<typeof actions.getTxByAddressTxId>) {
    try {
      const data = yield call(tryTxByAddressTxId, payload);
      yield put(actions.getTxByAddressTxIdSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressTxIdFailed(error));
    }
  });
}

function* tryGetTxByAddressAsset(payload: GetTxByAddressAssetPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe: Can't infer type of `basePath` here - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getTxDetails;
      const { address, asset, offset, limit, type } = payload;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        offset,
        limit,
        address,
        undefined,
        asset,
        type,
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error(
    'Midgard API request failed to get tx details by address asset',
  );
}

export function* getTxByAddressAsset() {
  yield takeEvery('GET_TX_BY_ADDRESS_ASSET', function*({
    payload,
  }: ReturnType<typeof actions.getTxByAddressAsset>) {
    try {
      const data = yield call(tryGetTxByAddressAsset, payload);
      yield put(actions.getTxByAddressAssetSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressAssetFailed(error));
    }
  });
}

function* tryGetTxByAsset(payload: GetTxByAssetPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      const { asset, offset, limit, type } = payload;
      // Unsafe: Can't infer type of `basePath` here - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getTxDetails;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        offset,
        limit,
        undefined,
        undefined,
        asset,
        type,
      );

      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get tx details by asset');
}

export function* getTxByAsset() {
  yield takeEvery('GET_TX_BY_ASSET', function*({
    payload,
  }: ReturnType<typeof actions.getTxByAsset>) {
    try {
      const data = yield call(tryGetTxByAsset, payload);
      yield put(actions.getTxByAssetSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAssetFailed(error));
    }
  });
}

export function* setBasePriceAsset() {
  yield takeEvery('SET_BASE_PRICE_ASSET', function*({
    payload,
  }: ReturnType<typeof actions.setBasePriceAsset>) {
    yield call(saveBasePriceAsset, payload);
  });
}

function* tryGetRTAggregateByAsset(payload: GetRTAggregateByAssetPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      const {
        asset = '',
        from = 0,
        to = getEoDTime(),
        interval = 'day',
      } = payload;
      // Unsafe: Can't infer type of `basePath` here - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getPoolAggChanges;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        asset,
        interval,
        from,
        to,
      );

      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error(
    'Midgard API request failed to get RT Volume changes by asset',
  );
}

export function* getRTAggregateByAsset() {
  yield takeEvery('GET_RT_AGGREGATE_BY_ASSET', function*({
    payload,
  }: ReturnType<typeof actions.getRTAggregateByAsset>) {
    try {
      // if asset is not specified, request fails
      if (!payload.asset) {
        yield put(actions.getRTAggregateByAssetFailed(Error('Invalid symbol')));
      }

      const curTime = getEoDTime();
      const weekAgoTime = getWeekAgoTime();

      const allTimeParams: GetRTAggregateByAssetPayload = {
        ...payload,
        interval: 'day',
        from: 0,
        to: curTime,
      };

      const weekParams: GetRTAggregateByAssetPayload = {
        ...payload,
        interval: 'day',
        from: weekAgoTime,
        to: curTime,
      };

      const allTimeData = yield call(tryGetRTAggregateByAsset, allTimeParams);
      const weekData = yield call(tryGetRTAggregateByAsset, weekParams);
      yield put(
        actions.getRTAggregateByAssetSuccess({
          allTimeData,
          weekData,
        }),
      );
    } catch (error) {
      yield put(actions.getRTAggregateByAssetFailed(error));
    }
  });
}

function* trygetRTStats(payload: GetRTStatsPayload) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      const { from = 0, to = getEoDTime(), interval = 'day' } = payload;
      // Unsafe: Can't infer type of `basePath` here - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getStatsChanges;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        interval,
        from,
        to,
      );

      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error(
    'Midgard API request failed to get RT Volume changes by asset',
  );
}

export function* getRTStats() {
  yield takeEvery('GET_RT_STATS_CHANEGS', function*({
    payload,
  }: ReturnType<typeof actions.getRTStats>) {
    try {
      const curTime = getEoDTime();
      const weekAgoTime = getWeekAgoTime();

      const allTimeParams: GetRTStatsPayload = {
        ...payload,
        interval: 'day',
        from: 0,
        to: curTime,
      };

      const weekParams: GetRTStatsPayload = {
        ...payload,
        interval: 'day',
        from: weekAgoTime,
        to: curTime,
      };

      const allTimeData = yield call(trygetRTStats, allTimeParams);
      const weekData = yield call(trygetRTStats, weekParams);
      yield put(
        actions.getRTStatsSuccess({
          allTimeData,
          weekData,
        }),
      );
    } catch (error) {
      yield put(actions.getRTStatsFailed(error));
    }
  });
}

function* tryGetPoolEarningDetails(payload: string) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe: Can't infer type of `basePath` here - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getEarningDetail;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        payload,
      );

      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error(
    'Midgard API request failed to get RT Volume changes by asset',
  );
}

export function* getPoolEarningDetails() {
  yield takeEvery('GET_POOL_EARNING_DETAILS', function*({
    payload,
  }: ReturnType<typeof actions.getPoolEarningDetails>) {
    try {
      const symbol = payload;

      const poolEarningDetail: PoolEarningDetail = yield call(
        tryGetPoolEarningDetails,
        symbol,
      );

      yield put(
        actions.getPoolEarningDetailsSuccess({
          symbol,
          poolEarningDetail,
        }),
      );
    } catch (error) {
      yield put(actions.getPoolEarningDetailsFailed(error));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getPoolAssets),
    fork(getPools),
    fork(getPoolData),
    fork(getStats),
    fork(getRTStats),
    fork(getStakerPoolData),
    fork(getPoolAddress),
    fork(setBasePriceAsset),
    fork(getTransactions),
    fork(getTransactionWithRefresh),
    fork(getTxByAddress),
    fork(getTxByAddressTxId),
    fork(getTxByAddressAsset),
    fork(getTxByAsset),
    fork(getRTAggregateByAsset),
    fork(getPoolEarningDetails),
    fork(getPoolDetailByAsset),
    fork(getNetworkInfo),
  ]);
}
