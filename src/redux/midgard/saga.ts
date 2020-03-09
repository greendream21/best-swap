import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { isEmpty as _isEmpty } from 'lodash';
import * as actions from './actions';
import { MIDGARD_API_URL } from '../../helpers/apiHelper';

import {
  saveBasePriceAsset,
  getBasePriceAsset,
} from '../../helpers/webStorageHelper';
import { getAssetDetailIndex, getPriceIndex } from './utils';
import {
  DefaultApi,
  AssetDetail,
  PoolDetail,
  StakersAssetData,
  ThorchainEndpoints,
  TxDetails,
} from '../../types/generated/midgard';

const midgardApi = new DefaultApi({ basePath: MIDGARD_API_URL });

export function* getPools() {
  yield takeEvery(actions.GET_POOLS_REQUEST, function*() {
    try {
      const { data }: AxiosResponse<string[]> = yield call({
        context: midgardApi,
        fn: midgardApi.getPools,
      });

      if (data && !_isEmpty(data)) {
        const { data: assetDetails }: AxiosResponse<AssetDetail[]> = yield call(
          {
            context: midgardApi,
            fn: midgardApi.getAssetInfo,
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
      const { data }: AxiosResponse<PoolDetail[]> = yield call(
        { context: midgardApi, fn: midgardApi.getPoolsData },
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
      const { data }: AxiosResponse<ThorchainEndpoints> = yield call({
        context: midgardApi,
        fn: midgardApi.getThorchainProxiedEndpoints,
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
      const { data }: AxiosResponse<TxDetails[]> = yield call(
        {
          context: midgardApi,
          fn: midgardApi.getTxDetails,
        },
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
      const { address, txId } = payload;
      const { data }: AxiosResponse<TxDetails[]> = yield call(
        {
          context: midgardApi,
          fn: midgardApi.getTxDetailsByAddressTxId,
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
      const { address, asset } = payload;
      const { data }: AxiosResponse<TxDetails[]> = yield call(
        {
          context: midgardApi,
          fn: midgardApi.getTxDetailsByAddressAsset,
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
      const { data }: AxiosResponse<TxDetails[]> = yield call(
        {
          context: midgardApi,
          fn: midgardApi.getTxDetailsByAsset,
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
