import React from 'react';
import * as H from 'history';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';

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
import { TutorialContent } from '../../types';

const { X, Y, Px } = data;

type ComponentProps = {
  view?: string;
  history: H.History;
};

type State = {
  xValue: number;
};

type Props = RouteComponentProps & ComponentProps;

class Swap extends React.Component<Props, State> {
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
    const balance = formatCurrency((X + xValue) * Px);
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
            className={
              view === TutorialContent.PLAY ? 'contains-tooltip' : undefined
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
          <Label
            className="contains-tooltip"
            size="large"
            color="normal"
            weight="bold"
          >
            {view === TutorialContent.INTRO && formatNumber(Y)}
            {view === TutorialContent.PLAY && formatNumber(Y - outputToken)}
            {view === TutorialContent.INTRO && (
              <TooltipIcon text="Pools contain assets." placement="rightTop" />
            )}
            {view === TutorialContent.PLAY && (
              <TooltipIcon
                text="A small fee is retained in the pool to pay stakers."
                placement="rightTop"
              />
            )}
          </Label>
        </Centered>
        <Centered>
          <Label
            className={view === TutorialContent.INTRO ? 'contains-tooltip' : ''}
            size="large"
            color="normal"
          >
            {view === TutorialContent.INTRO && (
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
            {view === TutorialContent.INTRO && initPy}
            {view === TutorialContent.PLAY && outputPy}
            {view === TutorialContent.PLAY && (
              <TooltipIcon
                text="The price of the asset changes slightly due to the pool slip."
                placement="rightTop"
              />
            )}
            {view === TutorialContent.INTRO && (
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
    const { history } = this.props;

    const goBack = () => history.goBack();

    return (
      <Row className="bottom-nav-button">
        <Button color="primary" typevalue="ghost" onClick={goBack}>
          back
        </Button>
        <Link to="/tutorial/swap/double">
          <Button color="primary" typevalue="outline">
            Double
            <Icon type="arrow-right" />
          </Button>
        </Link>
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
    const times = (xValue + X) ** 2;
    const outputToken = (xValue * X * Y) / times;
    const outputPy = (Px * (X + xValue)) / (Y - outputToken);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = Math.round(((input - output) / input) * 100);

    return (
      <div className="swap-play-wrapper">
        <div className="token-swap-wrapper">
          <CoinInput
            title="Select token to swap:"
            asset="rune"
            amount={xValue}
            onChange={this.handleChangeX}
            price={Px}
            step={1000}
          />
        </div>
        {this.renderFlow(TutorialContent.PLAY)}
        <div className="token-receive-wrapper">
          <CoinInput
            title="Select token to receive:"
            asset="bnb"
            amount={outputToken}
            price={outputPy}
            slip={slip}
            step={1000}
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
            {view === TutorialContent.INTRO && (
              <Link to="/tutorial/swap/single/play">
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
                  A small fee proportional to the slip is paid to whoever put
                  assets in the pool. Fees are always fair and transparent.
                </Label>
              </>
            )}
          </Col>
          <Col span={20} className="tutorial-content">
            <Row className="tutorial-flow">
              {view === TutorialContent.INTRO && this.renderIntro()}
              {view === TutorialContent.PLAY && this.renderPlay()}
            </Row>
            {view === TutorialContent.PLAY && this.renderButtons()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(Swap);
