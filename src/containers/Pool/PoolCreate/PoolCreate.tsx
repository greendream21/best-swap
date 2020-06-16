import React, { useState, useCallback, useEffect } from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { Row, Col, notification, Spin } from 'antd';
import { FullscreenExitOutlined, CloseOutlined } from '@ant-design/icons';
import { crypto } from '@binance-chain/javascript-sdk';
import { get as _get } from 'lodash';

import BigNumber from 'bignumber.js';
import {
  client as binanceClient,
  getPrefix,
} from '@thorchain/asgardex-binance';
import {
  validBNOrZero,
  formatBN,
  bnOrZero,
  formatBNCurrency,
  delay,
} from '@thorchain/asgardex-util';

import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import CoinIcon from '../../../components/uielements/coins/coinIcon';
import CoinCard from '../../../components/uielements/coins/coinCard';
import Drag from '../../../components/uielements/drag';
import { greyArrowIcon } from '../../../components/icons';
import TxTimer from '../../../components/uielements/txTimer';
import StepBar from '../../../components/uielements/stepBar';
import CoinData from '../../../components/uielements/coins/coinData';
import PrivateModal from '../../../components/modals/privateModal';
import { getAppContainer } from '../../../helpers/elementHelper';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as binanceActions from '../../../redux/binance/actions';

import {
  ContentWrapper,
  ConfirmModal,
  ConfirmModalContent,
  LoaderWrapper,
} from './PoolCreate.style';
import { getTickerFormat } from '../../../helpers/stringHelper';
import {
  confirmCreatePool,
  getCreatePoolTokens,
  getCreatePoolCalc,
  CreatePoolCalc,
} from '../utils';

import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import { MAX_VALUE } from '../../../redux/app/const';
import { RootState } from '../../../redux/store';
import { TxStatus, TxTypes } from '../../../redux/app/types';
import { State as BinanceState } from '../../../redux/binance/types';
import { PriceDataIndex, PoolDataMap } from '../../../redux/midgard/types';
import { Maybe, AssetPair } from '../../../types/bepswap';
import { User, AssetData } from '../../../redux/wallet/types';

import { BINANCE_NET } from '../../../env';

type ComponentProps = {
  symbol: string;
};

type ConnectedProps = {
  assetData: AssetData[];
  pools: string[];
  poolAddress: string;
  poolData: PoolDataMap;
  user: Maybe<User>;
  basePriceAsset: string;
  priceIndex: PriceDataIndex;
  getPools: typeof midgardActions.getPools;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  getBinanceTokens: typeof binanceActions.getBinanceTokens;
  getBinanceMarkets: typeof binanceActions.getBinanceMarkets;
  binanceData: BinanceState;
  history: H.History;
  txStatus: TxStatus;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  resetTxStatus: typeof appActions.resetTxStatus;
  setTxHash: typeof appActions.setTxHash;
};

type Props = ComponentProps & ConnectedProps;

type State = {
  dragReset: boolean;
  openPrivateModal: boolean;
  password: string;
  invalidPassword: boolean;
  validatingPassword: boolean;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  fR: number; // fine tune balance of RUNE (set by "adjust balance" slider, which will come back in the future)
  fT: number; // fine tuning balance of token (set by "adjust balance" slider, which will come back in the future)
};

