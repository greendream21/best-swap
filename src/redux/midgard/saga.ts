import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as actions from './actions';
import {
  MIDGARD_API_URL,
} from '../../helpers/apiHelper';

import {
  saveBasePriceAsset,
  getBasePriceAsset,
} from '../../helpers/webStorageHelper';
import { getAssetDataIndex, getPriceIndex } from './utils';
import { GetPoolAddressSuccessData } from './types';
import {
  DefaultApi,
  Asset,
  AssetDetail,
  PoolDetail,
  StakersAssetData,
} from '../../types/generated/midgard/api';

const midgardApi = new DefaultApi({ basePath: MIDGARD_API_URL });

export function* getPools() {
  yield takeEvery(actions.GET_POOLS_REQUEST, function*() {
    try {
      const { data }: AxiosResponse<Asset[]> = yield call([
        midgardApi,
        midgardApi.getPools,
      ]);
      const assetResponses: AxiosResponse<AssetDetail>[] = yield all(
        data.map(asset => {
          const { chain, symbol } = asset;
          const assetId = `${chain}.${symbol}`;
          return call(
            { context: midgardApi, fn: midgardApi.getAssetInfo },
            assetId,
          );
        }),
      );

      const assetDetails: AssetDetail[] = assetResponses.map(
        (response: AxiosResponse<AssetDetail>) => response.data,
      );

      const assetDataIndex = getAssetDataIndex(assetDetails);
      const baseTokenTicker = getBasePriceAsset() || 'RUNE';
      const priceIndex = getPriceIndex(assetDetails, baseTokenTicker);

      const assetsPayload: actions.SetAssetsPayload = {
        assetDetails,
        assetDataIndex,
      };

      yield put(actions.setAssets(assetsPayload));
      yield put(actions.setPriceIndex(priceIndex));

      yield all(
        data.map(asset => {
          const { chain, symbol } = asset;
          const assetId = `${chain}.${symbol}`;

          return put(actions.getPoolData(assetId));
        }),
      );
      yield put(actions.getPoolsSuccess(data));
    } catch (error) {
      yield put(actions.getPoolsFailed(error));
    }
  });
}

export function* getPoolData() {
  yield takeEvery(actions.GET_POOL_DATA_REQUEST, function*({
    payload,
  }: actions.GetPoolData) {
    try {
      const { data }: AxiosResponse<PoolDetail> = yield call(
        { context: midgardApi, fn: midgardApi.getPoolsData },
        payload,
      );
      yield put(actions.getPoolDataSuccess(data));
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
      const { data }: AxiosResponse<StakersAssetData> = yield call(
        { context: midgardApi, fn: midgardApi.getStakersAddressAndAssetData },
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
      // TODO (veado): Midgard endpoint has to be updated
      // Currently there is no type defined for the response
      // Seee https://gitlab.com/thorchain/midgard/-/blob/master/api/rest/v1/handlers/handlers.go#L366-370
      const { data } = yield call({
        context: midgardApi,
        fn: midgardApi.getThorchainProxiedEndpoints,
      });

      yield put(
        actions.getPoolAddressSuccess(data as GetPoolAddressSuccessData),
      );
    } catch (error) {
      yield put(actions.getPoolAddressFailed(error));
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
  ]);
}
