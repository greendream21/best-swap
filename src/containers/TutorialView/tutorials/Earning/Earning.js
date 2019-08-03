import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './Earning.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';
import InputForm from '../../../../components/uielements/inputForm';

import {
  orbBlueIcon,
  arrowTwoIcon,
  arrowGreenIcon,
} from '../../../../components/icons';

import { formatNumber, formatCurrency } from '../../../../helpers/formatHelper';
import {
  data,
  getVr,
  getSSValue,
  getSS,
  getVss,
  getVssValue,
  getWr,
  getWt,
} from './data';
import Slider from '../../../../components/uielements/slider';

const { R, T, WR, WT, VWR } = data;

class Earning extends Component {
  static propTypes = {
    view: PropTypes.string,
  };

  static defaultProps = {
    view: 'intro',
  };

  state = {
    rValue: 200000,
    tValue: 400000,
    wss: 0,
  };

  handleChangeValue = name => value => {
    this.setState({
      [name]: value,
    });
  };

  handleTry = () => {
    const URL = '/tutorial/pool/earningplay';

    this.props.history.push(URL);
  };

  handleBack = () => {
    const { view } = this.props;

    if (view === 'earningintro') {
      const URL = '/tutorial/pool/stakingplay';

      this.props.history.push(URL);
    }
    if (view === 'earningplay') {
      const URL = '/tutorial/pool/earningintro';

      this.props.history.push(URL);
    }
  };

  handleGotoTrading = () => {
    const URL = '/tutorial/trade/intro';

    this.props.history.push(URL);
  };

  renderFlow = view => {
    const { rValue, tValue, wss } = this.state;
    const Vr = formatCurrency(getVr(rValue));
    const Vt = Vr;
    const ss = `${Math.round(getSS(wss))}%`;
    const Vss = formatCurrency(getVss(wss));
    const ssValue = `${Math.round(getSSValue(rValue, tValue))}%`;
    const VssValue = formatCurrency(getVssValue(rValue, tValue));

    return (
      <div className="earning-flow-wrapper">
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
        <div className="earning-flow-diagram">
          {view === 'earningintro' && (
            <img src={arrowTwoIcon} alt="arrow-green" />
          )}
          {view === 'earningplay' && (
            <img src={arrowGreenIcon} alt="arrow-green" />
          )}
          <img src={orbBlueIcon} alt="arrow-green" />
          {view === 'earningintro' && (
            <img src={arrowTwoIcon} alt="arrow-green" />
          )}
          {view === 'earningplay' && (
            <img
              className="reverse-image"
              src={arrowGreenIcon}
              alt="arrow-yello"
            />
          )}
        </div>
        <Centered>
          <Label size="large" color="normal" weight="bold">
            {view === 'earningintro' && formatNumber(R + rValue)}
            {view === 'earningplay' && formatNumber(WR)}
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label size="large" color="normal" weight="bold">
            {view === 'earningintro' && formatNumber(T + tValue)}
            {view === 'earningplay' && formatNumber(WT)}
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            {view === 'earningintro' && Vr}
            {view === 'earningplay' && formatCurrency(VWR)}
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            {view === 'earningintro' && Vt}
            {view === 'earningplay' && formatCurrency(VWR)}
          </Label>
        </Centered>
        <div className="center-text">
          <Label size="large" color="normal" weight="bold">
            {view === 'earningintro' && ssValue}
            {view === 'earningplay' && ss}
          </Label>
        </div>
        <div className="center-text">
          <Label size="big" color="normal">
            YOUR POOL SHARE
          </Label>
        </div>
        <Centered>
          <Label></Label>
          <Label size="large" color="normal" weight="bold">
            {view === 'earningintro' && VssValue}
            {view === 'earningplay' && Vss}
          </Label>
          <Label className="contains-tooltip"></Label>
        </Centered>
        <div className="center-text">
          <Label size="big" color="normal">
            YOUR ASSET SHARE
          </Label>
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
        {view === 'earningplay' && (
          <Button
            onClick={this.handleGotoTrading}
            color="primary"
            typevalue="outline"
          >
            Trading
            <Icon type="arrow-right" />
          </Button>
        )}
      </Row>
    );
  };

  renderIntro = () => {
    const { rValue, tValue } = this.state;

    return (
      <div className="earning-play-wrapper">
        <div className="token-wrapper">
          <InputForm
            title="Add earnings:"
            type="rune"
            value={rValue}
            onChange={this.handleChangeValue('rValue')}
          />
          <TooltipIcon
            text="This simulates daily trading - which you can't control."
            placement="rightTop"
          />
        </div>
        {this.renderFlow('earningintro')}
        <div className="token-wrapper">
          <InputForm
            title="Add earnings:"
            type="bolt"
            value={tValue}
            onChange={this.handleChangeValue('tValue')}
            reverse
          />
          <TooltipIcon
            className="token-receiver-tooltip"
            text="Earnings accrue on both sides of the pool."
            placement="rightTop"
          />
        </div>
      </div>
    );
  };

  renderPlay = () => {
    const { wss } = this.state;
    const Wr = getWr(wss);
    const Wt = getWt(wss);

    return (
      <div className="earning-play-wrapper">
        <div className="token-wrapper">
          <InputForm title="PAYOUT:" type="rune" value={Wr} />
          <InputForm
            title="Withdraw share:"
            type="%"
            value={wss}
            onChange={this.handleChangeValue('wss')}
          />
          <Slider value={wss} onChange={this.handleChangeValue('wss')} />
        </div>
        {this.renderFlow('earningplay')}
        <div className="token-wrapper">
          <InputForm title="PAYOUT:" type="bolt" value={Wt} reverse />
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
              EARNINGS
            </Label>
            <Label size="small" color="dark">
              When people trade across a pool you own a share of, earnings are
              captured.
            </Label>
            <Label size="small" color="dark">
              Earnings are proportional to depth of the pool, and daily volume.
            </Label>
            <Label size="small" color="dark">
              You can withdraw your earnings at any time.
            </Label>
            {view === 'earningintro' && (
              <Button
                className="try-btn"
                onClick={this.handleTry}
                typevalue="outline"
              >
                try
              </Button>
            )}
            {view === 'earningplay' && (
              <>
                <Label size="small" color="dark">
                  Since anyone can <strong>stake</strong> alongside you, you own
                  a share of the pool which adjusts if people join or leave.
                </Label>
                <Label size="small" color="dark">
                  As trades happen the asset balances will change, but your
                  share won’t.
                </Label>
                <Label size="small" color="dark">
                  Asset values may also change whilst you stake. You can
                  withdraw your assets plus any earnings at any time.
                </Label>
              </>
            )}
          </Col>
          <Col span="20" className="tutorial-content">
            <Row className="tutorial-flow">
              {view === 'earningintro' && this.renderIntro()}
              {view === 'earningplay' && this.renderPlay()}
            </Row>
            {this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(Earning);
