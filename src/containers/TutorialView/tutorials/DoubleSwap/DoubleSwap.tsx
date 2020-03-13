import React from 'react';
import * as H from 'history';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';

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
import { Nothing } from '../../../../types/bepswap';
import { TutorialContent } from '../../types';

const { X, Y, Z, R, Py, Pr } = data;

type ComponentProps = {
  view?: string;
  history: H.History;
};

type Props = RouteComponentProps & ComponentProps;

type State = {
  xValue: number;
};

class DoubleSwap extends React.Component<Props, State> {
  static readonly defaultProps: Partial<Props> = {
    view: TutorialContent.INTRO,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      xValue: 0,
    };
  }

  handleChangeX = (xValue: number | undefined) => {
    this.setState({
      xValue: xValue || 0,
    });
  };

  renderFlow = (view: TutorialContent) => {
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
                className={
                  view === TutorialContent.INTRO ? 'contains-tooltip' : ''
                }
                size="large"
                color="normal"
                weight="bold"
              >
                RUNE
                {view === TutorialContent.INTRO && (
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
                className={
                  view === TutorialContent.PLAY ? 'contains-tooltip' : ''
                }
                size="large"
                color="normal"
                weight="bold"
              >
                {view === TutorialContent.PLAY && (
                  <TooltipIcon
                    text="The balances of the pool change."
                    placement="leftTop"
                  />
                )}
                {view === TutorialContent.INTRO && formatNumber(X)}
                {view === TutorialContent.PLAY && formatNumber(X + xValue)}
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label size="large" color="normal" weight="bold">
                {view === TutorialContent.INTRO && formatNumber(Y)}
                {view === TutorialContent.PLAY && formatNumber(Y - yValue)}
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
                {view === TutorialContent.INTRO &&
                  formatCurrency(getPx(Nothing))}
                {view === TutorialContent.PLAY && formatCurrency(getPx(xValue))}
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
                className={
                  view === TutorialContent.INTRO ? 'contains-tooltip' : ''
                }
                size="normal"
                color="normal"
              >
                RUNE Price
                <br />
                (external)
                {view === TutorialContent.INTRO && (
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
                {view === TutorialContent.INTRO && formatNumber(R)}
                {view === TutorialContent.PLAY && formatNumber(R + yValue)}
              </Label>
              <Label size="large" color="normal" weight="bold">
                :
              </Label>
              <Label size="large" color="normal" weight="bold">
                {view === TutorialContent.INTRO && formatNumber(Z)}
                {view === TutorialContent.PLAY && formatNumber(Z - zValue)}
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
                {view === TutorialContent.INTRO &&
                  formatCurrency(getPz(Nothing))}
                {view === TutorialContent.PLAY && formatCurrency(getPz(xValue))}
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
    const { view, history } = this.props;

    const goBack = () => history.goBack();

    return (
      <Row className="bottom-nav-button">
        <Button color="primary" typevalue="ghost" onClick={goBack}>
          back
        </Button>
        {view === TutorialContent.PLAY && (
          <Link to="/tutorial/pool/stake">
            <Button color="primary" typevalue="outline">
              Staking
              <Icon type="arrow-right" />
            </Button>
          </Link>
        )}
      </Row>
    );
  };

  renderIntro = () => {
    return (
      <div className="swap-intro-wrapper">
        {this.renderFlow(TutorialContent.INTRO)}
      </div>
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
            price={Px}
            step={10}
          />
        </div>
        {this.renderFlow(TutorialContent.PLAY)}
        <div className="token-receive-wrapper">
          <CoinInput
            title="Select token to receive:"
            asset="bolt"
            amount={zValue}
            price={Pz}
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
          <Col span={4} className="intro-text">
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
            {view === TutorialContent.INTRO && (
              <Link to="/tutorial/swap/double/play">
                <Button className="try-btn" typevalue="outline">
                  try
                </Button>
              </Link>
            )}
            {view === TutorialContent.PLAY && (
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
          <Col span={20} className="tutorial-content">
            <Row className="tutorial-flow">
              {view === TutorialContent.INTRO && this.renderIntro()}
              {view === TutorialContent.PLAY && this.renderPlay()}
            </Row>
            {this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(DoubleSwap);
