import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Icon, notification } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import { crypto } from '@binance-chain/javascript-sdk';
import { get as _get } from 'lodash';

import bncClient from '../../../clients/binance';
import { withBinanceTransferWS } from '../../../HOC/websocket/WSBinance';

import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';
import Modal from '../../../components/uielements/modal';
import Button from '../../../components/uielements/button';
import WalletButton from '../../../components/uielements/walletButton';
import PrivateModal from '../../../components/modals/privateModal';

import * as appActions from '../../../redux/app/actions';
import * as midgardActions from '../../../redux/midgard/actions';
import * as walletActions from '../../../redux/wallet/actions';

import {
  ContentWrapper,
  Tabs,
  ConfirmModal,
  ConfirmModalContent,
} from './PoolStake.style';
import {
  WithdrawResultParams,
  confirmStake,
  confirmWithdraw,
  getCalcResult,
  CalcResult,
  getPoolData,
  PoolData,
  withdrawResult,
} from '../utils';
import {
  getUserFormat,
  getTickerFormat,
  getFixedNumber,
  emptyString,
} from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import TokenInfo from '../../../components/uielements/tokens/tokenInfo';
import StepBar from '../../../components/uielements/stepBar';
import { MAX_VALUE } from '../../../redux/app/const';
import { getHashFromTransfer } from '../../../helpers/binance';
import { delay } from '../../../helpers/asyncHelper';
import { RootState } from '../../../redux/store';
import { User, AssetData } from '../../../redux/wallet/types';
import { FixmeType, Maybe, Nothing, AssetPair } from '../../../types/bepswap';
import { TxStatus, TxTypes } from '../../../redux/app/types';
import {
  AssetDetailMap,
  StakerPoolData,
  PoolDataMap,
  PriceDataIndex,
} from '../../../redux/midgard/types';
import {
  StakersAssetData,
  StakersAddressData,
} from '../../../types/generated/midgard';
import { getAssetFromString } from '../../../redux/midgard/utils';

const { TabPane } = Tabs;

type ComponentProps = {
  symbol: string;
  info: FixmeType; // PropTypes.object,
  history: H.History;
  wsTransfers: FixmeType[]; // PropTypes.array.isRequired,
};

type ConnectedProps = {
  history: H.History;
  txStatus: TxStatus;
  user: Maybe<User>;
  assetData: AssetData[];
  poolAddress: Maybe<string>;
  poolData: PoolDataMap;
  assets: AssetDetailMap;
  stakerPoolData: StakerPoolData;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  poolLoading: boolean;
  stakerPoolDataLoading: boolean;
  getPools: typeof midgardActions.getPools;
  getPoolAddress: typeof midgardActions.getPoolAddress;
  getStakerPoolData: typeof midgardActions.getStakerPoolData;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  countTxTimerValue: typeof appActions.countTxTimerValue;
  setTxTimerValue: typeof appActions.setTxTimerValue;
  setTxHash: typeof appActions.setTxHash;
  resetTxStatus: typeof appActions.resetTxStatus;
  refreshStake: typeof walletActions.refreshStake;
};

type Props = ComponentProps & ConnectedProps;

type State = {
  dragReset: boolean;
  openWalletAlert: boolean;
  openPrivateModal: boolean;
  password: string;
  invalidPassword: boolean;
  validatingPassword: boolean;
  runeAmount: number;
  tokenAmount: number;
  fR: number;
  fT: number;
  runeTotal: number;
  tokenTotal: number;
  runePercent: number;
  tokenPercent: number;
  txResult: boolean;
  widthdrawPercentage: number;
};

type StakeData = {
  fromAddr: string;
  toAddr: string;
  toToken: string;
  runeAmount: number;
  tokenAmount: number;
};

type WithdrawData = {
  runeValue: number;
  tokenValue: number;
  tokenPrice: number;
  percentage: number;
};

class PoolStake extends React.Component<Props, State> {
  hash: Maybe<string> = Nothing;

