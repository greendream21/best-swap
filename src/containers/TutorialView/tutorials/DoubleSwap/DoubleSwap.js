import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './DoubleSwap.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';
import CoinInput from '../../../../components/uielements/coins/coinInput';

import {
  orbGreenIcon,
  orbBlueIcon,
  arrowGreenIcon,
  arrowYellowIcon,
} from '../../../../components/icons';

import { formatCurrency, formatNumber } from '../../../../helpers/formatHelper';
import {
  data,
  getYValue,
  getZValue,
  getPx,
  getPz,
  getSlip,
  getBalanceA,
  getBalanceB,
} from './data';

const { X, Y, Z, R, Py, Pr } = data;

class DoubleSwap extends Component {
  static propTypes = {
    view: PropTypes.string,
  };

  static defaultProps = {
    view: 'doubleintro',
  };

  state = {
    xValue: 0,
  };

  handleChangeX = xValue => {
    this.setState({
      xValue,
    });
  };

  handleTry = () => {
    const URL = '/tutorial/swap/doubleplay';

    this.props.history.push(URL);
  };

  handleBack = () => {
    const { view } = this.props;

    if (view === 'doubleintro') {
      const URL = '/tutorial/swap/play';

      this.props.history.push(URL);
    }
    if (view === 'doubleplay') {
      const URL = '/tutorial/swap/doubleintro';

      this.props.history.push(URL);
    }
  };

  handleGotoStaking = () => {
    const URL = '/tutorial/pool/stakingintro';

    this.props.history.push(URL);
  };

  renderFlow = view => {
    const { xValue } = this.state;
    const yValue = getYValue(xValue);
    const zValue = getZValue(xValue);
    const balanceA = getBalanceA(yValue);
    const balanceB = getBalanceB(yValue);

    return (
      <div className="double-swap-flow-wrapper">
        <div className="double-swap-flow-row">
          <div className="swap-flow-wrapper">
            <Centered>
              <Label size="large" color="normal" weight="bold">
                BNB
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label
                className={view === 'doubleintro' && 'contains-tooltip'}
                size="large"
                color="normal"
                weight="bold"
              >
                RUNE
                {view === 'doubleintro' && (
                  <TooltipIcon
                    text="RUNE is the settlement asset."
                    placement="rightTop"
                  />
                )}
              </Label>
            </Centered>
            <Label
              className="header-label"
              size="normal"
              color="normal"
              weight="bold"
            >
              POOL
            </Label>
          </div>
          <div className="swap-flow-wrapper">
            <Centered>
              <Label size="large" color="normal" weight="bold">
                RUNE
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label size="large" color="normal" weight="bold">
                BOLT
              </Label>
            </Centered>
            <Label
              className="header-label"
              size="normal"
              color="normal"
              weight="bold"
            >
              POOL
            </Label>
          </div>
        </div>
        <div className="swap-flow-diagram">
          <img src={arrowYellowIcon} alt="arrow-yello" />
          <img className="reverse-image" src={orbGreenIcon} alt="orb-green" />
          <img src={arrowGreenIcon} alt="arrow-green" />
          <img src={orbBlueIcon} alt="orb-blue" />
          <img src={arrowGreenIcon} alt="arrow-green" />
        </div>
        <div className="double-swap-flow-row">
          <div className="swap-flow-wrapper">
            <Centered>
              <Label
                className={view === 'doubleplay' && 'contains-tooltip'}
                size="large"
                color="normal"
                weight="bold"
              >
                {view === 'doubleplay' && (
                  <TooltipIcon
                    text="The balances of the pool change."
                    placement="leftTop"
                  />
                )}
                {view === 'doubleintro' && formatNumber(X)}
                {view === 'doubleplay' && formatNumber(X + xValue)}
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label size="large" color="normal" weight="bold">
                {view === 'doubleintro' && formatNumber(Y)}
                {view === 'doubleplay' && formatNumber(Y - yValue)}
              </Label>
            </Centered>
            <Centered>
              <Label size="large" color="normal">
                {formatCurrency(balanceA)}
              </Label>
              <Label size="large" color="normal" />
              <Label size="large" color="normal">
                {formatCurrency(balanceA)}
              </Label>
            </Centered>
            <Centered>
              <Label size="large" color="normal">
                {view === 'doubleintro' && formatCurrency(getPx())}
                {view === 'doubleplay' && formatCurrency(getPx(xValue))}
              </Label>
              <Label size="large" color="normal" />
              <Label size="large" color="normal">
                {formatCurrency(Py)}
              </Label>
            </Centered>
            <Centered>
              <Label size="normal" color="normal">
                BNB Price
                <br />
                (pool)
              </Label>
              <Label size="normal" color="normal" />
              <Label
                className={view === 'doubleintro' && 'contains-tooltip'}
                size="normal"
                color="normal"
              >
                RUNE Price
                <br />
                (external)
                {view === 'doubleintro' && (
                  <TooltipIcon
                    text="RUNE price is always fixed."
                    placement="rightTop"
                  />
                )}
              </Label>
            </Centered>
          </div>
          <div className="swap-flow-wrapper">
            <Centered>
              <Label size="large" color="normal" weight="bold">
                {view === 'doubleintro' && formatNumber(R)}
                {view === 'doubleplay' && formatNumber(R + yValue)}
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label size="large" color="normal" weight="bold">
                {view === 'doubleintro' && formatNumber(Z)}
                {view === 'doubleplay' && formatNumber(Z - zValue)}
              </Label>
            </Centered>
            <Centered>
              <Label size="large" color="normal">
                {formatCurrency(balanceB)}
              </Label>
              <Label size="large" color="normal" />
              <Label size="large" color="normal">
                {formatCurrency(balanceB)}
              </Label>
            </Centered>
            <Centered>
              <Label size="large" color="normal">
                {formatCurrency(Pr)}
              </Label>
              <Label size="large" color="normal" />
              <Label size="large" color="normal">
                {view === 'doubleintro' && formatCurrency(getPz())}
                {view === 'doubleplay' && formatCurrency(getPz(xValue))}
              </Label>
            </Centered>
            <Centered>
              <Label size="normal" color="normal">
                RUNE Price
                <br />
                (external)
              </Label>
              <Label size="normal" color="normal" />
              <Label size="normal" color="normal">
                BOLT Price
                <br />
                (pool)
              </Label>
            </Centered>
          </div>
        </div>
      </div>
    );
  };

