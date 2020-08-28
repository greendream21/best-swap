import React, { useState, useCallback } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Row, Col, Spin } from 'antd';
import { get as _get } from 'lodash';

import BigNumber from 'bignumber.js';
import { TransferResult } from '@thorchain/asgardex-binance';
import {
  bn,
  validBNOrZero,
  formatBN,
  bnOrZero,
  formatBNCurrency,
} from '@thorchain/asgardex-util';
import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import { bncClient } from '../../env';

import Label from '../../components/uielements/label';
import Status from '../../components/uielements/status';
import CoinIcon from '../../components/uielements/coins/coinIcon';
import CoinCard from '../../components/uielements/coins/coinCard';
import Drag from '../../components/uielements/drag';
import { greyArrowIcon } from '../../components/icons';
import PrivateModal from '../../components/modals/privateModal';

import * as appActions from '../../redux/app/actions';
import * as midgardActions from '../../redux/midgard/actions';

import { ContentWrapper, LoaderWrapper } from './PoolCreate.style';
import { getTickerFormat } from '../../helpers/stringHelper';
import {
  createPoolRequest,
  getAvailableTokensToCreate,
} from '../../helpers/utils/poolUtils';

import { RootState } from '../../redux/store';
import { TxStatus, TxTypes } from '../../redux/app/types';
import { State as BinanceState } from '../../redux/binance/types';
import { PriceDataIndex } from '../../redux/midgard/types';
import { Maybe, AssetPair, FixmeType } from '../../types/bepswap';
import { User, AssetData } from '../../redux/wallet/types';

import showNotification from '../../components/uielements/notification';
import { stakeRequestUsingWalletConnect } from '../../helpers/utils/trustwalletUtils';
import { CONFIRM_DISMISS_TIME } from '../../settings/constants';
import { RUNE_SYMBOL } from '../../settings/assetData';

type Props = {
  assetData: AssetData[];
  pools: string[];
  poolAddress: string;
  user: Maybe<User>;
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  binanceData: BinanceState;
  history: H.History;
  txStatus: TxStatus;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  resetTxStatus: typeof appActions.resetTxStatus;
  setTxHash: typeof appActions.setTxHash;
};

