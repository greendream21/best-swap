import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './Trade.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';
import CoinInput from '../../../../components/uielements/coins/coinInput';
import InputForm from '../../../../components/uielements/inputForm';

import {
  orbGreenIcon,
  arrowYellowIcon,
  arrowGreenIcon,
  marketIcon,
} from '../../../../components/icons';

import { formatNumber, formatCurrency } from '../../../../helpers/formatHelper';
import { data, getVx, getPy, getGain, getYValue } from './data';
import Slider from '../../../../components/uielements/slider';

const { X, Y, Px, xm } = data;

class Trade extends Component {
  static propTypes = {
    view: PropTypes.string,
  };

  static defaultProps = {
    view: 'intro',
  };

  state = {
    xValue: 0,
    yValue: 0,
  };

  handleChangeValue = name => value => {
    this.setState({
      [name]: value,
    });
  };

  handleTry = () => {
    const URL = '/tutorial/trade/tradingplay';

    this.props.history.push(URL);
  };

  handleBack = () => {
    const { view } = this.props;

    if (view === 'tradingintro') {
      const URL = '/tutorial/pool/earningplay';

      this.props.history.push(URL);
    }
    if (view === 'tradingplay') {
      const URL = '/tutorial/trade/tradingintro';

      this.props.history.push(URL);
    }
  };

  handleFinish = () => {
    const URL = '/';

    this.props.history.push(URL);
  };

  renderFlow = view => {
    const { xValue, yValue } = this.state;
    const Vx = formatCurrency(getVx(xValue));
    const Vy = Vx;
    const Py = formatCurrency(getPy(xValue, yValue));

    return (
      <div className="trade-flow-wrapper">
        <Centered>
          <Label size="large" color="normal" weight="bold">
            RUNE
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label size="large" color="normal" weight="bold">
            BEP2
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
        <div className="trade-flow-diagram">
          <img src={arrowGreenIcon} alt="arrow-green" />
          <img src={orbGreenIcon} alt="orb-green" />
          <img src={arrowYellowIcon} alt="arrow-yello" />
        </div>
        <Centered>
          <Label size="large" color="normal" weight="bold">
            {view === 'tradingintro' && formatNumber(X)}
            {view === 'tradingplay' && formatNumber(X + xValue)}
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label size="large" color="normal" weight="bold">
            {view === 'tradingintro' && formatNumber(Y)}
            {view === 'tradingplay' && formatNumber(Y - yValue)}
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            {Vx}
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            {Vy}
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            {formatCurrency(Px)}
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            {view === 'tradingintro' && formatCurrency(Px)}
            {view === 'tradingplay' && Py}
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
            BEP2 Price
            <br />
            (pool)
          </Label>
        </Centered>
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
        {view === 'tradingplay' && (
          <Button
            onClick={this.handleFinish}
            color="primary"
            typevalue="outline"
          >
            Finish
            <Icon type="arrow-right" />
          </Button>
        )}
      </Row>
    );
  };

  renderIntro = () => {
    return (
      <div className="trade-play-wrapper">
        <div className="trade-diagram">
          {this.renderFlow('tradingintro')}
          <div className="market-diagram-wrapper">
            <div className="center-text">
              <Label size="large" color="normal" weight="bold">
                MARKET
              </Label>
            </div>
            <div className="trade-flow-diagram">
              <img src={marketIcon} alt="market" />
            </div>
            <Centered>
              <Label size="large" color="normal" weight="bold">
                {formatCurrency(xm)}
              </Label>
              <Label size="large" color="normal" weight="bold" />
              <Label size="large" color="normal" weight="bold">
                <TooltipIcon
                  text="The market is any other exchange, like Binance DEX."
                  placement="rightTop"
                />
              </Label>
            </Centered>
          </div>
        </div>
      </div>
    );
  };

  renderPlay = () => {
    const { xValue, yValue } = this.state;
    const yTotal = formatCurrency(getYValue(xValue, yValue));
    const gain = formatCurrency(getGain(xValue, yValue));

    return (
      <div className="trade-play-wrapper">
        <div className="token-wrapper">
          <CoinInput
            title="Select token to swap:"
            asset="rune"
            amount={xValue}
            onChange={this.handleChangeValue('xValue')}
            price={Px}
          />
          <Slider
            min={0}
            max={100000}
            value={xValue}
            onChange={this.handleChangeValue('xValue')}
          />
          <TooltipIcon
            text="Adjust your trade to meet your expectations of price."
            placement="rightTop"
          />
        </div>
        <div className="trade-diagram">
          {this.renderFlow('tradingplay')}
          <div className="market-diagram-wrapper">
            <div className="center-text">
              <Label size="large" color="normal" weight="bold">
                MARKET
              </Label>
            </div>
            <div className="trade-flow-diagram">
              <img src={marketIcon} alt="market" />
            </div>
            <Centered>
              <Label size="large" color="normal" weight="bold">
                {xm}
              </Label>
              <Label size="large" color="normal" weight="bold" />
              <Label size="large" color="normal" weight="bold">
                <TooltipIcon
                  text="The market is any other exchange, like Binance DEX."
                  placement="rightTop"
                />
              </Label>
            </Centered>
          </div>
        </div>
        <div className="token-wrapper">
          <InputForm
            title="PAYOUT:"
            type="bep2"
            value={yValue}
            onChange={this.handleChangeValue('yValue')}
            reverse
          />
          <Label className="payout-price-label" color="gray">
            {yTotal} (USD)
          </Label>
          <Label size="big" weight="bold">
            GAIN: {gain}
          </Label>
          <TooltipIcon
            text="The gain is dependent on the size of your trade and slip."
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
              TRADING
            </Label>
            <Label size="small" color="dark">
              Pool prices are always calculated based on the ratio of assets in
              the pool.
            </Label>
            <Label size="small" color="dark">
              Assets are always priced against the BNB in the pool.
            </Label>
            <Label size="small" color="dark">
              Pool prices change when people swap assets, or when the wider
              market price moves.
            </Label>
            {view === 'tradingintro' && (
              <Button
                className="try-btn"
                onClick={this.handleTry}
                typevalue="outline"
              >
                try
              </Button>
            )}
            {view === 'tradingplay' && (
              <>
                <Label size="small" color="dark">
                  If the <strong>POOL PRICE</strong> is different to{' '}
                  <strong>MARKET PRICE</strong> - this is your opportunity to
                  trade.
                </Label>
                <Label size="small" color="dark">
                  You can buy cheap assets at a <strong>DISCOUNT</strong> or
                  sell them at a <strong>PREMIUM</strong> to the market.
                </Label>
                <Label size="small" color="dark">
                  The first to trade wins the opportunity.
                </Label>
              </>
            )}
          </Col>
          <Col span="20" className="tutorial-content">
            <Row className="tutorial-flow">
              {view === 'tradingintro' && this.renderIntro()}
              {view === 'tradingplay' && this.renderPlay()}
            </Row>
            {this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(Trade);
