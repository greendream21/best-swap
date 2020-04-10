import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon, notification } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';
import { get as _get } from 'lodash';

import BigNumber from 'bignumber.js';
import { binance, util } from 'asgardex-common';

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

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as binanceActions from '../../../redux/binance/actions';

import {
  ContentWrapper,
  ConfirmModal,
  ConfirmModalContent,
} from './PoolCreate.style';
import { getTickerFormat, emptyString } from '../../../helpers/stringHelper';
import {
  confirmCreatePool,
  getCreatePoolTokens,
  getCreatePoolCalc,
  CreatePoolCalc,
} from '../utils';

import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import { MAX_VALUE } from '../../../redux/app/const';
import TokenDetailLoader from '../../../components/utility/loaders/tokenDetail';
import { RootState } from '../../../redux/store';
import { TxStatus, TxTypes } from '../../../redux/app/types';
import { State as BinanceState } from '../../../redux/binance/types';
import { PriceDataIndex, PoolDataMap } from '../../../redux/midgard/types';
import { Maybe, AssetPair } from '../../../types/bepswap';
import { User, AssetData } from '../../../redux/wallet/types';

import { TokenAmount } from '../../../types/token';
import { tokenAmount } from '../../../helpers/tokenHelper';
import { AssetDetail } from '../../../types/generated/midgard';
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

