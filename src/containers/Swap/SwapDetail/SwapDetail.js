import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';

import Binance from '../../../clients/binance';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinList from '../../../components/uielements/coins/coinList';
import Label from '../../../components/uielements/label';
import Input from '../../../components/uielements/input/input';
import CoinData from '../../../components/uielements/coins/coinData';
import Status from '../../../components/uielements/status';
import TxTimer from '../../../components/uielements/txTimer';

import {
  ContentWrapper,
  SwapModalContent,
  SwapModal,
  PrivateModal,
} from './SwapDetail.style';
import { blackArrowIcon } from '../../../components/icons';
import { getCalcResult, confirmSwap } from '../utils';

import appActions from '../../../redux/app/actions';
import chainActions from '../../../redux/chainservice/actions';
import statechainActions from '../../../redux/statechain/actions';

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
  resetTxStatus,
} = appActions;

const { getTokens } = chainActions;
const { getPools } = statechainActions;

class SwapDetail extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    chainData: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
    pools: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
    resetTxStatus: PropTypes.func.isRequired,
    getTokens: PropTypes.func.isRequired,
    getPools: PropTypes.func.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {
    dragReset: true,
    xValue: 0,
    openPrivateModal: false,
    password: '',
    invalidPassword: false,
  };

  componentDidMount() {
    const { getTokens, getPools } = this.props;

    getTokens();
    getPools();
  }

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value,
      invalidPassword: false,
    });
  };

  handleChangeValue = value => {
    this.setState({
      xValue: value,
    });
  };

  handleChangeSource = asset => {
    const { target } = this.getSwapData();
    const source = asset.split('-')[0].toLowerCase();

    const URL = `/swap/detail/${source}-${target}`;

    this.props.history.push(URL);
  };

  handleConfirmPassword = () => {
    const {
      user: { keystore, wallet },
    } = this.props;
    const { password } = this.state;

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        Binance.getPrefix(),
      );
      if (wallet === address) {
        Binance.setPrivateKey(privateKey);
        this.handleStartTimer();
      }

      this.setState({
        openPrivateModal: false,
      });
    } catch (error) {
      this.setState({
        password: '',
        invalidPassword: true,
      });
      console.log(error);
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

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleEndDrag = () => {
    const {
      user: { keystore, wallet },
    } = this.props;

    if (keystore) {
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleStartTimer();
    } else {
      this.setState({
        dragReset: true,
      });
    }
  };

  handleStartTimer = () => {
    const { setTxTimerModal, setTxTimerType, setTxTimerStatus } = this.props;

    setTxTimerType('swap');
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

  handleGotoDetail = () => {
    const { info } = this.props;
    const URL = `/swap/detail/${info}`;

    this.props.history.push(URL);
  };

  handleGotoSend = () => {
    const { info } = this.props;
    const URL = `/swap/send/${info}`;

    this.props.history.push(URL);
  };

  handleSelectTraget = tokensData => targetIndex => {
    const { view } = this.props;
    const { source } = this.getSwapData();
    const targetAsset = tokensData[targetIndex].asset;

    const target = targetAsset.split('-')[0].toLowerCase();
    const URL = `/swap/${view}/${source}-${target}`;

    this.props.history.push(URL);
  };

  validatePair = (sourceData, targetData) => {
    if (!sourceData.length || !targetData.length) {
      this.props.history.push('/swap');
    }
  };

  getSwapData = () => {
    const { info } = this.props;

    if (info) {
      const source = info.split('-')[0];
      const target = info.split('-')[1];

      return {
        source,
        target,
      };
    }
    return {};
  };

  handleChangeTxValue = value => {
    const { setTxTimerValue } = this.props;

    setTxTimerValue(value);
  };

  handleEndTxTimer = () => {
    const { setTxTimerStatus } = this.props;

    setTxTimerStatus(false);
    this.setState({
      dragReset: true,
    });

    this.handleConfirmSwap();
  };

  handleConfirmSwap = () => {
    const {
      user: { wallet },
    } = this.props;
    const { xValue } = this.state;
    const { source, target } = this.getSwapData();

    confirmSwap(Binance, wallet, source, target, this.data, xValue);
  };

  handleSelectAmount = source => amount => {
    const { assetData } = this.props;

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = asset.split('-')[0];
      if (tokenName.toLowerCase() === source) {
        return true;
      }
      return false;
    });

    const totalAmount = sourceAsset.assetValue || 0;
    const xValue = (totalAmount * amount) / 100;
    this.setState({
      xValue,
    });
  };

  renderSwapModalContent = swapData => {
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
    const swapText = !completed ? 'YOU ARE SWAPPING' : 'YOU SWAPPED';
    const receiveText = !completed ? 'YOU SHOULD RECEIVE' : 'YOU RECEIVED';
    const expectation = !completed
      ? 'EXPECTED FEES & SLIP'
      : 'FINAL FEES & SLIP';

    return (
      <SwapModalContent>
        <div className="left-container">
          <Label weight="bold">{swapText}</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
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
        <div className="right-container">
          <Label weight="bold">{receiveText}</Label>
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
          <Label weight="bold">{expectation}</Label>
          <div className="expected-status">
            <div className="status-item">
              <Status title="FEES" value="1.234 RUNE" />
              <Label className="price-label" size="normal" color="gray">
                $USD 110
              </Label>
            </div>
            <div className="status-item">
              <Status title="SLIP" value="0.3%" />
            </div>
          </div>
        </div>
      </SwapModalContent>
    );
  };

  render() {
    const {
      view,
      txStatus,
      chainData: { tokenInfo },
      pools,
      assetData,
    } = this.props;
    const {
      dragReset,
      invalidPassword,
      xValue,
      openPrivateModal,
      password,
    } = this.state;

    const swapData = this.getSwapData();

    if (!swapData || !assetData.length || !Object.keys(tokenInfo).length) {
      return '';
    }

    const { source, target } = swapData;
    const tokensData = Object.keys(tokenInfo).map(tokenName => {
      const { symbol, price } = tokenInfo[tokenName];

      return {
        asset: symbol,
        price,
      };
    });

    const targetData = tokensData.filter(
      data => data.asset.split('-')[0].toLowerCase() !== source,
    );
    const targetIndex = targetData.findIndex(
      value => value.asset.toLowerCase() === target,
    );
    const sourceData = assetData.filter(
      data => data.asset.split('-')[0].toLowerCase() !== target,
    );

    const dragTitle =
      view === 'detail' ? 'Drag to swap' : 'Drag to swap and send';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

    // calculation
    const runePrice = 0.04; // TODO: mock price = 0.04
    this.data = getCalcResult(source, target, pools, xValue, runePrice);
    const { Px, slip, outputAmount, outputPrice } = this.data;

    // console.log(this.data);
    return (
      <ContentWrapper className="swap-detail-wrapper">
        <Row>
          <Col className="swap-detail-panel" span={16}>
            <div className="swap-type-selector">
              <Button
                onClick={this.handleGotoDetail}
                sizevalue="big"
                typevalue="ghost"
                focused={view === 'detail'}
              >
                swap
              </Button>
              <Button
                onClick={this.handleGotoSend}
                sizevalue="big"
                typevalue="ghost"
                focused={view === 'send'}
              >
                swap & send
              </Button>
            </div>
            <div className="swap-asset-card">
              <CoinCard
                title="You are swapping"
                asset={source}
                assetData={sourceData}
                amount={xValue}
                price={Px}
                onChange={this.handleChangeValue}
                onChangeAsset={this.handleChangeSource}
                onSelect={this.handleSelectAmount(source)}
                withSelection
              />
              <img src={blackArrowIcon} alt="blackarrow-icon" />
              <CoinCard
                title="You will receive"
                asset={target}
                amount={outputAmount}
                price={outputPrice}
                slip={slip}
                disabled
              />
            </div>
            <div className="drag-confirm-wrapper">
              <Drag
                title={dragTitle}
                source={source}
                target={target}
                reset={dragReset}
                onConfirm={this.handleEndDrag}
                onDrag={this.handleDrag}
              />
            </div>
          </Col>
          <Col className="swap-token-panel" span={8}>
            <Label className="select-token-label">
              Select token to receive
            </Label>
            <Input
              className="token-search-input"
              placeholder="Search Token ..."
              suffix={<Icon type="search" />}
            />
            <CoinList
              data={targetData}
              value={targetIndex}
              onSelect={this.handleSelectTraget(targetData)}
            />
          </Col>
        </Row>
        <SwapModal
          title="SWAP CONFIRMATION"
          closeIcon={
            <Icon type={coinCloseIconType} style={{ color: '#33CCFF' }} />
          }
          visible={openSwapModal}
          footer={null}
          onCancel={this.handleCloseModal}
        >
          {this.renderSwapModalContent(swapData)}
        </SwapModal>
        <PrivateModal
          title="PASSWORD CONFIRMATION"
          visible={openPrivateModal}
          onOk={this.handleConfirmPassword}
          onCancel={this.handleClosePrivateModal}
        >
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
        </PrivateModal>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
      txStatus: state.App.txStatus,
      chainData: state.ChainService,
      pools: state.Statechain.pools,
      assetData: state.Wallet.assetData,
    }),
    {
      getTokens,
      getPools,
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
      resetTxStatus,
    },
  ),
  withRouter,
)(SwapDetail);
