import React from 'react';
import * as H from 'history';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { TokenAmount, tokenAmount,
  formatTokenAmount,
  formatTokenAmountCurrency,
} from '@thorchain/asgardex-token';
import { ContentWrapper } from './Stake.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';
import CoinInput from '../../../../components/uielements/coins/coinInput';

import { orbGreenIcon, arrowGreenIcon } from '../../../../components/icons';

import { data, getVr, getSS, getVss } from './data';
import { TutorialContent } from '../../types';

const { R, T, Pr, Pt } = data;

type ComponentProps = {
  view?: string;
  history: H.History;
};

type Props = RouteComponentProps & ComponentProps;

type State = {
  rValue: TokenAmount;
  tValue: TokenAmount;
};

class Stake extends React.Component<Props, State> {
  static readonly defaultProps: Partial<Props> = {
    view: TutorialContent.INTRO,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      rValue: tokenAmount(0),
      tValue: tokenAmount(0),
    };
  }

  handleChangeRValue = (value: number | undefined) => {
    this.setState({
      rValue: tokenAmount(value),
    });
  };

  handleChangeTValue = (value: number | undefined) => {
    this.setState({
      tValue: tokenAmount(value),
    });
  };

  renderFlow = (view: TutorialContent) => {
    const { rValue, tValue } = this.state;
    const Vr = getVr(rValue);
    const VrFormatted = formatTokenAmount(Vr);
    const VtFormatted = VrFormatted;
    const ss = getSS(rValue, tValue);
    const ssFormatted = `${formatTokenAmount(ss)}%`;
    const Vss = getVss(rValue, tValue);
    const VssFormatted = formatTokenAmountCurrency(Vss);

    return (
      <div className="stake-flow-wrapper">
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
        <div className="stake-flow-diagram">
          <div className="arrow-image">
            <img src={arrowGreenIcon} alt="arrow-green" />
          </div>
          <img src={orbGreenIcon} alt="arrow-green" />
          <div className="arrow-image contains-tooltip">
            <img
              className="reverse-image"
              src={arrowGreenIcon}
              alt="arrow-yello"
            />
            {view === TutorialContent.INTRO && (
              <TooltipIcon
                text="You stake on both sides of the pool."
                placement="rightTop"
              />
            )}
          </div>
        </div>
        <Centered>
          <Label size="large" color="normal" weight="bold">
            {view === TutorialContent.INTRO && formatTokenAmount(R)}
            {view === TutorialContent.PLAY &&
              // formula: R + rValue
              formatTokenAmount(tokenAmount(R.amount().plus(rValue.amount())))}
          </Label>
          <Label size="large" color="normal" weight="bold">
            :
          </Label>
          <Label size="large" color="normal" weight="bold">
            {view === TutorialContent.INTRO && formatTokenAmount(T)}
            {view === TutorialContent.PLAY &&
              // formula: T + tValue
              formatTokenAmount(tokenAmount(T.amount().plus(tValue.amount())))}
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            {VrFormatted}
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            {VtFormatted}
          </Label>
        </Centered>
        <div className="center-text">
          <Label size="large" color="normal" weight="bold">
            {ssFormatted}
          </Label>
        </div>
        <div className="center-text description-label">
          <Label size="big" color="normal">
            YOUR POOL SHARE
          </Label>
        </div>
        <Centered>
          <Label />
          <Label size="large" color="normal" weight="bold">
            {VssFormatted}
          </Label>
          <Label className="contains-tooltip">
            <span />
            {view === TutorialContent.INTRO && (
              <TooltipIcon
                text="You own a share of the pool."
                placement="rightTop"
              />
            )}
          </Label>
        </Centered>
        <div className="center-text description-label">
          <Label size="big" color="normal">
            YOUR ASSET SHARE
          </Label>
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
          <Link to="/tutorial/pool/earn">
            <Button color="primary" typevalue="outline">
              Earning
              <ArrowRightOutlined />
            </Button>
          </Link>
        )}
      </Row>
    );
  };

  renderIntro = () => {
    return (
      <div className="stake-intro-wrapper">
        {this.renderFlow(TutorialContent.INTRO)}
      </div>
    );
  };

  renderPlay = () => {
    const { rValue, tValue } = this.state;

    return (
      <div className="stake-play-wrapper">
        <div className="token-stake-wrapper">
          <CoinInput
            title="Token to stake:"
            asset="rune"
            amount={rValue}
            onChange={this.handleChangeRValue}
            price={Pr}
            step={100000}
          />
        </div>
        {this.renderFlow(TutorialContent.PLAY)}
        <div className="token-stake-wrapper">
          <CoinInput
            title="Token to stake:"
            asset="bolt"
            amount={tValue}
            onChange={this.handleChangeTValue}
            price={Pt}
            step={200000}
            reverse
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
              STAKE
            </Label>
            <Label size="small" color="dark">
              You can stake your assets in any of the pools.
            </Label>
            <Label size="small" color="dark">
              Each trade on the pool earns a commission which you can later
              claim.
            </Label>
            <Label size="small" color="dark">
              Choose pools with low liquidity and high volume for maximum
              earnings.
            </Label>
            {view === TutorialContent.INTRO && (
              <Link to="/tutorial/pool/stake/play">
                <Button className="try-btn" typevalue="outline">
                  try
                </Button>
              </Link>
            )}
            {view === TutorialContent.PLAY && (
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

export default withRouter(Stake);