const PoolCreate: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    user,
    poolAddress,
    priceIndex,
    basePriceAsset,
    assetData,
    binanceData,
    pools,
    resetTxStatus,
    setTxTimerModal,
    setTxHash,
  } = props;

  const [dragReset, setDragReset] = useState(true);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);

  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));

  const history = useHistory();
  const { symbol = '' } = useParams();

  const handleStartTimer = () => {
    resetTxStatus({
      type: TxTypes.CREATE,
      value: 0,
      modal: true,
      status: true,
      startTime: Date.now(),
      txData: {
        sourceAsset: RUNE_SYMBOL,
        targetAsset: symbol,
        sourceAmount: runeAmount,
        targetAmount,
      },
    });

    // dismiss modal after 1s
    setTimeout(() => {
      setTxTimerModal(false);
      setDragReset(true);
    }, CONFIRM_DISMISS_TIME);
  };

  const handleOpenPrivateModal = useCallback(() => {
    setOpenPrivateModal(true);
  }, [setOpenPrivateModal]);

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

  const handleConfirmTransaction = () => {
    handleConfirmCreate();
    setOpenPrivateModal(false);
  };

  const handleDrag = useCallback(() => {
    setDragReset(false);
  }, [setDragReset]);

  const handleSelectTraget = (asset: string) => {
    const URL = `/pool/${asset}/new`;
    history.push(URL);
  };

  const handleChangeTokenAmount = (tokenName: string) => (
    amount: BigNumber,
  ) => {
    const source = getTickerFormat(tokenName);

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === source) {
        return true;
      }
      return false;
    });

    const targetToken = assetData.find(data => {
      const { asset } = data;
      if (asset.toLowerCase() === symbol.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!sourceAsset || !targetToken) {
      return;
    }

    const totalAmount: BigNumber = sourceAsset.assetValue.amount();

    const newValue = tokenAmount(amount);
    if (tokenName === 'rune') {
      if (totalAmount.isLessThan(newValue.amount())) {
        setRuneAmount(tokenAmount(totalAmount));
      } else {
        setRuneAmount(newValue);
      }
    } else if (totalAmount.isLessThan(newValue.amount())) {
      setTargetAmount(tokenAmount(totalAmount));
    } else {
      setTargetAmount(newValue);
    }
  };

  const handleSelectTokenAmount = (tokenName: string) => (amount: number) => {
    const selectedToken = assetData.find(data => {
      const { asset } = data;
      const ticker = getTickerFormat(asset);
      if (ticker === tokenName.toLowerCase()) {
        return true;
      }
      return false;
    });

    const targetToken = assetData.find(data => {
      const { asset } = data;
      if (asset.toLowerCase() === symbol.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!selectedToken || !targetToken) {
      return;
    }

    const totalAmount = selectedToken.assetValue.amount();
    const newValueBN = totalAmount.multipliedBy(amount).div(100);
    const newValue = tokenAmount(newValueBN);

    if (tokenName === 'rune') {
      setRuneAmount(newValue);
    } else {
      setTargetAmount(newValue);
    }
  };

  const handleConfirmCreate = async () => {
    if (user) {
      try {
        let response: TransferResult | FixmeType;

        if (user.type === 'walletconnect') {
          response = await stakeRequestUsingWalletConnect({
            walletConnect: user.walletConnector,
            bncClient,
            walletAddress: user.wallet,
            runeAmount,
            assetAmount: targetAmount,
            poolAddress,
            symbol,
          });
        } else {
          response = await createPoolRequest({
            bncClient,
            wallet: user.wallet,
            runeAmount,
            tokenAmount: targetAmount,
            poolAddress,
            tokenSymbol: symbol,
          });
        }

        const result = response?.result;
        const hash = result && result.length ? result[0].hash : null;
        if (hash) {
          setTxHash(hash);

          // start timer modal
          handleStartTimer();
        }
      } catch (error) {
        showNotification({
          type: 'error',
          message: 'Create Pool Failed',
          description: 'Create Pool information is not valid.',
        });
        resetTxStatus();
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const handleCreatePool = () => {
    const wallet = user ? user.wallet : null;

    // TODO: display wallet alert modal to connect wallet
    if (!wallet) {
      return;
    }

    if (
      runeAmount.amount().isLessThanOrEqualTo(0) ||
      targetAmount.amount().isLessThanOrEqualTo(0)
    ) {
      showNotification({
        type: 'error',
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
      });
      setDragReset(true);
      return;
    }

    if (wallet) {
      handleOpenPrivateModal();
    }
  };

  const renderAssetView = () => {
    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);
    const tokensData = getAvailableTokensToCreate(assetData, pools);
    // AssetData[] -> AssetPair[]
    const coinDardData = tokensData.map<AssetPair>((detail: AssetData) => ({
      asset: detail.asset || '',
    }));

    const tokenPrice = validBNOrZero(
      runeAmount
        .amount()
        .multipliedBy(runePrice)
        .dividedBy(targetAmount.amount()),
    );

    // formula: (runeAmount / targetAmount) * runePrice)
    const poolPrice = targetAmount.amount().isGreaterThan(0)
      ? runeAmount
          .amount()
          .div(targetAmount.amount())
          .multipliedBy(runePrice)
      : bn(0);

    // formula: runePrice * runeAmount
    const depth = runeAmount.amount().multipliedBy(runePrice);

    // when creating a new pool, share is 100 %
    const share = 100;

    const poolAttrs = [
      {
        key: 'price',
        title: 'Pool Price',
        value: `${basePriceAsset} ${formatBN(poolPrice)}`,
      },
      {
        key: 'depth',
        title: 'Pool Depth',
        value: `${basePriceAsset} ${formatBN(depth)}`,
      },
      { key: 'share', title: 'Your Share', value: `${share}%` },
    ];

    return (
      <div className="create-detail-wrapper">
        <Label className="label-title" size="normal" weight="bold">
          ADD ASSETS
        </Label>
        <Label className="label-description" size="normal">
          Select the maximum deposit to stake.
        </Label>
        <Label className="label-no-padding" size="normal">
          Note: Pools always have RUNE as the base asset.
        </Label>
        <div className="stake-card-wrapper">
          <CoinCard
            asset={source}
            amount={runeAmount}
            price={runePrice}
            priceIndex={priceIndex}
            unit={basePriceAsset}
            onChange={handleChangeTokenAmount('rune')}
            onSelect={handleSelectTokenAmount('rune')}
            withSelection
          />
          <CoinCard
            asset={target}
            assetData={coinDardData}
            amount={targetAmount}
            price={tokenPrice}
            priceIndex={priceIndex}
            unit={basePriceAsset}
            onChangeAsset={handleSelectTraget}
            onChange={handleChangeTokenAmount(target)}
            onSelect={handleSelectTokenAmount(target)}
            withSelection
            withSearch
          />
        </div>
        <div className="create-pool-info-wrapper">
          <div className="create-token-detail">
            <div className="info-status-wrapper">
              {poolAttrs.map(info => {
                return <Status className="share-info-status" {...info} />;
              })}
            </div>
            <Drag
              title="Drag to create pool"
              source="blue"
              target="confirm"
              reset={dragReset}
              onConfirm={handleCreatePool}
              onDrag={handleDrag}
            />
          </div>
        </div>
        <PrivateModal
          visible={openPrivateModal}
          onOk={handleConfirmTransaction}
          onCancel={handleCancelPrivateModal}
        />
      </div>
    );
  };

  const renderTokenDetails = () => {
    const { tokenList, marketList } = binanceData;

    const target = getTickerFormat(symbol);
    const title = 'TOKEN DETAILS';

    const binanceToken = tokenList.find(token => token.symbol === symbol);
    const binanceMarket = marketList.find(
      market => market.base_asset_symbol === symbol,
    );

    const token = binanceToken?.name ?? target;
    const ticker = binanceToken?.original_symbol ?? target;
    const totalSupply = bnOrZero(binanceToken?.total_supply);
    const marketPrice = bnOrZero(binanceMarket?.list_price);

    return (
      <div className="token-detail-container">
        <Label className="label-title" size="normal" weight="bold">
          {title}
        </Label>
        {!target && (
          <div className="left-arrow-wrapper">
            <img src={greyArrowIcon} alt="grey-arrow" />
          </div>
        )}
        {target && (
          <div className="new-token-detail-wrapper">
            <div className="new-token-coin">
              <CoinIcon type={target} />
            </div>
            {!binanceToken && (
              <LoaderWrapper>
                <Spin />
              </LoaderWrapper>
            )}
            {binanceToken && (
              <>
                <Label className="token-name" size="normal">
                  {String(token).toUpperCase()}
                </Label>
                <Status
                  title="Ticker"
                  value={ticker.toUpperCase()}
                  direction="horizontal"
                />
                <Status
                  title="Market Price"
                  value={`${formatBNCurrency(marketPrice)}`}
                  direction="horizontal"
                />
                <Status
                  title="Total Supply"
                  value={formatBN(totalSupply)}
                  direction="horizontal"
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ContentWrapper className="pool-new-wrapper" transparent>
      <Row className="pool-new-row">
        <Col className="token-details-view" span={24} lg={8}>
          {renderTokenDetails()}
        </Col>
        <Col className="add-asset-view" span={24} lg={16}>
          {renderAssetView()}
        </Col>
      </Row>
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      pools: state.Midgard.pools,
      poolAddress: state.Midgard.poolAddress,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      binanceData: state.Binance,
      txStatus: state.App.txStatus,
    }),
    {
      getStakerPoolData: midgardActions.getStakerPoolData,
      setTxTimerModal: appActions.setTxTimerModal,
      resetTxStatus: appActions.resetTxStatus,
      setTxHash: appActions.setTxHash,
    },
  ),
  withRouter,
)(PoolCreate);