class PoolCreate extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dragReset: true,
      openPrivateModal: false,
      password: emptyString,
      invalidPassword: false,
      validatingPassword: false,
      runeAmount: tokenAmount(0),
      tokenAmount: tokenAmount(0),
      fR: 1,
      fT: 1,
    };
  }

  componentDidMount() {
    const {
      getPools,
      getPoolAddress,
      getBinanceMarkets,
      getBinanceTokens,
    } = this.props;

    getPools();
    getPoolAddress();
    this.getStakerData();
    getBinanceTokens();
    getBinanceMarkets();
  }

  componentWillUnmount() {
    const { resetTxStatus } = this.props;
    resetTxStatus();
  }

  getData = (): CreatePoolCalc => {
    const { symbol, poolAddress, priceIndex } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    const runePrice = util.validBNOrZero(priceIndex?.RUNE);

    return getCreatePoolCalc({
      tokenSymbol: symbol,
      poolAddress,
      runeAmount,
      runePrice,
      tokenAmount,
    });
  };

  getStakerData = () => {
    const { getStakerPoolData, symbol, user } = this.props;

    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  };

  handleChangePassword = (password: string) => {
    this.setState({
      password,
      invalidPassword: false,
    });
  };

  handleChangeTokenAmount = (tokenName: string) => (amount: BigNumber) => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

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

    const balance = tokenName === 'rune' ? fR : fT;

    // Fine tuning of amout by using "adjust balance" slider
    // This slider has been remove, but will come back in the future
    const totalAmount: BigNumber = sourceAsset.assetValue
      .amount()
      .multipliedBy(balance);

    const newValue = tokenAmount(amount);
    if (tokenName === 'rune') {
      if (totalAmount.isLessThan(newValue.amount())) {
        this.setState({
          runeAmount: tokenAmount(totalAmount),
        });
      } else {
        this.setState({
          runeAmount: newValue,
        });
      }
    } else if (totalAmount.isLessThan(newValue.amount())) {
      this.setState({
        tokenAmount: tokenAmount(totalAmount),
      });
    } else {
      this.setState({
        tokenAmount: newValue,
      });
    }
  };

  handleSelectTokenAmount = (tokenName: string) => (amount: number) => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

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

    const balance = tokenName === 'rune' ? fR : fT;
    const totalAmount = selectedToken.assetValue.amount();
    // Fine tuning of amout by using "adjust balance" slider
    // This slider has been remove, but will come back in the future
    // formula ((totalAmount * amount) / 100) * balance;
    const newValueBN = totalAmount
      .multipliedBy(amount)
      .div(100)
      .multipliedBy(balance);
    const newValue = tokenAmount(newValueBN);

    if (tokenName === 'rune') {
      this.setState({
        runeAmount: newValue,
      });
    } else {
      this.setState({
        tokenAmount: newValue,
      });
    }
  };

  handleCreatePool = () => {
    const { user } = this.props;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;
    const { runeAmount, tokenAmount } = this.state;

    if (!wallet) {
      return;
    }

    if (
      runeAmount.amount().isLessThanOrEqualTo(0) ||
      tokenAmount.amount().isLessThanOrEqualTo(0)
    ) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
      });
      this.handleCloseModal();
      this.setState({
        dragReset: true,
      });
      return;
    }

    if (keystore) {
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmCreate();
    }
  };

  handleConfirmCreate = async () => {
    const { user, setTxHash } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    if (user) {
      // start timer modal
      this.handleStartTimer();
      const bncClient = await binance.client(BINANCE_NET);
      try {
        const { poolAddress, tokenSymbol } = this.getData();
        const { result } = await confirmCreatePool({
          bncClient,
          wallet: user.wallet,
          runeAmount,
          tokenAmount,
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
        });
        this.handleCloseModal();
        this.setState({
          dragReset: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleOpenPrivateModal = () => {
    this.setState({
      password: emptyString,
      invalidPassword: false,
      openPrivateModal: true,
    });
  };

  handleCancelPrivateModal = () => {
    this.setState({
      openPrivateModal: false,
      dragReset: true,
    });
  };

  handleConfirmPassword = async () => {
    const { user } = this.props;
    const { password } = this.state;

    if (user) {
      this.setState({ validatingPassword: true });
      // Short delay to render latest state changes of `validatingPassword`
      await util.delay(200);

      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(
          user.keystore,
          password,
        );
        const bncClient = await binance.client(BINANCE_NET);
        await bncClient.setPrivateKey(privateKey);
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          binance.getPrefix(BINANCE_NET),
        );
        if (user.wallet === address) {
          this.handleConfirmCreate();
        }

        this.setState({
          validatingPassword: false,
          openPrivateModal: false,
        });
      } catch (error) {
        this.setState({
          validatingPassword: false,
          invalidPassword: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleSelectTraget = (asset: string) => {
    const URL = `/pool/${asset}/new`;

    this.props.history.push(URL);
  };

  handleStartTimer = () => {
    const { resetTxStatus } = this.props;
    resetTxStatus({
      type: TxTypes.CREATE,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(false);
  };

  handleChangeTxValue = () => {
    const { countTxTimerValue } = this.props;
    // ATM we just count a `quarter` w/o any other checks
    // See https://gitlab.com/thorchain/bepswap/bepswap-web-ui/issues/281
    countTxTimerValue(25);
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });
  };

  handleFinishTx = () => {
    notification.open({
      message: 'Pool Created Successfully!',
      description:
        'It may take a few moments until a new pool appears in the pool list!',
    });

    this.props.history.push('/pools');
  };

  renderAssetView = () => {
    const { symbol, priceIndex, basePriceAsset, assetData, pools } = this.props;

    const {
      runeAmount,
      tokenAmount,
      dragReset,
      openPrivateModal,
      invalidPassword,
      validatingPassword,
      password,
    } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = util.validBNOrZero(priceIndex?.RUNE);
    const tokensData = getCreatePoolTokens(assetData, pools);
    // AssetDetail[] -> AssetPair[]
    const coinDardData = tokensData.map<AssetPair>((detail: AssetDetail) => ({
      asset: detail.asset || '',
    }));

    const tokenPrice = priceIndex[target.toUpperCase()] || 0;

    const { poolPrice, depth, share } = this.getData();

    const poolAttrs = [
      {
        key: 'price',
        title: 'Pool Price',
        value: `${basePriceAsset} ${util.formatBN(poolPrice)}`,
      },
      {
        key: 'depth',
        title: 'Pool Depth',
        value: `${basePriceAsset} ${util.formatBN(depth)}`,
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
            onChange={this.handleChangeTokenAmount('rune')}
            onSelect={this.handleSelectTokenAmount('rune')}
            withSelection
          />
          <CoinCard
            asset={target}
            assetData={coinDardData}
            amount={tokenAmount}
            price={tokenPrice}
            priceIndex={priceIndex}
            unit={basePriceAsset}
            onChangeAsset={this.handleSelectTraget}
            onChange={this.handleChangeTokenAmount(target)}
            onSelect={this.handleSelectTokenAmount(target)}
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
              onConfirm={this.handleCreatePool}
              onDrag={this.handleDrag}
            />
          </div>
        </div>
        <PrivateModal
          visible={openPrivateModal}
          validatingPassword={validatingPassword}
          invalidPassword={invalidPassword}
          password={password}
          onChangePassword={this.handleChangePassword}
          onOk={this.handleConfirmPassword}
          onCancel={this.handleCancelPrivateModal}
        />
      </div>
    );
  };

  renderTokenDetails = () => {
    const {
      symbol,
      binanceData: { tokenList, marketList },
    } = this.props;
    const target = getTickerFormat(symbol);

    const title = 'TOKEN DETAILS';

    const binanceToken = tokenList.find(token => token.symbol === symbol);
    const binanceMarket = marketList.find(
      market => market.base_asset_symbol === symbol,
    );

    const token = binanceToken?.name ?? target;
    const ticker = binanceToken?.original_symbol ?? target;
    const totalSupply = util.bnOrZero(binanceToken?.total_supply);
    const marketPrice = util.bnOrZero(binanceMarket?.list_price);

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
            {!binanceToken && <TokenDetailLoader />}
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
                  value={`${util.formatBNCurrency(marketPrice)}`}
                  direction="horizontal"
                />
                <Status
                  title="Total Supply"
                  value={util.formatBN(totalSupply)}
                  direction="horizontal"
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  renderStakeModalContent = () => {
    const {
      txStatus: { status, value, startTime, hash },
      symbol,
      priceIndex,
      basePriceAsset,
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);
    const runePrice = util.validBNOrZero(priceIndex?.RUNE);

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
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="coin-data-wrapper">
            <StepBar size={50} />
            <div className="coin-data-container">
              <CoinData
                data-test="stakeconfirm-coin-data-source"
                asset={source}
                assetValue={runeAmount}
                price={runeAmount.amount().multipliedBy(runePrice)}
                priceUnit={basePriceAsset}
              />
              <CoinData
                data-test="stakeconfirm-coin-data-target"
                asset={target}
                assetValue={tokenAmount}
                price={util.bn(0)}
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
                  onClick={this.handleFinishTx}
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

  render() {
    const { txStatus } = this.props;

    const openCreateModal = txStatus.type === 'create' ? txStatus.modal : false;
    const completed = txStatus.value !== null && !txStatus.status;
    const modalTitle = !completed ? 'CREATING POOL' : 'POOL CREATED';
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    return (
      <ContentWrapper className="pool-new-wrapper" transparent>
        <Row className="pool-new-row">
          <Col className="token-details-view" span={24} lg={8}>
            {this.renderTokenDetails()}
          </Col>
          <Col className="add-asset-view" span={24} lg={16}>
            {this.renderAssetView()}
          </Col>
        </Row>
        <ConfirmModal
          title={modalTitle}
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openCreateModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderStakeModalContent()}
        </ConfirmModal>
      </ContentWrapper>
    );
  }
}

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
)(PoolCreate) as React.ComponentClass<ComponentProps, State>;
