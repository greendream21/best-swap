import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { isEmpty as _isEmpty } from 'lodash';
import * as actions from './actions';
import { MIDGARD_API_URL } from '../../helpers/apiHelper';

import {
  saveBasePriceAsset,
  getBasePriceAsset,
} from '../../helpers/webStorageHelper';
import { getAssetDetailIndex, getPriceIndex } from './utils';
import { DefaultApi } from '../../types/generated/midgard';
import { UnpackedPromise } from '../../types/util';

/**
 * Helper type to infer types of Midgard API responses
 * because `redux-saga` `call` functions need to know what the return type is.
 * Basicly it's a transformation from Promise<AnyValue>) to AxiosResponse<AnyValue>
 * by using `conditional types` and `infer` features of TypeScript
 *
 * Note: `call` of `redux-saga` would just return an `any` without using that helper type
 * and we would lost all type safety w/o using this helper type.
 *
 * <F> Type of midgard endpoint function
 * <R> Return type of midgards endpoint function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MidgardAPIResponse<F> = F extends (...args: any[]) => infer R
  ? UnpackedPromise<R>
  : F;

const midgardApi = new DefaultApi({ basePath: MIDGARD_API_URL });

export function* getPools() {
  yield takeEvery(actions.GET_POOLS_REQUEST, function*() {
    try {
      const fn = midgardApi.getPools;
      const { data }: MidgardAPIResponse<typeof fn> = yield call({
        context: midgardApi,
        fn,
      });

      if (data && !_isEmpty(data)) {
        const fn = midgardApi.getAssetInfo;
        const {
          data: assetDetails,
        }: MidgardAPIResponse<typeof fn> = yield call(
          {
            context: midgardApi,
            fn,
          },
          data.join(),
        );

        const assetDetailIndex = getAssetDetailIndex(assetDetails);
        const baseTokenTicker = getBasePriceAsset() || 'RUNE';
        const priceIndex = getPriceIndex(assetDetails, baseTokenTicker);
        const assetsPayload: actions.SetAssetsPayload = {
          assetDetails,
          assetDetailIndex,
        };

        yield put(actions.setAssets(assetsPayload));
        yield put(actions.setPriceIndex(priceIndex));

        yield put(
          actions.getPoolData({ assets: data, overrideAllPoolData: true }),
        );

        yield put(actions.getPoolsSuccess(data));
      } else {
        const error = new Error('No pools available');
        yield put(actions.getPoolsFailed(error));
      }
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

export function* getPoolData() {
  yield takeEvery(actions.GET_POOL_DATA_REQUEST, function*({
    payload,
  }: actions.GetPoolData) {
    const { assets, overrideAllPoolData } = payload;
    try {
      const fn = midgardApi.getPoolsData;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        assets.join(),
      );
      yield put(
        actions.getPoolDataSuccess({ poolDetails: data, overrideAllPoolData }),
      );
    } catch (error) {
      yield put(actions.getPoolDataFailed(error));
    }
  });
}

export function* getStakerPoolData() {
  yield takeEvery(actions.GET_STAKER_POOL_DATA_REQUEST, function*({
    payload,
  }: actions.GetStakerPoolData) {
    const { address, asset } = payload;

    // TODO (Chris): currently hardcode the Chain as BNB
    const assetId = `BNB.${asset}`;

    try {
      const fn = midgardApi.getStakersAddressAndAssetData;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        address,
        assetId,
      );

      yield put(actions.getStakerPoolDataSuccess(data));
    } catch (error) {
      yield put(actions.getStakerPoolDataFailed(error));
    }
  });
}

export function* getPoolAddress() {
  yield takeEvery(actions.GET_POOL_ADDRESSES_REQUEST, function*() {
    try {
      const fn = midgardApi.getThorchainProxiedEndpoints;
      const { data }: MidgardAPIResponse<typeof fn> = yield call({
        context: midgardApi,
        fn,
      });

      yield put(actions.getPoolAddressSuccess(data));
    } catch (error) {
      yield put(actions.getPoolAddressFailed(error));
    }
  });
}

export function* getTxByAddress() {
  yield takeEvery(actions.GET_TX_BY_ADDRESS, function*({
    payload,
  }: actions.GetTxByAddress) {
    try {
      const fn = midgardApi.getTxDetails;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        { context: midgardApi, fn },
        payload,
      );

      yield put(actions.getTxByAddressSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressFailed(error));
    }
  });
}

export function* getTxByAddressTxId() {
  yield takeEvery(actions.GET_TX_BY_ADDRESS_TXID, function*({
    payload,
  }: actions.GetTxByAddressTxId) {
    try {
      const fn = midgardApi.getTxDetailsByAddressTxId;
      const { address, txId } = payload;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        address,
        txId,
      );

      yield put(actions.getTxByAddressTxIdSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressTxIdFailed(error));
    }
  });
}

export function* getTxByAddressAsset() {
  yield takeEvery(actions.GET_TX_BY_ADDRESS_ASSET, function*({
    payload,
  }: actions.GetTxByAddressAsset) {
    try {
      const fn = midgardApi.getTxDetailsByAddressAsset;
      const { address, asset } = payload;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        address,
        asset,
      );

      yield put(actions.getTxByAddressAssetSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAddressAssetFailed(error));
    }
  });
}

export function* getTxByAsset() {
  yield takeEvery(actions.GET_TX_BY_ASSET, function*({
    payload,
  }: actions.GetTxByAsset) {
    try {
      const fn = midgardApi.getTxDetailsByAsset;
      const { data }: MidgardAPIResponse<typeof fn> = yield call(
        {
          context: midgardApi,
          fn,
        },
        payload,
      );

      yield put(actions.getTxByAssetSuccess(data));
    } catch (error) {
      yield put(actions.getTxByAssetFailed(error));
    }
  });
}

export function* setBasePriceAsset() {
  yield takeEvery(actions.SET_BASE_PRICE_ASSET, function*({
    payload,
  }: actions.SetBasePriceAsset) {
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
