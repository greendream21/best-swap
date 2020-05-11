import { all, takeEvery, put, fork, call, delay } from 'redux-saga/effects';
import { isEmpty as _isEmpty } from 'lodash';
import byzantine from '@thorchain/byzantine-module';
import * as actions from './actions';
import * as api from '../../helpers/apiHelper';

import {
  saveBasePriceAsset,
  getBasePriceAsset,
} from '../../helpers/webStorageHelper';
import { getAssetDetailIndex, getPriceIndex } from './utils';
import { NET, getNet } from '../../env';
import { UnpackPromiseResponse } from '../../types/util';
import {
  GetTxByAddressPayload,
  GetTxByAddressTxIdPayload,
  GetTxByAssetPayload,
  GetTxByAddressAssetPayload,
  GetStakerPoolDataPayload,
} from './types';
import { AssetDetail } from '../../types/generated/midgard';

export const MIDGARD_MAX_RETRY = 3;
export const MIDGARD_RETRY_DELAY = 1000; // ms

export function* getApiBasePath(net: NET, noCache = false) {
  // dev
  if (net === NET.DEV) {
    const basePath: string = api.getMidgardBasePathByIP(api.MIDGARD_DEV_API_DEV_IP);
    yield put(actions.getApiBasePathSuccess(basePath));
    return basePath;
  }
  // test- | chaosnet
  if (net === NET.TEST || net === NET.CHAOS) {
    const basePath: string = api.MIDGARD_TEST_API;
    yield put(actions.getApiBasePathSuccess(basePath));
    return basePath;
  }

  // mainnet uses `byz`

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

type GetPoolsResult = { poolAssets: string[]; assetDetails: AssetDetail[] };

function* tryGetPools() {
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
      );

      if (!_isEmpty(poolAssets)) {
        const fn = midgardApi.getAssetInfo;
        const {
          data: assetDetails,
        }: UnpackPromiseResponse<typeof fn> = yield call(
          {
            context: midgardApi,
            fn,
          },
          poolAssets.join(),
        );
        return { poolAssets, assetDetails } as GetPoolsResult;
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

export function* getPools() {
  yield takeEvery('GET_POOLS_REQUEST', function*() {
    try {
      // Unsafe: Can't infer type of `GetPoolsResult` in a Generator function - known TS/Generator/Saga issue
      const { poolAssets, assetDetails }: GetPoolsResult = yield call(
        tryGetPools,
      );
      const assetDetailIndex = getAssetDetailIndex(assetDetails);
      const assetsPayload: actions.SetAssetsPayload = {
        assetDetails,
        assetDetailIndex,
      };

      yield put(actions.setAssets(assetsPayload));

      const baseTokenTicker = getBasePriceAsset() || 'RUNE';
      const priceIndex = getPriceIndex(assetDetails, baseTokenTicker);
      yield put(actions.setPriceIndex(priceIndex));

      yield put(
        actions.getPoolData({ assets: poolAssets, overrideAllPoolData: true }),
      );
      yield put(actions.getPoolsSuccess(poolAssets));
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

function* tryGetPoolData(assets: string[]) {
  for (let i = 0; i < MIDGARD_MAX_RETRY; i++) {
    try {
      const noCache = i > 0;
      // Unsafe type match of `basePath`: Can't be inferred by `tsc` from a return value of a Generator function - known TS/Generator/Saga issue
      const basePath: string = yield call(getApiBasePath, getNet(), noCache);
      const midgardApi = api.getMidgardDefaultApi(basePath);
      const fn = midgardApi.getPoolsData;
      const { data }: UnpackPromiseResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        assets.join(),
      );
      return data;
    } catch (error) {
      if (i < MIDGARD_MAX_RETRY - 1) {
        yield delay(MIDGARD_RETRY_DELAY);
      }
    }
  }
  throw new Error('Midgard API request failed to get pool data');
}

export function* getPoolData() {
  yield takeEvery('GET_POOL_DATA_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getPoolData>) {
    const { assets, overrideAllPoolData } = payload;
    try {
      const data = yield call(tryGetPoolData, assets);
      yield put(
        actions.getPoolDataSuccess({
          poolDetails: data,
          overrideAllPoolData,
        }),
      );
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
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

export function* getStakerPoolData() {
  yield takeEvery('GET_STAKER_POOL_DATA_REQUEST', function*({
    payload,
  }: ReturnType<typeof actions.getStakerPoolData>) {
    try {
      const data = yield call(tryGetStakerPoolData, payload);
      yield put(actions.getStakerPoolDataSuccess(data));
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
      // Can't infer type of `data: InlineResponse200` in a Generator function - known TS/Generator/Saga issue
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
      // Can't infer type of `data: InlineResponse200` in a Generator function - known TS/Generator/Saga issue
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

export default function* rootSaga() {
  yield all([
    fork(getPools),
    fork(getPoolData),
    fork(getStakerPoolData),
    fork(getPoolAddress),
    fork(setBasePriceAsset),
    fork(getTxByAddress),
    fork(getTxByAddressTxId),
    fork(getTxByAddressAsset),
    fork(getTxByAsset),
  ]);
}
