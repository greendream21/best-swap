import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Form } from 'antd';

import BnbClient from '../../../services/binance';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import CoinCard from '../../../components/uielements/coins/coinCard';
import CoinList from '../../../components/uielements/coins/coinList';
import Label from '../../../components/uielements/label';
import Input from '../../../components/uielements/input/input';
import CoinData from '../../../components/uielements/coins/coinData';
import Status from '../../../components/uielements/status';
import TxTimer from '../../../components/uielements/txTimer';

import appActions from '../../../redux/app/actions';

import {
  ContentWrapper,
  SwapModalContent,
  SwapModal,
} from './SwapDetail.style';
import { blackArrowIcon } from '../../../components/icons';

import { assetsData } from './data';

const {
  setTxTimerType,
  setTxTimerModal,
  setTxTimerStatus,
  setTxTimerValue,
} = appActions;

class SwapDetail extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
    txStatus: PropTypes.object.isRequired,
    setTxTimerType: PropTypes.func.isRequired,
    setTxTimerModal: PropTypes.func.isRequired,
    setTxTimerStatus: PropTypes.func.isRequired,
    setTxTimerValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {
    address: '',
    invalidAddress: false,
    dragReset: true,
  };

  addressRef = React.createRef();

  isValidRecipient = () => {
    const { address } = this.state;

    return BnbClient.isValidAddress(address);
  };

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value,
      invalidAddress: false,
    });
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleEndDrag = () => {
    const {
      view,
      setTxTimerModal,
      setTxTimerType,
      setTxTimerStatus,
    } = this.props;
    if (view === 'send' && !this.isValidRecipient()) {
      this.setState({
        invalidAddress: true,
        dragReset: true,
      });
      return;
    }

    setTxTimerType('swap');
    setTxTimerModal(true);
    setTxTimerStatus(true);
  };

  handleConfirmSwap = () => {
    this.handleCloseModal();
  };

  handleCloseModal = () => {
    const { setTxTimerModal } = this.props;

    setTxTimerModal(false);
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

  handleSelectTraget = targetIndex => {
    const { view } = this.props;
    const { source } = this.getSwapData();
    const target = assetsData[targetIndex].asset;
    const URL = `/swap/${view}/${source}-${target}`;

    this.props.history.push(URL);
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
  };

  renderSwapModalContent = swapData => {
    const {
      txStatus: { status, value },
    } = this.props;
    const { source, target } = swapData;

    return (
      <SwapModalContent>
        <div className="left-container">
          <Label weight="bold">YOU ARE SWAPPING</Label>
          <CoinData asset={source} assetValue={2.49274} price={217.92} />
        </div>
        <div className="center-container">
          <TxTimer
            reset={status}
            value={value}
            onChange={this.handleChangeTxValue}
            onEnd={this.handleEndTxTimer}
          />
        </div>
        <div className="right-container">
          <Label weight="bold">YOU SHOULD RECEIVE</Label>
          <CoinData asset={target} assetValue={2.49274} price={217.92} />
          <Label weight="bold">EXPECTED FEES & SLIP</Label>
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
    const { view, txStatus } = this.props;
    const { dragReset, address, invalidAddress } = this.state;

    const swapData = this.getSwapData();

    if (!swapData) {
      return '';
    }

    const { source, target } = swapData;
    const targetData = assetsData.filter(data => data.asset !== source);
    const targetIndex = targetData.findIndex(value => value.asset === target);

    const dragTitle =
      view === 'detail' ? 'Drag to swap' : 'Drag to swap and send';

    const openSwapModal = txStatus.type === 'swap' ? txStatus.modal : false;
    const coinCloseIconType = txStatus.status ? 'fullscreen-exit' : 'close';

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
            {view === 'send' && (
              <Form className="recipient-form">
                <Label weight="bold">Recipient Address:</Label>
                <Form.Item className={invalidAddress ? 'has-error' : ''}>
                  <Input
                    placeholder="bnbeh456..."
                    sizevalue="normal"
                    value={address}
                    onChange={this.handleChange('address')}
                    ref={this.addressRef}
                  />
                  {invalidAddress && (
                    <div className="ant-form-explain">
                      Recipient address is invalid!
                    </div>
                  )}
                </Form.Item>
              </Form>
            )}
            <div className="swap-asset-card">
              <CoinCard
                title="You are swapping"
                asset={source}
                amount={1.354}
                price={600}
                withSelection
              />
              <img src={blackArrowIcon} alt="blackarrow-icon" />
              <CoinCard
                title="You will receive"
                asset={target}
                amount={13549}
                price={596}
                slip={2}
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
              onSelect={this.handleSelectTraget}
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
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      txStatus: state.App.txStatus,
    }),
    {
      setTxTimerType,
      setTxTimerModal,
      setTxTimerStatus,
      setTxTimerValue,
    },
  ),
  withRouter,
)(SwapDetail);