  type: Maybe<TxTypes> = Nothing;

  stakeData: Maybe<StakeData> = Nothing;

  withdrawData: Maybe<WithdrawData> = Nothing;

  constructor(props: Props) {
    super(props);
    this.state = {
      dragReset: true,
      openWalletAlert: false,
      openPrivateModal: false,
      password: emptyString,
      invalidPassword: false,
      validatingPassword: false,
      runeAmount: 0,
      tokenAmount: 0,
      fR: 1,
      fT: 1,
      runeTotal: 0,
      tokenTotal: 0,
      runePercent: 0,
      tokenPercent: 0,
      txResult: false,
      widthdrawPercentage: 0,
    };
  }

  componentDidMount() {
    const { getPoolAddress, getPools } = this.props;

    getPoolAddress();
    getPools();
    this.getStakerInfo();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      wsTransfers,
      user,
      txStatus: { type, hash },
      refreshStake,
    } = this.props;
    const { txResult } = this.state;
    const length = wsTransfers.length;
    const wallet = user ? user.wallet : null;

    if (
      length !== prevProps.wsTransfers.length &&
      length > 0 &&
      hash !== undefined &&
      !txResult
    ) {
      const lastTx = wsTransfers[length - 1];
      const transferHash = getHashFromTransfer(lastTx);

      if (wallet) {
        // Currently we do a different handling for `stake` + `withdraw`
        // See https://thorchain.slack.com/archives/CL5B4M4BC/p1579816500171200
        if (type === TxTypes.STAKE) {
          if (transferHash === hash) {
            // Just refresh stakes after update
            refreshStake(wallet);
          }
        }

        if (type === TxTypes.WITHDRAW) {
          const txResult = withdrawResult({
            tx: lastTx,
            hash,
          } as WithdrawResultParams);

          if (txResult) {
            this.setState({
              txResult: true,
            });
            // refresh stakes after update
            refreshStake(wallet);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    const { resetTxStatus } = this.props;
    resetTxStatus();
  }

  getStakerInfo = () => {
    const { getStakerPoolData, symbol, user } = this.props;
    if (user) {
      getStakerPoolData({ asset: symbol, address: user.wallet });
    }
  };

  isLoading = () => {
    const { poolLoading, stakerPoolDataLoading } = this.props;

    return poolLoading && stakerPoolDataLoading;
  };

  handleChangePassword = (password: string) => {
    this.setState({
      password,
      invalidPassword: false,
    });
  };

  handleChangeTokenAmount = (tokenName: string) => (amount: number) => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    let newValue;
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

    const totalAmount = !sourceAsset ? 0 : sourceAsset.assetValue * balance;
    const totalTokenAmount = targetToken.assetValue * balance || 0;

    if (tokenName === 'rune') {
      newValue = amount;
      const data = this.getData();
      const ratio = data?.ratio ?? 1;
      const tokenValue = newValue * ratio;
      const tokenAmount =
        tokenValue <= totalTokenAmount ? tokenValue : totalTokenAmount;

      if (totalAmount < newValue) {
        this.setState({
          runeAmount: totalAmount,
          tokenAmount,
          runePercent: 100,
        });
      } else {
        this.setState({
          runeAmount: newValue,
          tokenAmount,
        });
      }
    } else {
      newValue = amount;

      if (totalAmount < newValue) {
        this.setState({
          tokenAmount: totalAmount,
          tokenPercent: 100,
        });
      } else {
        this.setState({
          tokenAmount: newValue,
        });
      }
    }
  };

  handleChangePercent = (token: string) => (amount: number) => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    const selectedToken = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === token.toLowerCase()) {
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

    const balance = token === 'rune' ? fR : fT;
    const totalAmount = selectedToken.assetValue || 0;
    const totalTokenAmount = targetToken.assetValue || 0;
    const value = ((totalAmount * amount) / 100) * balance;

    if (token === 'rune') {
      const data = this.getData();
      const ratio = data?.ratio ?? 1;
      const tokenValue = value * ratio;
      const tokenAmount =
        tokenValue <= totalTokenAmount ? tokenValue : totalTokenAmount;

      this.setState({
        runeAmount: value,
        tokenAmount,
        runePercent: amount,
        runeTotal: totalAmount,
      });
    } else {
      this.setState({
        tokenAmount: value,
        tokenPercent: amount,
        tokenTotal: totalAmount,
      });
    }
  };

  handleChangeBalance = (balance: number) => {
    const { runePercent, tokenPercent, runeTotal, tokenTotal } = this.state;
    const fR = balance <= 100 ? 1 : (200 - balance) / 100;
    const fT = balance >= 100 ? 1 : balance / 100;

    if (runePercent > 0) {
      const runeAmount = ((runeTotal * runePercent) / 100) * fR;
      this.setState({
        runeAmount,
      });
    }
    if (tokenPercent > 0) {
      const tokenAmount = ((tokenTotal * tokenPercent) / 100) * fT;
      this.setState({
        tokenAmount,
      });
    }
    this.setState({
      fR,
      fT,
    });
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  getData = (): CalcResult => {
    const { symbol, poolData, priceIndex, poolAddress } = this.props;
    const { runeAmount, tokenAmount } = this.state;
    const runePrice = priceIndex.RUNE;

    const calcResult = getCalcResult(
      symbol,
      poolData,
      poolAddress,
      runeAmount,
      runePrice,
      tokenAmount,
    );

    return calcResult;
  };

  handleConfirmStake = async () => {
    const { user, setTxHash } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    if (user) {
      const { wallet } = user;
      this.handleStartTimer(TxTypes.STAKE);

      this.setState({
        txResult: false,
      });

      const data = this.getData();

      try {
        const { result } = await confirmStake({
          bncClient,
          wallet,
          runeAmount,
          tokenAmount,
          poolAddress: data.poolAddress,
          symbolTo: data.symbolTo,
        });
        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Stake Invalid',
          description: 'Stake information is not valid.',
        });
        this.setState({
          dragReset: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleStake = () => {
    const { user } = this.props;
    const { runeAmount, tokenAmount } = this.state;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (Number(runeAmount) <= 0 && Number(tokenAmount) <= 0) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
      });
      this.setState({
        dragReset: true,
      });
      return;
    }

    if (keystore) {
      this.type = TxTypes.STAKE;
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmStake();
    }
  };

  handleConnectWallet = () => {
    this.setState({
      openWalletAlert: false,
    });

    this.props.history.push('/connect');
  };

  hideWalletAlert = () => {
    this.setState({
      openWalletAlert: false,
      dragReset: true,
    });
  };

  handleStartTimer = (type: TxTypes) => {
    const { resetTxStatus } = this.props;
    resetTxStatus({
      type,
      modal: true,
      status: true,
      startTime: Date.now(),
    });
  };

  handleConfirmPassword = async () => {
    const { user } = this.props;
    const { password } = this.state;

    if (user) {
      const { keystore, wallet } = user;

      this.setState({ validatingPassword: true });
      // Short delay to render latest state changes of `validatingPassword`
      await delay(2000);

      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
        await bncClient.setPrivateKey(privateKey);
        const address = crypto.getAddressFromPrivateKey(
          privateKey,
          bncClient.getPrefix(),
        );
        if (wallet && wallet === address) {
          if (this.type === TxTypes.STAKE) {
            this.handleConfirmStake();
          } else if (this.type === TxTypes.WITHDRAW) {
            this.handleConfirmWithdraw();
          }
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

  handleOpenPrivateModal = () => {
    this.setState({
      openPrivateModal: true,
      password: emptyString,
      invalidPassword: false,
    });
  };

  handleCancelPrivateModal = () => {
    this.setState({
      openPrivateModal: false,
      dragReset: true,
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(false);
  };

  handleSelectTraget = (asset: string) => {
    const URL = `/pool/${asset}`;

    this.props.history.push(URL);
  };

  handleWithdraw = () => {
    const { user } = this.props;
    const wallet = user ? user.wallet : null;
    const keystore = user ? user.keystore : null;

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (keystore) {
      this.type = TxTypes.WITHDRAW;
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmWithdraw();
    }
  };

  handleConfirmWithdraw = async () => {
    const { symbol, poolAddress, user, setTxHash } = this.props;
    const { widthdrawPercentage } = this.state;
    const withdrawRate = (widthdrawPercentage || 50) / 100;

    if (user) {
      const { wallet } = user;

      this.handleStartTimer(TxTypes.WITHDRAW);

      this.setState({
        txResult: false,
      });

      try {
        const percent = withdrawRate * 100;
        const { result } = await confirmWithdraw({
          bncClient,
          wallet,
          poolAddress,
          symbol,
          percent,
        });

        const hash = result ? result[0]?.hash ?? null : null;
        if (hash) {
          setTxHash(hash);
        }
      } catch (error) {
        notification.error({
          message: 'Withdraw Invalid',
          description: 'Withdraw information is not valid.',
        });
        this.setState({
          dragReset: true,
        });
        console.error(error); // eslint-disable-line no-console
      }
    }
  };

  handleChangeTxValue = () => {
    const {
      countTxTimerValue,
      setTxTimerValue,
      txStatus: { value, type, hash },
    } = this.props;
    const { txResult } = this.state;

    // Count handling depends on `type`
    if (type === TxTypes.WITHDRAW) {
      // If tx has been confirmed finally,
      // then we jump to last `valueIndex` ...
      if (txResult && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `txResult`) we don't jump to last `indexValue`...
      if (!txResult) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(1);
        }
      }
    }

    if (type === TxTypes.STAKE) {
      // If tx has been sent successfully,
      // we jump to last `valueIndex` ...
      if (hash && value < MAX_VALUE) {
        setTxTimerValue(MAX_VALUE);
      }
      // In other cases (no `hash`) we don't jump to last `indexValue`...
      if (!hash) {
        // ..., but we are still counting
        if (value < 75) {
          // Add a quarter
          countTxTimerValue(25);
        } else if (value >= 75 && value < 95) {
          // With last quarter we just count a little bit to signalize still a progress
          countTxTimerValue(1);
        }
      }
    }
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;
    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });
    // get staker info again after finished
    this.getStakerInfo();
  };

  renderStakeModalContent = (completed: boolean) => {
    const {
      txStatus: { status, value, startTime, hash },
      symbol,
      priceIndex,
      basePriceAsset,
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const Pr = priceIndex.RUNE;
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);
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
                price={Pr * runeAmount}
                priceUnit={basePriceAsset}
              />
              <CoinData
                data-test="stakeconfirm-coin-data-target"
                asset={target}
                assetValue={tokenAmount}
                price={tokenPrice * tokenAmount}
                priceUnit={basePriceAsset}
              />
            </div>
          </div>
        </Row>
        <Row className="modal-info-wrapper">
          {completed && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <Link to="/pools">
                  <Button className="view-btn" color="success">
                    FINISH
                  </Button>
                </Link>
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

  renderWithdrawModalContent = (txSent: boolean, completed: boolean) => {
    const {
      txStatus: { status, value, startTime, hash },
      symbol,
      priceIndex,
      basePriceAsset,
    } = this.props;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = priceIndex.RUNE;
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);
    const txURL = TESTNET_TX_BASE_URL + hash;

    if (!this.withdrawData) {
      // Avoid to render anything if we don't have needed data for calculation
      return <></>;
    } else {
      const { runeValue, tokenValue } = this.withdrawData;

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
                  asset={source}
                  assetValue={runeValue}
                  price={runePrice * runeValue}
                  priceUnit={basePriceAsset}
                />
                <CoinData
                  asset={target}
                  assetValue={tokenValue}
                  price={tokenPrice * tokenValue}
                  priceUnit={basePriceAsset}
                />
              </div>
            </div>
          </Row>
          <Row className="modal-info-wrapper">
            {txSent && (
              <div className="hash-address">
                <div className="copy-btn-wrapper">
                  {completed && (
                    <Link to="/pools">
                      <Button className="view-btn" color="success">
                        FINISH
                      </Button>
                    </Link>
                  )}
                  <a href={txURL} target="_blank" rel="noopener noreferrer">
                    VIEW TRANSACTION
                  </a>
                </div>
              </div>
            )}
          </Row>
        </ConfirmModalContent>
      );
    }
  };

  renderStakeInfo = (poolStats: PoolData) => {
    const { symbol, basePriceAsset } = this.props;
    const source = 'rune';
    const target = getTickerFormat(symbol);
    const loading = this.isLoading();

    const {
      depth,
      volume24,
      volumeAT,
      totalSwaps,
      totalStakers,
      roiAT,
      liqFee,
    } = poolStats;

    const attrs = [
      {
        key: 'depth',
        title: 'Depth',
        value: `${basePriceAsset} ${getUserFormat(depth).toLocaleString()}`,
      },
      {
        key: 'vol24',
        title: '24hr Volume',
        value: `${basePriceAsset} ${getUserFormat(volume24)}`,
      },
      {
        key: 'volAT',
        title: 'All Time Volume',
        value: `${basePriceAsset} ${getUserFormat(volumeAT)}`,
      },
      { key: 'swap', title: 'Total Swaps', value: totalSwaps },
      { key: 'stakers', title: 'Total Stakers', value: totalStakers },
      {
        key: 'roi',
        title: 'All Time RoI',
        value: `${getUserFormat(roiAT)}% pa`,
      },
    ];

    return attrs.map(info => {
      const { title, value, key } = info;

      return (
        <Col className="token-info-card" key={key} xs={12} sm={8} md={6} lg={4}>
          <TokenInfo
            asset={source}
            target={target}
            value={value}
            label={title}
            trend={getFixedNumber(getUserFormat(liqFee))}
            loading={loading}
          />
        </Col>
      );
    });
  };

  renderShareDetail = (
    poolStats: PoolData,
    calcResult: CalcResult,
    stakeData: StakerPoolData,
  ) => {
    const { symbol, priceIndex, basePriceAsset, assets } = this.props;
    const {
      runeAmount,
      tokenAmount,
      runePercent,
      widthdrawPercentage,
      dragReset,
    } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = priceIndex.RUNE;
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);

    const tokensData: AssetPair[] = Object.keys(assets).map(tokenName => {
      const tokenData = assets[tokenName];
      const assetStr = tokenData?.asset;
      const asset = assetStr ? getAssetFromString(assetStr) : null;

      return {
        asset: asset?.symbol ?? '',
      };
    });

    const stakeInfo =
      (stakeData && stakeData[symbol]) ||
      ({
        stakeUnits: 0,
        runeStaked: 0,
        assetStaked: 0,
      } as StakersAddressData);

    const { R, T, poolUnits = 0 } = calcResult;

    // withdraw values
    const withdrawRate = (widthdrawPercentage || 50) / 100;
    const { stakeUnits = 0 } = stakeInfo;

    const value = ((withdrawRate * stakeUnits) / poolUnits) * R;
    const runeValue = getUserFormat(value);
    const tokenValue = getUserFormat(
      ((withdrawRate * stakeUnits) / poolUnits) * T,
    );
    this.withdrawData = {
      runeValue,
      tokenValue,
      tokenPrice,
      percentage: widthdrawPercentage,
    };

    const disableWithdraw = stakeUnits === 0;

    return (
      <div className="share-detail-wrapper">
        <Tabs withBorder>
          <TabPane tab="add" key="add">
            <Row>
              <Col span={24} lg={12}>
                <Label className="label-description" size="normal">
                  Select the maximum deposit to stake.
                </Label>
                <Label className="label-no-padding" size="normal">
                  Note: Pools always have RUNE as the base asset.
                </Label>
              </Col>
            </Row>
            <div className="stake-card-wrapper">
              <div className="coin-card-wrapper">
                <CoinCard
                  inputProps={{ 'data-test': 'stake-coin-input-rune' }}
                  data-test="coin-card-stake-coin-rune"
                  asset={source}
                  amount={runeAmount}
                  price={runePrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChange={this.handleChangeTokenAmount('rune')}
                />
                <Slider
                  value={runePercent}
                  onChange={this.handleChangePercent('rune')}
                  withLabel
                />
              </div>
              <div className="coin-card-wrapper">
                <CoinCard
                  inputProps={{
                    'data-test': 'stake-coin-input-target',
                  }}
                  data-test="coin-card-stake-coin-target"
                  asset={target}
                  assetData={tokensData}
                  amount={tokenAmount}
                  price={tokenPrice}
                  priceIndex={priceIndex}
                  unit={basePriceAsset}
                  onChangeAsset={this.handleSelectTraget}
                  onChange={this.handleChangeTokenAmount(target)}
                  withSearch
                />
              </div>
            </div>
            <div className="stake-share-info-wrapper">
              <div className="share-status-wrapper">
                <Drag
                  title="Drag to stake"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  onConfirm={this.handleStake}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="Withdraw" key="withdraw" disabled={disableWithdraw}>
            <Label className="label-title" size="normal" weight="bold">
              ADJUST WITHDRAWAL
            </Label>
            <Label size="normal">
              Choose from 0 to 100% of how much to withdraw.
            </Label>
            <div className="withdraw-percent-view">
              <Label size="large" color="gray" weight="bold">
                0%
              </Label>
              <Label size="large" color="gray" weight="bold">
                50%
              </Label>
              <Label size="large" color="gray" weight="bold">
                100%
              </Label>
            </div>
            <Slider
              onChange={(value: SliderValue) => {
                this.setState({ widthdrawPercentage: value as number });
              }}
              defaultValue={50}
              max={100}
              min={1}
            />
            <div className="stake-withdraw-info-wrapper">
              <Label className="label-title" size="normal" weight="bold">
                YOU SHOULD RECEIVE
              </Label>
              <div className="withdraw-status-wrapper">
                <div className="withdraw-asset-wrapper">
                  <CoinData
                    asset={source}
                    assetValue={runeValue}
                    price={runeValue * runePrice}
                    priceUnit={basePriceAsset}
                  />
                  <CoinData
                    asset={target}
                    assetValue={tokenValue}
                    price={tokenValue * tokenPrice}
                    priceUnit={basePriceAsset}
                  />
                </div>
              </div>
              <div className="drag-container">
                <Drag
                  title="Drag to withdraw"
                  source="blue"
                  target="confirm"
                  reset={dragReset}
                  onConfirm={this.handleWithdraw}
                  onDrag={this.handleDrag}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  };

  renderYourShare = (calcResult: CalcResult, stakeData: StakerPoolData) => {
    const { symbol, user, priceIndex, basePriceAsset } = this.props;

    const wallet = user ? user.wallet : null;
    const hasWallet = wallet !== null;

    const stakeInfo = (stakeData && stakeData[symbol]) || {
      stakeUnits: 0,
      runeEarned: 0,
      assetEarned: 0,
    };

    const { poolUnits, R, T } = calcResult;
    const source = 'rune';
    const target = getTickerFormat(symbol);

    const runePrice = priceIndex.RUNE;
    const tokenPrice = _get(priceIndex, target.toUpperCase(), 0);

    const { stakeUnits }: StakersAssetData = stakeInfo;
    const loading = this.isLoading() || poolUnits === undefined;

    let poolShare;
    let runeShare;
    let tokensShare;
    if (stakeUnits && poolUnits) {
      poolShare = ((stakeUnits / Number(poolUnits)) * 100).toFixed(2);
      runeShare = getUserFormat((R * stakeUnits) / poolUnits);
      tokensShare = getUserFormat((T * stakeUnits) / poolUnits);
    }
    const runeEarned = getUserFormat(stakeInfo.runeEarned);
    const assetEarned = getUserFormat(stakeInfo.assetEarned);
    const connected = hasWallet;
    const hasStake = hasWallet && stakeUnits !== undefined && stakeUnits > 0;

    return (
      <>
        <div className="your-share-wrapper">
          {!hasWallet && (
            <Label className="label-title" size="normal">
              YOUR SHARE
            </Label>
          )}
          {!hasWallet && (
            <div className="share-placeholder-wrapper">
              <div className="placeholder-icon">
                <Icon type="switcher" />
              </div>
              <Label className="placeholder-label">
                Please connect your wallet.
              </Label>
              <Link to="/connect">
                <WalletButton connected={connected} value={wallet} />
              </Link>
            </div>
          )}
          {hasWallet && stakeUnits === 0 && (
            <div className="share-placeholder-wrapper">
              <div className="placeholder-icon">
                <Icon type="inbox" />
              </div>
              <Label className="placeholder-label">
                You don&apos;t have any shares in this pool.
              </Label>
            </div>
          )}
          {hasStake && (
            <>
              <Label className="share-info-title" size="normal">
                Your total share of the pool
              </Label>
              <div className="your-share-info-wrapper">
                <div className="share-info-row">
                  <div className="your-share-info">
                    <Status
                      title={String(source).toUpperCase()}
                      value={runeShare}
                      loading={loading}
                    />
                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {runeShare
                        ? `${basePriceAsset} ${(runeShare * runePrice).toFixed(
                            2,
                          )}`
                        : ''}
                    </Label>
                  </div>
                  <div className="your-share-info">
                    <Status
                      title={String(target).toUpperCase()}
                      value={tokensShare}
                      loading={loading}
                    />

                    <Label
                      className="your-share-price-label"
                      size="normal"
                      color="gray"
                      loading={loading}
                    >
                      {tokensShare
                        ? `${basePriceAsset} ${(
                            tokensShare * tokenPrice
                          ).toFixed(2)}`
                        : ''}
                    </Label>
                  </div>
                </div>
                <div className="share-info-row">
                  <div className="your-share-info pool-share-info">
                    <Status
                      title="Pool Share"
                      value={`${poolShare}%`}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              {!hasWallet && (
                <Label
                  className="label-title earning-label"
                  size="normal"
                  weight="bold"
                >
                  EARNINGS
                </Label>
              )}
            </>
          )}
        </div>
        {hasStake && (
          <div className="your-share-wrapper">
            <Label className="share-info-title" size="normal">
              Your total earnings from the pool
            </Label>
            <div className="your-share-info-wrapper">
              <div className="share-info-row">
                <div className="your-share-info">
                  <Status
                    title={String(source).toUpperCase()}
                    value={runeEarned}
                    loading={loading}
                  />
                  <Label
                    className="your-share-price-label"
                    size="normal"
                    color="gray"
                    loading={loading}
                  >
                    {basePriceAsset} {(runeEarned * runePrice).toFixed(2)}
                  </Label>
                </div>
                <div className="your-share-info">
                  <Status
                    title={String(target).toUpperCase()}
                    value={assetEarned}
                    loading={loading}
                  />
                  <Label
                    className="your-share-price-label"
                    size="normal"
                    color="gray"
                    loading={loading}
                  >
                    {basePriceAsset} {(assetEarned * tokenPrice).toFixed(2)}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  render() {
    const {
      priceIndex,
      basePriceAsset,
      poolData,
      stakerPoolData,
      txStatus,
      user,
    } = this.props;
    const {
      openPrivateModal,
      openWalletAlert,
      password,
      invalidPassword,
      txResult,
      validatingPassword,
    } = this.state;

    const wallet = user ? user.wallet : null;
    const hasWallet = wallet !== null;

    let { symbol } = this.props;
    symbol = symbol.toUpperCase();
    const poolInfo = poolData[symbol] || {};

    const poolStats = getPoolData('rune', poolInfo, priceIndex, basePriceAsset);

    const calcResult = this.getData();

    const openStakeModal =
      txStatus.type === TxTypes.STAKE ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === TxTypes.WITHDRAW ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    const yourShareSpan = hasWallet ? 8 : 24;

    // stake confirmation modal

    const txSent = txStatus.hash !== undefined;

    // TODO(veado): Completed depending on `txStatus.type`, too (no txResult for `stake` atm)
    const completed =
      txStatus.type === TxTypes.STAKE
        ? txSent && !txStatus.status
        : txResult && !txStatus.status;
    const stakeTitle = !completed ? 'YOU ARE STAKING' : 'YOU STAKED';

    // withdraw confirmation modal

    const withdrawText = !completed ? 'YOU ARE WITHDRAWING' : 'YOU WITHDRAWN';

    return (
      <ContentWrapper className="pool-stake-wrapper" transparent>
        <Row className="stake-info-view">{this.renderStakeInfo(poolStats)}</Row>
        <Row className="share-view">
          <Col className="your-share-view" span={24} lg={yourShareSpan}>
            {this.renderYourShare(calcResult, stakerPoolData)}
          </Col>
          {hasWallet && (
            <Col className="share-detail-view" span={24} lg={16}>
              {this.renderShareDetail(poolStats, calcResult, stakerPoolData)}
            </Col>
          )}
        </Row>
        {hasWallet && (
          <>
            <ConfirmModal
              title={withdrawText}
              closeIcon={
                <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
              }
              visible={openWithdrawModal}
              footer={null}
              onCancel={this.handleCloseModal}
            >
              {this.renderWithdrawModalContent(txSent, completed)}
            </ConfirmModal>
            <ConfirmModal
              title={stakeTitle}
              closeIcon={
                <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
              }
              visible={openStakeModal}
              footer={null}
              onCancel={this.handleCloseModal}
            >
              {this.renderStakeModalContent(completed)}
            </ConfirmModal>
            <PrivateModal
              visible={openPrivateModal}
              validatingPassword={validatingPassword}
              invalidPassword={invalidPassword}
              password={password}
              onChangePassword={this.handleChangePassword}
              onOk={this.handleConfirmPassword}
              onCancel={this.handleCancelPrivateModal}
            />
            <Modal
              title="PLEASE ADD WALLET"
              visible={openWalletAlert}
              onOk={this.handleConnectWallet}
              onCancel={this.hideWalletAlert}
              okText="ADD WALLET"
            >
              Please add a wallet to stake.
            </Modal>
          </>
        )}
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    (state: RootState) => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      poolAddress: state.Midgard.poolAddress,
      poolData: state.Midgard.poolData,
      assets: state.Midgard.assets,
      stakerPoolData: state.Midgard.stakerPoolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      poolLoading: state.Midgard.poolLoading,
      stakerPoolDataLoading: state.Midgard.stakerPoolDataLoading,
    }),
    {
      getPools: midgardActions.getPools,
      getPoolAddress: midgardActions.getPoolAddress,
      getStakerPoolData: midgardActions.getStakerPoolData,
      setTxTimerModal: appActions.setTxTimerModal,
      setTxTimerStatus: appActions.setTxTimerStatus,
      countTxTimerValue: appActions.countTxTimerValue,
      setTxTimerValue: appActions.setTxTimerValue,
      setTxHash: appActions.setTxHash,
      resetTxStatus: appActions.resetTxStatus,
      refreshStake: walletActions.refreshStake,
    },
  ),
  withRouter,
  withBinanceTransferWS,
)(PoolStake) as React.ComponentClass<ComponentProps, State>;