  renderButtons = () => {
    const { view } = this.props;

    return (
      <Row className="bottom-nav-button">
        <Button onClick={this.handleBack} color="primary" typevalue="ghost">
          back
        </Button>
        {view === 'doubleplay' && (
          <Button
            onClick={this.handleGotoStaking}
            color="primary"
            typevalue="outline"
          >
            Staking
            <Icon type="arrow-right" />
          </Button>
        )}
      </Row>
    );
  };

  renderIntro = () => {
    return (
      <div className="swap-intro-wrapper">{this.renderFlow('doubleintro')}</div>
    );
  };

  renderPlay = () => {
    const { xValue } = this.state;
    const zValue = getZValue(xValue);
    const slip = getSlip(xValue);
    const Px = getPx(xValue);
    const Pz = getPz(xValue);

    return (
      <div className="swap-play-wrapper">
        <div className="token-swap-wrapper">
          <CoinInput
            title="Select token to swap:"
            asset="bnb"
            amount={xValue}
            onChange={this.handleChangeX}
            price={Px.toFixed(2)}
            step={10}
          />
        </div>
        {this.renderFlow('doubleplay')}
        <div className="token-receive-wrapper">
          <CoinInput
            title="Select token to receive:"
            asset="bolt"
            amount={zValue.toFixed(2)}
            price={Pz.toFixed(2)}
            slip={slip}
            reverse
          />
          <TooltipIcon
            className="token-receiver-tooltip"
            text="The assets you receive are based on depth of the pool and trade slip."
            placement="rightTop"
          />
        </div>
      </div>
    );
  };

  render() {
    const { view } = this.props;

    return (
      <ContentWrapper className="tutorial-swap-wrapper">
        <Row>
          <Col span="4" className="intro-text">
            <Label size="normal" weight="bold" color="normal">
              DOUBLE SWAP
            </Label>
            <Label size="small" color="dark">
              You can swap one token for another by sending them across two
              pools.
            </Label>
            <Label size="small" color="dark">
              The swaps are calculated by factoring the price ratios in both
              pools.
            </Label>
            <Label size="small" color="dark">
              You can swap both ways, or swap and send to someone else.
            </Label>
            {view === 'doubleintro' && (
              <Button
                className="try-btn"
                onClick={this.handleTry}
                typevalue="outline"
              >
                try
              </Button>
            )}
            {view === 'doubleplay' && (
              <>
                <Label size="small" color="dark">
                  When you swap, you change the balances of the assets in the
                  pool, creating a <strong>SLIP</strong> since it changes the
                  price.
                </Label>
                <Label size="small" color="dark">
                  The deeper the pool, or the smaller your transaction, the less
                  slip.
                </Label>
                <Label size="small" color="dark">
                  Fees are paid in both pools, but as long as the pools are
                  deep, the fees are very small.
                </Label>
              </>
            )}
          </Col>
          <Col span="20" className="tutorial-content">
            <Row className="tutorial-flow">
              {view === 'doubleintro' && this.renderIntro()}
              {view === 'doubleplay' && this.renderPlay()}
            </Row>
            {this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(DoubleSwap);
