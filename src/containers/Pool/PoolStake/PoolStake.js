import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';
import ChainService from '../../../clients/chainservice';
import Binance from '../../../clients/binance';

import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import Coin from '../../../components/uielements/coins/coin';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinData from '../../../components/uielements/coins/coinData';
import Slider from '../../../components/uielements/slider';
import TxTimer from '../../../components/uielements/txTimer';
import Drag from '../../../components/uielements/drag';
import Tabs from '../../../components/uielements/tabs';
import WalletButton from '../../../components/uielements/walletButton';

import appActions from '../../../redux/app/actions';

import {
  ContentWrapper,
  ConfirmModal,
  ConfirmModalContent,
} from './PoolStake.style';

import { shareInfo } from './data';

const { TabPane } = Tabs;

// TODO: get this from Coingecko, and store it in redux so its available on all components
const TOKENPrice = 22.07;
const RUNEPrice = 0.02;

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
  resetTxStatus,
} = appActions;

class PoolStake extends Component {
  static propTypes = {
    ticker: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
    resetTxStatus: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    dragReset: true,
  };

  constructor(props) {
    super(props);

    this.getPoolData();
    this.getStakePool();
    this.getBalance();
  }

  getBalance = addr => {
    const { user } = this.props;
    // const { address } = user
    const address = 'bnbblejrrtta9cgr49fuh7ktu3sddhe0ff7wenlpn6'; // deleteme
    Binance.getBalances(address)
      .then(response => {
        Binance.getMarkets()
          .then(markets => {
            const coins = response.map(coin => {
              const market = markets.result.find(
                market => market.base_asset_symbol === coin.symbol,
              );
              return {
                asset: coin.symbol,
                assetValue: parseFloat(coin.free),
                price: market ? parseFloat(market.list_price) : 0,
              };
            });
            this.setState({ balances: coins });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getStakePool = () => {
    const { ticker, user } = this.props;
    // const { address } = user
    const address = 'deleteme';
    if (address) {
      ChainService.stakerData(address, ticker.toUpperCase())
        .then(response => {
          // TODO: use this data to display pool information instead of data pulled from data.js
          this.setState({ stakeData: response.data });
          console.log('Stake Data', response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  getPoolData = () => {
    const { ticker } = this.props;
    ChainService.getPool(ticker.toUpperCase())
      .then(response => {
        // TODO: use this data to display pool information instead of data pulled from data.js
        this.setState({ data: response.data });
        console.log('Pool data', response.data);
      })
      .catch(error => {
        console.error(error);
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
    const { info } = this.props;
    const URL = `/pool/stake-view/${info}`;

    this.props.history.push(URL);
  };

  handleAddMore = () => {
    const { info } = this.props;
    const URL = `/pool/stake-new/${info}`;

    this.props.history.push(URL);
  };

  handleGotoWithdraw = () => {
    const { info } = this.props;
    const URL = `/pool/withdraw/${info}`;

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

  renderStakeModalContent = swapData => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { source, target } = swapData;

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

  renderWithdrawModalContent = swapData => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { source, target } = swapData;

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

  renderStakeInfo = pair => {
    const { ticker } = this.props;
    const source = 'rune';

    const stakePool = `${source}:${ticker}`;
    const data = this.state.data || {};
    const attrs = [
      {
        key: 'depth',
        title: 'Depth',
        value: '$' + (data.depth * RUNEPrice).toFixed(2),
      },
      { key: 'vol24', title: '24hr Volume', value: data.vol24hr },
      { key: 'volAT', title: 'All Time Volume', value: data.volAT },
      { key: 'swap', title: 'Total Swaps', value: data.numSwaps },
      { key: 'stakers', title: 'Total Stakers', value: data.numStakers },
      { key: 'roi', title: 'All Time RoI', value: data.roiAT },
    ];

    return (
      <Row className="stake-status-view">
        <Col className="stake-pool-col" span={8}>
          <Coin type={'rune'} over={ticker} />
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

  renderShareDetail = pair => {
    // const { address } = this.props.user
    const address = 'deleteme';
    const { ticker } = this.props;
    const { dragReset } = this.state;
    const stakeData = this.state.stakeData || { units: 0 };
    const source = 'rune';
    const target = ticker;

    if (!address) {
      return (
        <Link to="/connect">
          <WalletButton connected={false} />
        </Link>
      );
    }

    const tokeBalance = (this.state.balances || []).find(
      coin => coin.symbl === ticker,
    );
    const runeBalance = (this.state.balances || []).find(
      coin => coin.symbl === 'rune',
    );
    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          MANAGE SHARE
        </Label>
        <Tabs style={{ width: '100%' }}>
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
                amount={0.75}
                price={217.29}
                withSelection
              />
              <CoinCard
                asset={target}
                amount={0.0}
                price={217.29}
                withSelection
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
              onChange={e => {
                this.setState({ addAdjust: e });
              }}
              defaultValue={1}
              max={2}
            />
            <div className="stake-share-info-wrapper">
              <div className="pool-status-wrapper">
                {shareInfo.pool.map(info => {
                  return <Status className="share-info-status" {...info} />;
                })}
              </div>
              <div className="share-status-wrapper">
                <div className="info-status-wrapper">
                  {shareInfo.share.map(info => {
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
                        ((this.state.widthdrawPercentage || 50) / 100)
                      ).toFixed(8),
                    )}
                    price={(
                      stakeData.runeStaked *
                      ((this.state.widthdrawPercentage || 50) / 100) *
                      RUNEPrice
                    ).toFixed(2)}
                  />
                  <CoinData
                    asset={target}
                    assetValue={Number(
                      (
                        stakeData.tokensStaked *
                        ((this.state.widthdrawPercentage || 50) / 100)
                      ).toFixed(8),
                    )}
                    price={(
                      stakeData.tokensStaked *
                      ((this.state.widthdrawPercentage || 50) / 100) *
                      TOKENPrice
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
      </>
    );
  };

  renderYourShare = pair => {
    // const { address } = this.props.user
    const address = 'deleteme';

    const stakeData = this.state.stakeData || { units: 0 };
    const { source, target } = pair;

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
            <Button onClick={this.handleGotoDetail} color="success">
              add share
            </Button>
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
                  $USD {(stakeData.runeStaked * RUNEPrice).toFixed(2)}
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
                  $USD {(stakeData.tokensStaked * TOKENPrice).toFixed(2)}
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
                  $USD {(stakeData.runeEarned * RUNEPrice).toFixed(2)}
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
                  $USD {(stakeData.tokensEarned * TOKENPrice).toFixed(2)}
                </Label>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { ticker, txStatus } = this.props;
    const pair = { source: 'rune', target: ticker };

    const openStakeModal = txStatus.type === 'stake' ? txStatus.modal : false;
    const openWithdrawModal =
      txStatus.type === 'withdraw' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    return (
      <ContentWrapper className="pool-stake-wrapper">
        {this.renderStakeInfo(pair)}
        <Row className="share-view">
          <Col className="your-share-view" span={8}>
            {this.renderYourShare(pair)}
          </Col>
          <Col className="share-detail-view" span={16}>
            {this.renderShareDetail(pair)}
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
          {this.renderWithdrawModalContent(pair)}
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
          {this.renderStakeModalContent(pair)}
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
    }),
    {
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      resetTxStatus,
    },
  ),
  withRouter,
)(PoolStake);
