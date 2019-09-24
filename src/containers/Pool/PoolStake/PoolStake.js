import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import Coin from '../../../components/uielements/coins/coin';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';
import WalletButton from '../../../components/uielements/walletButton';

import appActions from '../../../redux/app/actions';
import chainActions from '../../../redux/chainservice/actions';
import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';

import {
  ContentWrapper,
  Tabs,
  ConfirmModal,
  ConfirmModalContent,
} from './PoolStake.style';
import { getPoolData, getCalcResult } from '../utils';
import { getActualValue } from '../../../helpers/stringHelper';

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
    ticker: PropTypes.string.isRequired,
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
    getTokens: PropTypes.func.isRequired,
    getStakeData: PropTypes.func.isRequired,
    getPools: PropTypes.func.isRequired,
    getRunePrice: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    dragReset: true,
    runePrice: 0,
    tokenPrice: 0,
    runeAmount: 0,
    tokenAmount: 0,
    balance: 50,
  };

  componentDidMount() {
    const { getTokens, getPools, getRunePrice } = this.props;

    getTokens();
    getPools();
    getRunePrice();
  }

  handleChangeTokenAmount = tokenName => amount => {
    this.setState({
      [tokenName]: amount,
    });
  };

  handleSelectTokenAmount = token => amount => {
    const { assetData } = this.props;

    const selectedToken = assetData.find(data => {
      const { asset } = data;
      const tokenName = asset.split('-')[0];
      if (tokenName.toLowerCase() === token.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!selectedToken) {
      return;
    }

    const totalAmount = selectedToken.assetValue || 0;
    const value = (totalAmount * amount) / 100;

    if (token === 'rune') {
      this.setState({
        runeAmount: value,
      });
    } else {
      this.setState({
        tokenAmount: value,
      });
    }
  };

  handleChangeBalance = e => {
    this.setState({
      balance: e,
    });
  };

  handleGotoDetail = () => {
    const { ticker } = this.props;
    const URL = `/pool/${ticker}`;

    this.props.history.push(URL);
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleStake = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('stake');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleCloseModal = () => {
    const {
      txStatus: { status },
      setTxTimerModal,
      resetTxStatus,
    } = this.props;

    if (!status) resetTxStatus();
    else setTxTimerModal(false);
  };

  handleConfirmStake = () => {
    this.handleGotoStakeView();
  };

  handleGotoStakeView = () => {
    const { ticker } = this.props;
    const URL = `/pool/stake-view/${ticker}`;

    this.props.history.push(URL);
  };

  handleAddMore = () => {
    const { ticker } = this.props;
    const URL = `/pool/stake-new/${ticker}`;

    this.props.history.push(URL);
  };

  handleGotoWithdraw = () => {
    const { ticker } = this.props;
    const URL = `/pool/withdraw/${ticker}`;

    this.props.history.push(URL);
  };

  handleWithdraw = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('withdraw');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleChangeTxValue = value => {
    const { setTxTimerValue } = this.props;

    setTxTimerValue(value);
  };

  handleEndTxTimer = () => {
    const {
      txStatus: { type },
      setTxTimerStatus,
      resetTxStatus,
    } = this.props;

    this.setState({
      dragReset: true,
    });
    setTxTimerStatus(false);

    // staked?
    if (type === 'stake') {
      resetTxStatus();
      this.handleConfirmStake();
    }
  };

  renderStakeModalContent = () => {
    const {
      txStatus: { status, value },
      ticker,
    } = this.props;
    const source = 'rune';
    const target = ticker.split('-')[0].toLowerCase();

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const stakeText = !completed ? 'YOU ARE STAKING' : 'YOU STAKED';

    return (
      <ConfirmModalContent>
        <div className="left-container">
          <Label weight="bold">{stakeText}</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
        </div>
        <div className="center-container">
          <TxTimer
            reset={status}
            value={value}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
          {value !== 0 && (
            <Label weight="bold">{transactionLabels[value - 1]}</Label>
          )}
          {completed && <Label weight="bold">complete</Label>}
        </div>
        <div className="right-container" />
      </ConfirmModalContent>
    );
  };

  renderWithdrawModalContent = () => {
    const {
      txStatus: { status, value },
      ticker,
    } = this.props;

    const source = 'rune';
    const target = ticker.split('-')[0].toLowerCase();

    const transactionLabels = [
      'sending transaction',
      'processing transaction',
      'signing transaction',
      'finishing transaction',
      'complete',
    ];

    const completed = value !== null && !status;
    const withdrawText = !completed ? 'YOU ARE WITHDRAWING' : 'YOU WITHDRAWN';

    return (
      <ConfirmModalContent>
        <div className="left-container" />
        <div className="center-container">
          <TxTimer
            reset={status}
            value={value}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
          {value !== 0 && (
            <Label weight="bold">{transactionLabels[value - 1]}</Label>
          )}
          {completed && <Label weight="bold">complete</Label>}
        </div>
        <div className="right-container">
          <Label weight="bold">{withdrawText}</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
        </div>
      </ConfirmModalContent>
    );
  };

  renderStakeInfo = poolStats => {
    const { ticker } = this.props;
    const source = 'rune';

    const target = ticker.split('-')[0].toLowerCase();
    const stakePool = `${source}:${target}`;

    const {
      depth,
      volume24,
      volumeAT,
      totalSwaps,
      totalStakers,
      roiAT,
    } = poolStats;

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
        <Col className="stake-pool-col" span={8}>
          <Coin type="rune" over={target} />
          <Status
            className="stake-pool-status"
            title="Pool"
            value={stakePool}
          />
        </Col>
        <Col className="stake-info-col" span={16}>
          {attrs.map(info => (
            <Status className="stake-info-status" {...info} />
          ))}
        </Col>
      </Row>
    );
  };

  renderShareDetail = poolStats => {
    const {
      user: { wallet },
      ticker,
      runePrice,
      chainData: { tokenInfo },
    } = this.props;
    const {
      runeAmount,
      tokenAmount,
      balance,
      widthdrawPercentage,
      tokenPrice,
      dragReset,
    } = this.state;

    if (!wallet) {
      return (
        <Link to="/connect">
          <WalletButton connected={false} />
        </Link>
      );
    }

    const stakeData = this.state.stakeData || { units: 0 };
    const source = 'rune';
    const target = ticker.split('-')[0].toLowerCase();

    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const { symbol, price } = tokenInfo[tokenName];

      return {
        asset: symbol,
        price,
      };
    });

    const { depth } = poolStats;

    const poolAttrs = [
      { key: 'price', title: 'Pool Price', value: '$0.10' }, // TODO
      {
        key: 'depth',
        title: 'Pool Depth',
        value: `$${getActualValue(depth * runePrice)}`,
      },
    ];

    const newPoolAttrs = [
      { key: 'price', title: 'Pool Price', value: '$0.11' }, // TODO
      {
        key: 'depth',
        title: 'New Depth',
        value: `$${getActualValue(
          (depth + runeAmount + (tokenAmount * tokenPrice) / runePrice) *
            runePrice,
        )}`,
      },
      { key: 'share', title: 'Your Share', value: '3%' }, // TODO
    ];

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
              onChange={this.handleChangeTokenAmount('runeAmount')}
              onSelect={this.handleSelectTokenAmount('rune')}
              withSelection
            />
            <CoinCard
              asset={target}
              assetData={tokensData}
              amount={tokenAmount}
              price={tokenPrice}
              onChange={this.handleChangeTokenAmount('tokenAmount')}
              onSelect={this.handleSelectTokenAmount(target)}
              withSelection
              withSearch
            />
          </div>
          <Label className="label-title" size="normal" weight="bold">
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
            max={100}
            tooltipVisible={false}
          />
          <div className="stake-share-info-wrapper">
            <div className="pool-status-wrapper">
              {poolAttrs.map(info => {
                return <Status className="share-info-status" {...info} />;
              })}
            </div>
            <div className="share-status-wrapper">
              <div className="info-status-wrapper">
                {newPoolAttrs.map(info => {
                  return <Status className="share-info-status" {...info} />;
                })}
              </div>
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
        <TabPane tab="Withdraw" key="withdraw">
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
          />
          <div className="stake-withdraw-info-wrapper">
            <Label className="label-title" size="normal" weight="bold">
              YOU SHOULD RECEIVE
            </Label>
            <div className="withdraw-status-wrapper">
              <div className="withdraw-asset-wrapper">
                <CoinData
                  asset={source}
                  assetValue={Number(
                    (
                      stakeData.runeStaked *
                      ((widthdrawPercentage || 50) / 100)
                    ).toFixed(8),
                  )}
                  price={(
                    stakeData.runeStaked *
                    ((widthdrawPercentage || 50) / 100) *
                    runePrice
                  ).toFixed(2)}
                />
                <CoinData
                  asset={target}
                  assetValue={Number(
                    (
                      stakeData.tokensStaked *
                      ((widthdrawPercentage || 50) / 100)
                    ).toFixed(8),
                  )}
                  price={(
                    stakeData.tokensStaked *
                    ((widthdrawPercentage || 50) / 100) *
                    tokenPrice
                  ).toFixed(2)}
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

  renderYourShare = () => {
    // const { address } = this.props.user
    const address = 'deleteme';
    const { ticker } = this.props;

    const stakeData = this.state.stakeData || { units: 0 };
    const source = 'rune';
    const target = ticker;

    return (
      <div className="your-share-wrapper">
        <Label className="label-title" size="normal" weight="bold">
          YOUR SHARE
        </Label>
        {!address && (
          <>
            <Label size="normal">You have not connected your wallet.</Label>
            <Link to="/connect">
              <WalletButton connected={false} />
            </Link>
          </>
        )}
        {address && stakeData.units === 0 && (
          <>
            <Label size="normal">You don't have any shares in this pool.</Label>
          </>
        )}
        {address && stakeData.units > 0 && (
          <>
            <Label size="normal">Your total share of the pool.</Label>
            <div className="your-share-info-wrapper">
              <div className="your-share-info">
                <Status
                  title={String(source).toUpperCase()}
                  value={stakeData.runeStaked}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD{' '}
                  {(stakeData.runeStaked * this.state.runePrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status
                  title={String(target).toUpperCase()}
                  value={stakeData.tokensStaked}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD{' '}
                  {(stakeData.tokensStaked * this.state.tokenPrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status title="Pool Share" value={stakeData.units + ' units'} />
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
                  value={stakeData.runeEarned}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD{' '}
                  {(stakeData.runeEarned * this.state.runePrice).toFixed(2)}
                </Label>
              </div>
              <div className="your-share-info">
                <Status
                  title={String(target).toUpperCase()}
                  value={stakeData.tokensEarned}
                />
                <Label
                  className="your-share-price-label"
                  size="normal"
                  color="grey"
                >
                  $USD{' '}
                  {(stakeData.tokensEarned * this.state.tokenPrice).toFixed(2)}
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
      ticker,
      runePrice,
      poolData,
      swapData,
      assetData,
      pools,
      txStatus,
    } = this.props;

    const poolInfo = poolData[ticker] || {};
    const swapInfo = swapData[ticker] || {};

    const poolStats = getPoolData(
      'rune',
      ticker,
      poolInfo,
      swapInfo,
      assetData,
      runePrice,
    );

    const openStakeModal = txStatus.type === 'stake' ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === 'withdraw' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    return (
      <ContentWrapper className="pool-stake-wrapper">
        {this.renderStakeInfo(poolStats)}
        <Row className="share-view">
          <Col className="your-share-view" span={8}>
            {this.renderYourShare()}
          </Col>
          <Col className="share-detail-view" span={16}>
            {this.renderShareDetail(poolStats)}
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
          {this.renderStakeModalContent()}
        </ConfirmModal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
      user: state.Wallet.user,
      chainData: state.ChainService,
      pools: state.Statechain.pools,
      poolData: state.Statechain.poolData,
      swapData: state.Statechain.swapData,
      assetData: state.Wallet.assetData,
      runePrice: state.Wallet.runePrice,
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
