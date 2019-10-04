/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form, notification } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';

import Binance from '../../../clients/binance';

import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import Coin from '../../../components/uielements/coins/coin';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';
import Modal from '../../../components/uielements/modal';
import Input from '../../../components/uielements/input';

import appActions from '../../../redux/app/actions';
import chainActions from '../../../redux/chainservice/actions';
import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';

import {
  ContentWrapper,
  Tabs,
  ConfirmModal,
  ConfirmModalContent,
  PrivateModal,
  // StakePoolCol,
} from './PoolStake.style';
import {
  getPoolData,
  getCalcResult,
  confirmStake,
  confirmWithdraw,
} from '../utils';
import { getActualValue, getNewValue } from '../../../helpers/stringHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';

const { TabPane } = Tabs;

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
  resetTxStatus,
} = appActions;

const { getTokens, getStakeData } = chainActions;
const { getPools } = statechainActions;
const { getRunePrice } = walletactions;

class PoolStake extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
    chainData: PropTypes.object.isRequired,
    pools: PropTypes.array.isRequired,
    poolData: PropTypes.object.isRequired,
    swapData: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    runePrice: PropTypes.number.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
    resetTxStatus: PropTypes.func.isRequired,
    history: PropTypes.object,
    info: PropTypes.object,
    getTokens: PropTypes.func.isRequired,
    getStakeData: PropTypes.func.isRequired,
    getPools: PropTypes.func.isRequired,
    getRunePrice: PropTypes.func.isRequired,
  };

  state = {
    dragReset: true,
    openWalletAlert: false,
    openPrivateModal: false,
    invalidPassword: false,
    password: '',
    runeAmount: 0,
    tokenAmount: 0,
    // balance: 100,
    fR: 1,
    fT: 1,
    selectedRune: 0,
    selectedToken: 0,
    runeTotal: 0,
    tokenTotal: 0,
  };

  componentDidMount() {
    const { getTokens, getPools, getRunePrice } = this.props;

    getTokens();
    getPools();
    getRunePrice();
    this.getStakerData();
  }

  getStakerData = () => {
    const {
      getStakeData,
      symbol,
      user: { wallet },
    } = this.props;

    if (wallet) {
      getStakeData({ asset: symbol, staker: wallet });
    }
  };

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value,
      invalidPassword: false,
    });
  };

  handleChangeTokenAmount = tokenName => amount => {
    const { assetData, symbol } = this.props;
    const { runeAmount, tokenAmount, fR, fT } = this.state;

    let newValue;
    const source = tokenName.split('-')[0].toLowerCase();

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = asset.split('-')[0];
      if (tokenName.toLowerCase() === source) {
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
      newValue = getNewValue(amount, runeAmount);
      const { ratio } = this.data;
      const tokenValue = newValue * ratio;
      const tokenAmount =
        tokenValue <= totalTokenAmount ? tokenValue : totalTokenAmount;

      if (totalAmount < newValue) {
        this.setState({
          runeAmount: totalAmount,
          tokenAmount,
          selectedRune: 0,
        });
      } else {
        this.setState({
          runeAmount: newValue,
          tokenAmount,
          selectedRune: 0,
        });
      }
    } else {
      newValue = getNewValue(amount, tokenAmount);

      if (totalAmount < newValue) {
        this.setState({
          tokenAmount: totalAmount,
          selectedToken: 0,
        });
      } else {
        this.setState({
          tokenAmount: newValue,
          selectedToken: 0,
        });
      }
    }
  };

  handleSelectTokenAmount = token => amount => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    const selectedToken = assetData.find(data => {
      const { asset } = data;
      const tokenName = asset.split('-')[0];
      if (tokenName.toLowerCase() === token.toLowerCase()) {
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
      const { ratio } = this.data;
      const tokenValue = value * ratio;
      const tokenAmount =
        tokenValue <= totalTokenAmount ? tokenValue : totalTokenAmount;

      this.setState({
        runeAmount: value,
        tokenAmount,
        selectedRune: amount,
        runeTotal: totalAmount,
      });
    } else {
      this.setState({
        tokenAmount: value,
        selectedToken: amount,
        tokenTotal: totalAmount,
      });
    }
  };

  handleChangeBalance = balance => {
    const { selectedRune, selectedToken, runeTotal, tokenTotal } = this.state;
    const fR = balance <= 100 ? 1 : (200 - balance) / 100;
    const fT = balance >= 100 ? 1 : balance / 100;

    if (selectedRune > 0) {
      const runeAmount = ((runeTotal * selectedRune) / 100) * fR;
      this.setState({
        runeAmount,
      });
    }
    if (selectedToken > 0) {
      const tokenAmount = ((tokenTotal * selectedToken) / 100) * fT;
      this.setState({
        tokenAmount,
      });
    }
    this.setState({
      // balance,
      fR,
      fT,
    });
  };

  handleGotoDetail = () => {
    const { symbol } = this.props;
    const URL = `/pool/${symbol}`;

    this.props.history.push(URL);
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleConfirmStake = async () => {
    const {
      user: { wallet },
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    try {
      const { result } = await confirmStake(
        Binance,
        wallet,
        runeAmount,
        tokenAmount,
        this.data,
      );

      console.log('stake result: ', result);
      this.hash = result[0].hash;

      this.handleStartTimer();
    } catch (error) {
      notification.error({
        message: 'Swap Invalid',
        description: 'Swap information is not valid.',
      });
      this.setState({
        dragReset: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleStake = () => {
    const {
      user: { keystore, wallet },
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (Number(runeAmount) <= 0 || Number(tokenAmount) <= 0) {
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
      this.type = 'stake';
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

  handleStartTimer = (type = 'stake') => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType(type);
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleConfirmPassword = e => {
    e.preventDefault();

    const {
      user: { keystore, wallet },
    } = this.props;
    const { password } = this.state;

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      Binance.setPrivateKey(privateKey);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        Binance.getPrefix(),
      );
      if (wallet === address) {
        if (this.type === 'stake') {
          this.handleConfirmStake();
        } else if (this.type === 'withdraw') {
          this.handleConfirmWithdraw();
        }
      }

      this.setState({
        openPrivateModal: false,
      });
    } catch (error) {
      this.setState({
        password: '',
        invalidPassword: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleOpenPrivateModal = () => {
    this.setState({
      openPrivateModal: true,
    });
  };

  handleClosePrivateModal = () => {
    this.setState({
      openPrivateModal: false,
      dragReset: true,
    });
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(false);
  };

  handleSelectTraget = asset => {
    const URL = `/pool/${asset}`;

    this.props.history.push(URL);
  };

  handleWithdraw = () => {
    const {
      user: { keystore, wallet },
    } = this.props;

    if (!wallet) {
      this.setState({
        openWalletAlert: true,
      });
      return;
    }

    if (keystore) {
      this.type = 'withdraw';
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmWithdraw();
    }
  };

  handleConfirmWithdraw = async () => {
    const {
      symbol,
      pools,
      user: { wallet },
    } = this.props;
    const { widthdrawPercentage } = this.state;
    const withdrawRate = (widthdrawPercentage || 50) / 100;

    try {
      const { result } = await confirmWithdraw(
        Binance,
        wallet,
        pools,
        symbol,
        withdrawRate,
      );

      console.log('withdraw result: ', result);
      this.hash = result[0].hash;

      this.handleStartTimer('withdraw');
    } catch (error) {
      notification.error({
        message: 'Withdraw Invalid',
        description: 'Withdraw information is not valid.',
      });
      this.setState({
        dragReset: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleChangeTxValue = value => {
    const { setTxTimerValue } = this.props;

    setTxTimerValue(value);
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;

    this.setState({
      dragReset: true,
    });
    setTxTimerStatus(false);

    this.getStakerData();
  };

  renderStakeModalContent = (poolStats, calcResult) => {
    const {
      txStatus: { status, value },
      symbol,
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    const source = 'rune';
    const target = symbol.split('-')[0].toLowerCase();

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const stakeText = !completed ? 'YOU ARE STAKING' : 'YOU STAKED';

    const { Pr } = calcResult;
    const { tokenPrice } = poolStats;
    const txURL = TESTNET_TX_BASE_URL + this.hash;

    return (
      <ConfirmModalContent>
        <Row className="modal-content">
          <div className="left-container">
            <Label weight="bold">{stakeText}</Label>
            <CoinData
              asset={source}
              assetValue={runeAmount}
              price={Pr * runeAmount}
            />
            <CoinData
              asset={target}
              assetValue={tokenAmount}
              price={tokenPrice * tokenAmount}
            />
          </div>
          <div className="center-container">
            <TxTimer
              reset={status}
              value={value}
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="right-container" />
        </Row>
        <Row className="modal-info-wrapper">
          {this.hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  <Icon type="global" />
                </a>
              </div>
              <Label>VIEW ON BINANCE CHAIN</Label>
            </div>
          )}
          {value !== 0 && (
            <Label className="tx-label" weight="bold">
              {transactionLabels[value - 1]}
            </Label>
          )}
          {completed && (
            <Label className="tx-label" weight="bold">
              complete
            </Label>
          )}
        </Row>
      </ConfirmModalContent>
    );
  };

  renderWithdrawModalContent = () => {
    const {
      txStatus: { status, value },
      symbol,
      runePrice,
    } = this.props;

    const source = 'rune';
    const target = symbol.split('-')[0].toLowerCase();

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const withdrawText = !completed ? 'YOU ARE WITHDRAWING' : 'YOU WITHDRAWN';

    const txURL = TESTNET_TX_BASE_URL + this.hash;
    const { runeValue, tokenValue, tokenPrice } = this.withdrawData;

    return (
      <ConfirmModalContent>
        <Row className="modal-content">
          <div className="left-container" />
          <div className="center-container">
            <TxTimer
              reset={status}
              value={value}
              onChange={this.handleChangeTxValue}
              onEnd={this.handleEndTxTimer}
            />
          </div>
          <div className="right-container">
            <Label weight="bold">{withdrawText}</Label>
            <CoinData
              asset={source}
              assetValue={runeValue}
              price={runePrice * runeValue}
            />
            <CoinData
              asset={target}
              assetValue={tokenValue}
              price={tokenPrice * tokenValue}
            />
          </div>
        </Row>
        <Row className="modal-info-wrapper">
          {this.hash && (
            <div className="hash-address">
              <div className="copy-btn-wrapper">
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  <Icon type="global" />
                </a>
              </div>
              <Label>VIEW ON BINANCE CHAIN</Label>
            </div>
          )}
          {value !== 0 && (
            <Label className="tx-label" weight="bold">
              {transactionLabels[value - 1]}
            </Label>
          )}
          {completed && (
            <Label className="tx-label" weight="bold">
              complete
            </Label>
          )}
        </Row>
      </ConfirmModalContent>
    );
  };

  renderStakeInfo = (poolStats, calcResult) => {
    const { symbol } = this.props;
    const source = 'rune';

    const target = symbol.split('-')[0].toLowerCase();
    const stakePool = `${source}:${target}`;

    const {
      depth,
      volume24,
      volumeAT,
      totalSwaps,
      totalStakers,
      roiAT,
    } = poolStats;
    const { poolPrice } = calcResult;

    const attrs = [
      {
        key: 'depth',
        title: 'Depth',
        value: `$${getActualValue(depth).toLocaleString()}`,
      },
      {
        key: 'vol24',
        title: '24hr Volume',
        value: `$${getActualValue(volume24)}`,
      },
      {
        key: 'volAT',
        title: 'All Time Volume',
        value: `$${getActualValue(volumeAT)}`,
      },
      { key: 'swap', title: 'Total Swaps', value: totalSwaps },
      { key: 'stakers', title: 'Total Stakers', value: totalStakers },
      {
        key: 'roi',
        title: 'All Time RoI',
        value: `${getActualValue(roiAT)}% pa`,
      },
    ];

    return (
      <Row className="stake-status-view">
        <Col className="stake-pool-col" span={24} lg={8}>
          <Coin type="rune" over={target} />
          <div className="pool-status-info">
            <Label className="stake-pool-status" size="big" weight="bold">
              {stakePool}
            </Label>
            <Label className="pool-price-label" size="normal" color="grey">
              $USD {poolPrice}
            </Label>
          </div>
        </Col>
        <Col className="stake-info-col" span={24} lg={16}>
          {attrs.map(info => (
            <Status className="stake-info-status" {...info} />
          ))}
        </Col>
      </Row>
    );
  };

  renderShareDetail = (poolStats, calcResult, stakeData) => {
    const {
      symbol,
      runePrice,
      chainData: { tokenInfo },
    } = this.props;
    const {
      runeAmount,
      tokenAmount,
      // balance,
      widthdrawPercentage,
      dragReset,
    } = this.state;

    const source = 'rune';
    const target = symbol.split('-')[0].toLowerCase();

    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const { symbol, price } = tokenInfo[tokenName];

      return {
        asset: symbol,
        price,
      };
    });

    const stakeInfo = stakeData[symbol] || {
      units: 0,
      runeStaked: 0,
      tokensStaked: 0,
    };

    const { tokenPrice } = poolStats;
    const { R, T, poolUnits } = calcResult;
    // const { poolPrice, newPrice, newDepth, share } = calcResult;

    // const poolAttrs = [
    //   { key: 'price', title: 'Pool Price', value: `$${poolPrice}` },
    //   {
    //     key: 'depth',
    //     title: 'Pool Depth',
    //     value: `$${getActualValue(depth * runePrice)}`,
    //   },
    // ];

    // const newPoolAttrs = [
    //   { key: 'price', title: 'New Price', value: `$${newPrice}` },
    //   {
    //     key: 'depth',
    //     title: 'New Depth',
    //     value: `$${getActualValue(newDepth)}`,
    //   },
    //   { key: 'share', title: 'Your Share', value: `${share}%` },
    // ];

    // withdraw values
    const withdrawRate = (widthdrawPercentage || 50) / 100;
    const { units } = stakeInfo;
    const runeValue = getActualValue(((withdrawRate * units) / poolUnits) * R);
    const tokenValue = getActualValue(((withdrawRate * units) / poolUnits) * T);
    this.withdrawData = {
      runeValue,
      tokenValue,
      tokenPrice,
    };

    const disableWithdraw = stakeInfo.units === 0;

    return (
      <Tabs>
        <TabPane tab="add" key="add">
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
              onChange={this.handleChangeTokenAmount('rune')}
              onSelect={this.handleSelectTokenAmount('rune')}
              withSelection
            />
            <CoinCard
              asset={target}
              assetData={tokensData}
              amount={tokenAmount}
              price={tokenPrice}
              onChangeAsset={this.handleSelectTraget}
              onChange={this.handleChangeTokenAmount(target)}
              onSelect={this.handleSelectTokenAmount(target)}
              withSelection
              withSearch
            />
          </div>
          {/* <Label className="label-title" size="normal" weight="bold">
            ADJUST BALANCE
          </Label>
          <Label size="normal">
            Fine tune balances to ensure you stake on both sides with the
            correct amount.
          </Label>
          <Slider
            onChange={this.handleChangeBalance}
            value={balance}
            min={0}
            max={200}
            tooltipVisible={false}
          /> */}
          <div className="stake-share-info-wrapper">
            {/* <div className="pool-status-wrapper">
              {poolAttrs.map(info => {
                return <Status className="share-info-status" {...info} />;
              })}
            </div> */}
            <div className="share-status-wrapper">
              {/* <div className="info-status-wrapper">
                {newPoolAttrs.map(info => {
                  return <Status className="share-info-status" {...info} />;
                })}
              </div> */}
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
            onChange={e => {
              this.setState({ widthdrawPercentage: e });
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
                />
                <CoinData
                  asset={target}
                  assetValue={tokenValue}
                  price={tokenValue * tokenPrice}
                />
              </div>
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
    );
  };

  renderYourShare = (poolStats, calcResult, stakeData) => {
    const {
      symbol,
      user: { wallet },
      runePrice,
    } = this.props;

    console.log(calcResult);
    console.log(stakeData);

    const stakeInfo = stakeData[symbol] || { units: 0 };

    const { tokenPrice } = poolStats;
    const { poolUnits, R, T } = calcResult;
    const source = 'rune';
    const target = symbol.split('-')[0];

    const { units } = stakeInfo;

    const poolShare = (units / Number(poolUnits)).toFixed(2);
    const runeShare = getActualValue((R * units) / poolUnits);
    const tokensShare = getActualValue((T * units) / poolUnits);
    const runeEarned = getActualValue(stakeInfo.runeEarned);
    const tokensEarned = getActualValue(stakeInfo.tokensEarned);

    return (
      <div className="your-share-wrapper">
        <Label className="label-title" size="normal" weight="bold">
          YOUR SHARE
        </Label>
        {!wallet && <Label size="normal">Please connect your wallet.</Label>}
        {wallet && stakeInfo.units === 0 && (
          <>
            <Label size="normal">You don't have any shares in this pool.</Label>
          </>
        )}
        {wallet && stakeInfo.units > 0 && (
          <>
            <Label size="normal">Your total share of the pool.</Label>
            <div className="your-share-info-wrapper">
              <div className="your-share-info">
                <Status
                  title={String(source).toUpperCase()}
                  value={runeShare}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD {(runeShare * runePrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status
                  title={String(target).toUpperCase()}
                  value={tokensShare}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD {(tokensShare * tokenPrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status title="Pool Share" value={`${poolShare}%`} />
              </div>
            </div>
            <Label className="label-title" size="normal" weight="bold">
              EARNINGS
            </Label>
            <Label size="normal">Total of all earnings from this pool.</Label>
            <div className="your-share-info-wrapper">
              <div className="your-share-info">
                <Status
                  title={String(source).toUpperCase()}
                  value={runeEarned}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD {(runeEarned * runePrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status
                  title={String(target).toUpperCase()}
                  value={tokensEarned}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD {(tokensEarned * tokenPrice).toFixed(2)}
                </Label>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const {
      symbol,
      runePrice,
      poolData,
      swapData,
      pools,
      txStatus,
      chainData: { stakeData, tokenInfo },
    } = this.props;
    const {
      runeAmount,
      tokenAmount,
      openPrivateModal,
      openWalletAlert,
      password,
      invalidPassword,
    } = this.state;

    const poolInfo = poolData[symbol] || {};
    const swapInfo = swapData[symbol] || {};

    const poolStats = getPoolData(
      'rune',
      symbol,
      poolInfo,
      swapInfo,
      tokenInfo,
      runePrice,
    );

    const calcResult = getCalcResult(
      symbol,
      pools,
      runeAmount,
      runePrice,
      tokenAmount,
    );

    // store calc result
    this.data = calcResult;

    const openStakeModal = txStatus.type === 'stake' ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === 'withdraw' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    return (
      <ContentWrapper className="pool-stake-wrapper">
        {this.renderStakeInfo(poolStats, calcResult)}
        <Row className="share-view">
          <Col className="your-share-view" span={24} lg={8}>
            {this.renderYourShare(poolStats, calcResult, stakeData)}
          </Col>
          <Col className="share-detail-view" span={24} lg={16}>
            {this.renderShareDetail(poolStats, calcResult, stakeData)}
          </Col>
        </Row>
        <ConfirmModal
          title="WITHDRAW CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openWithdrawModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderWithdrawModalContent()}
        </ConfirmModal>
        <ConfirmModal
          title="STAKE CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openStakeModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderStakeModalContent(poolStats, calcResult)}
        </ConfirmModal>
        <PrivateModal
          title="PASSWORD CONFIRMATION"
          visible={openPrivateModal}
          onOk={this.handleConfirmPassword}
          onCancel={this.handleClosePrivateModal}
          okText="Confirm"
        >
          <Form onSubmit={this.handleConfirmPassword}>
            <Form.Item className={invalidPassword ? 'has-error' : ''}>
              <Input
                type="password"
                value={password}
                onChange={this.handleChange('password')}
                placeholder="Input password"
              />
              {invalidPassword && (
                <div className="ant-form-explain">Password is wrong!</div>
              )}
            </Form.Item>
          </Form>
        </PrivateModal>
        <Modal
          title="PLEASE ADD WALLET"
          visible={openWalletAlert}
          onOk={this.handleConnectWallet}
          onCancel={this.hideWalletAlert}
          okText="Add Wallet"
        >
          Please add a wallet to stake.
        </Modal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      runePrice: state.Wallet.runePrice,
      chainData: state.ChainService,
      pools: state.Statechain.pools,
      poolData: state.Statechain.poolData,
      swapData: state.Statechain.swapData,
    }),
    {
      getTokens,
      getStakeData,
      getPools,
      getRunePrice,
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      resetTxStatus,
    },
  ),
  withRouter,
)(PoolStake);
