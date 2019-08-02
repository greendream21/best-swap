import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './Swap.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';
import CoinInput from '../../../../components/uielements/coins/coinInput';

import {
  orbGreenIcon,
  arrowGreenIcon,
  arrowYellowIcon,
} from '../../../../components/icons';

import { formatNumber, formatCurrency } from '../../../../helpers/formatHelper';
import { data } from './data';

const { X, Y, Px } = data;

class Swap extends Component {
  static propTypes = {
    view: PropTypes.string,
  };

  static defaultProps = {
    view: 'intro',
  };

  state = {
    xValue: 0,
  };

  handleChangeValue = name => value => {
    this.setState({
      [name]: value,
    });
  };

  handleTry = () => {
    const URL = '/tutorial/swap/play';

    this.props.history.push(URL);
  };

  handleBack = () => {
    const URL = '/tutorial/swap/intro';

    this.props.history.push(URL);
  };

  handleGotoDouble = () => {
    const URL = '/tutorial/swap/doubleintro';

    this.props.history.push(URL);
  };

  renderFlow = view => {
    const { xValue } = this.state;
    const balance = formatCurrency(X * Px);
    const initPy = formatCurrency(Px * (X / Y));
    const times = (xValue + X) ** 2;
    const outputToken = (xValue * X * Y) / times;
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);

    return (
      <div className="swap-flow-wrapper">
        <Centered>
          <Label size="large" color="normal" weight="bold">
            RUNE
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label size="large" color="normal" weight="bold">
            BNB
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
        <div className="swap-flow-diagram">
          <img src={arrowGreenIcon} alt="arrow-green" />
          <img src={orbGreenIcon} alt="arrow-green" />
          <img src={arrowYellowIcon} alt="arrow-yello" />
        </div>
        <Centered>
          <Label
            className={view === 'play' && 'contains-tooltip'}
            size="large"
            color="normal"
            weight="bold"
          >
            {view === 'play' && (
              <TooltipIcon
                text="The balances of the pool change."
                placement="leftTop"
              />
            )}
            {view === 'intro' && formatNumber(X)}
            {view === 'play' && formatNumber(X + xValue)}
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label
            className="contains-tooltip"
            size="large"
            color="normal"
            weight="bold"
          >
            {view === 'intro' && formatNumber(Y)}
            {view === 'play' && formatNumber(Y - outputToken)}
            {view === 'intro' && (
              <TooltipIcon text="Pools contain assets." placement="rightTop" />
            )}
            {view === 'play' && (
              <TooltipIcon
                text="A small fee is retained in the pool to pay stakers."
                placement="rightTop"
              />
            )}
          </Label>
        </Centered>
        <Centered>
          <Label
            className={view === 'intro' && 'contains-tooltip'}
            size="large"
            color="normal"
          >
            {view === 'intro' && (
              <TooltipIcon
                text="The value of assets must always be equal."
                placement="leftTop"
              />
            )}
            {balance}
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            {balance}
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            {formatCurrency(Px)}
          </Label>
          <Label size="large" color="normal" />
          <Label className="contains-tooltip" size="large" color="normal">
            {view === 'intro' && initPy}
            {view === 'play' && outputPy}
            {view === 'play' && (
              <TooltipIcon
                text="The price of the asset changes slightly due to the pool slip."
                placement="rightTop"
              />
            )}
            {view === 'intro' && (
              <TooltipIcon
                text="The price of the asset is based on the value of RUNE."
                placement="rightTop"
              />
            )}
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
            BNB Price
            <br />
            (pool)
          </Label>
        </Centered>
      </div>
    );
  };

  renderButtons = () => {
    return (
      <Row className="bottom-nav-button">
        <Button onClick={this.handleBack} color="primary" typevalue="ghost">
          back
        </Button>
        <Button
          onClick={this.handleGotoDouble}
          color="primary"
          typevalue="outline"
        >
          Double
          <Icon type="arrow-right" />
        </Button>
      </Row>
    );
  };

  renderPlay = () => {
    const { xValue } = this.state;
    const times = (xValue + X) ** 2;
    const outputToken = ((xValue * X * Y) / times).toFixed(2);
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const slip = (xValue * (xValue + 2 * X)) / times;

    return (
      <div className="swap-play-wrapper">
        <div className="token-swap-wrapper">
          <CoinInput
            title="Select token to swap:"
            asset="rune"
            amount={xValue}
            onChange={this.handleChangeValue('xValue')}
            price={0.04}
          />
        </div>
        {this.renderFlow('play')}
        <div className="token-receive-wrapper">
          <CoinInput
            title="Select token to receive:"
            asset="bnb"
            amount={outputToken}
            price={outputPy}
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
              SWAP
            </Label>
            <Label size="small" color="dark">
              You swap assets by sending them into pools containing RUNE and
              other assets.
            </Label>
            <Label size="small" color="dark">
              Swaps are calculated at prices relative to the ratio of assets in
              the pools.
            </Label>
            <Label size="small" color="dark">
              You can swap both ways, or swap and send to someone else.
            </Label>
            {view === 'intro' && (
              <Button
                className="try-btn"
                onClick={this.handleTry}
                typevalue="outline"
              >
                try
              </Button>
            )}
            {view === 'play' && (
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
                  A small fee proportional to the slip is paid to whoever put
                  assets in the pool. Fees are always fair and transparent.
                </Label>
              </>
            )}
          </Col>
          <Col span="20" className="tutorial-content">
            <Row className="tutorial-flow">
              {view === 'intro' && this.renderFlow('intro')}
              {view === 'play' && this.renderPlay()}
            </Row>
            {view === 'play' && this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(Swap);