const PoolCreate: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    symbol,
    user,
    poolAddress,
    priceIndex,
    basePriceAsset,
    assetData,
    binanceData,
    txStatus,
    pools,
    getPools,
    getPoolAddress,
    getBinanceMarkets,
    getBinanceTokens,
    getStakerPoolData,
    resetTxStatus,
    setTxTimerModal,
    setTxTimerStatus,
    setTxHash,
    countTxTimerValue,
  } = props;

  const history = useHistory();

  const [dragReset, setDragReset] = useState(true);
  const [openPrivateModal, setOpenPrivateModal] = useState(false);
  const [password, setPassword] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [validatingPassword, setValidatingPassword] = useState(false);

  const [runeAmount, setRuneAmount] = useState<TokenAmount>(tokenAmount(0));
  const [targetAmount, setTargetAmount] = useState<TokenAmount>(tokenAmount(0));

  const getStakerData = useCallback(() => {
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  }, [user, symbol, getStakerPoolData]);

  useEffect(() => {
    getPools();
    getPoolAddress();
    getBinanceTokens();
    getBinanceMarkets();
    getStakerData();

    return () => {
      resetTxStatus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = useCallback((): CreatePoolCalc => {
    const runePrice = validBNOrZero(priceIndex?.RUNE);

    return getCreatePoolCalc({
      tokenSymbol: symbol,
      poolAddress,
      runeAmount,
      runePrice,
      tokenAmount: targetAmount,
    });
  }, [symbol, poolAddress, priceIndex, runeAmount, targetAmount]);

  const handleChangePassword = useCallback(
    (password: string) => {
      setPassword(password);
      setInvalidPassword(false);
    },
    [setPassword, setInvalidPassword],
  );

  const handleStartTimer = useCallback(() => {
    resetTxStatus({
      type: TxTypes.CREATE,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  }, [resetTxStatus]);

  const handleEndTxTimer = useCallback(() => {
    setTxTimerStatus(false);
    setDragReset(true);
  }, [setTxTimerStatus, setDragReset]);

  const handleChangeTxValue = () => {
    // ATM we just count a `quarter` w/o any other checks
    // See https://gitlab.com/thorchain/bepswap/bepswap-web-ui/issues/281
    countTxTimerValue(25);
  };

  const handleCloseModal = useCallback(() => {
    setTxTimerModal(false);
    handleEndTxTimer();
  }, [setTxTimerModal, handleEndTxTimer]);

  const handleFinishTx = () => {
    notification.open({
      message: 'Pool Created Successfully!',
      description:
        'It may take a few moments until a new pool appears in the pool list!',
      getContainer: getAppContainer,
    });

    handleCloseModal();
  };

  const handleOpenPrivateModal = () => {
    setPassword('');
    setInvalidPassword(false);
    setOpenPrivateModal(true);
  };

  const handleCancelPrivateModal = useCallback(() => {
    setOpenPrivateModal(false);
    setDragReset(true);
  }, [setOpenPrivateModal, setDragReset]);

  const handleConfirmPassword = async () => {
    if (user) {
      setValidatingPassword(true);
      // Short delay to render latest state changes of `validatingPassword`
      await delay(200);

      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(
          user.keystore,
          password,
        );
        const bncClient = await binanceClient(BINANCE_NET);
        await bncClient.setPrivateKey(privateKey);
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          getPrefix(BINANCE_NET),
        );
        if (user.wallet === address) {
          handleConfirmCreate();
        }

        setValidatingPassword(false);
        setOpenPrivateModal(false);
      } catch (error) {
        setValidatingPassword(false);
        setInvalidPassword(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
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
      // start timer modal
      handleStartTimer();
      const bncClient = await binanceClient(BINANCE_NET);
      try {
        const { poolAddress, tokenSymbol } = getData();
        const { result } = await confirmCreatePool({
          bncClient,
          wallet: user.wallet,
          runeAmount,
          tokenAmount: targetAmount,
          poolAddress,
          tokenSymbol,
        });

        const hash = result && result.length ? result[0].hash : null;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Create Pool Failed',
          description: 'Create Pool information is not valid.',
          getContainer: getAppContainer,
        });
        handleCloseModal();
        setDragReset(true);
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  const handleCreatePool = () => {
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      return;
    }

    if (
      runeAmount.amount().isLessThanOrEqualTo(0) ||
      targetAmount.amount().isLessThanOrEqualTo(0)
    ) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
        getContainer: getAppContainer,
      });
      handleCloseModal();
      setDragReset(true);
      return;
    }

    if (keystore) {
      handleOpenPrivateModal();
    } else if (wallet) {
      handleConfirmCreate();
    }
  };

  const renderAssetView = () => {
    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = validBNOrZero(priceIndex?.RUNE);
    const tokensData = getCreatePoolTokens(assetData, pools);
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

    const { poolPrice, depth, share } = getData();

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
          validatingPassword={validatingPassword}
          invalidPassword={invalidPassword}
          password={password}
          onChangePassword={handleChangePassword}
          onOk={handleConfirmPassword}
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

  const renderStakeModalContent = () => {
    const { status, value, startTime, hash } = txStatus;

    const source = 'rune';
    const target = getTickerFormat(symbol);
    const runePrice = validBNOrZero(priceIndex?.RUNE);

    const totalPrice = runeAmount.amount().multipliedBy(runePrice);

    const completed = hash && !status;
    const txURL = TESTNET_TX_BASE_URL + hash;

    return (
      <ConfirmModalContent>
        <Row className="modal-content">
          <div className="timer-container">
            <TxTimer
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              startTime={startTime}
              onChange={handleChangeTxValue}
              onEnd={handleEndTxTimer}
            />
          </div>
          <div className="coin-data-wrapper">
            <StepBar size={50} />
            <div className="coin-data-container">
              <CoinData
                data-test="stakeconfirm-coin-data-source"
                asset={source}
                assetValue={runeAmount}
                price={totalPrice}
                priceUnit={basePriceAsset}
              />
              <CoinData
                data-test="stakeconfirm-coin-data-target"
                asset={target}
                assetValue={targetAmount}
                price={totalPrice}
                priceUnit={basePriceAsset}
              />
            </div>
          </div>
        </Row>
        <Row className="modal-info-wrapper">
          {completed && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <Button
                  className="view-btn"
                  color="success"
                  onClick={handleFinishTx}
                >
                  FINISH
                </Button>
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  VIEW TRANSACTION
                </a>
              </div>
            </div>
          )}
        </Row>
      </ConfirmModalContent>
    );
  };

  const openCreateModal = txStatus.type === 'create' ? txStatus.modal : false;
  const completed = txStatus.value !== null && !txStatus.status;
  const modalTitle = !completed ? 'CREATING POOL' : 'POOL CREATED';
  const coinCloseIconType = txStatus.status ? (
    <FullscreenExitOutlined style={{ color: '#fff' }} />
  ) : (
    <CloseOutlined style={{ color: '#fff' }} />
  );

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
      <ConfirmModal
        title={modalTitle}
        closeIcon={coinCloseIconType}
        visible={openCreateModal}
        footer={null}
        onCancel={handleCloseModal}
      >
        {renderStakeModalContent()}
      </ConfirmModal>
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
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      binanceData: state.Binance,
      txStatus: state.App.txStatus,
    }),
    {
      getPools: midgardActions.getPools,
      getPoolAddress: midgardActions.getPoolAddress,
      getStakerPoolData: midgardActions.getStakerPoolData,
      getBinanceTokens: binanceActions.getBinanceTokens,
      getBinanceMarkets: binanceActions.getBinanceMarkets,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxTimerStatus: appActions.setTxTimerStatus,
      countTxTimerValue: appActions.countTxTimerValue,
      resetTxStatus: appActions.resetTxStatus,
      setTxHash: appActions.setTxHash,
    },
  ),
  withRouter,
)(PoolCreate);
