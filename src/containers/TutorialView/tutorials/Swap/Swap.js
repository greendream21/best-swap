import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './Swap.style';
import Centered from '../../../../components/utility/centered';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';
import TooltipIcon from '../../../../components/uielements/tooltipIcon';

import {
  orbGreenIcon,
  arrowGreenIcon,
  arrowYellowIcon,
} from '../../../../components/icons';

class Swap extends Component {
  static propTypes = {
    onNext: PropTypes.func.isRequired,
  };

  state = {
    tried: false,
  };

  handleTry = () => {
    this.setState({
      tried: true,
    });
  };

  renderFlow = () => {
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
          <Label size="large" color="normal" weight="bold">
            1,000,000
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
            1000
            <TooltipIcon content="Pools contain assets." placement="rightTop" />
          </Label>
        </Centered>
        <Centered>
          <Label className="contains-tooltip" size="large" color="normal">
            <TooltipIcon
              content="The value of assets must always be equal."
              placement="leftTop"
            />
            $40,000.00
          </Label>
          <Label size="large" color="normal" />
          <Label size="large" color="normal">
            $40,000.00
          </Label>
        </Centered>
        <Centered>
          <Label size="large" color="normal">
            $0.04
          </Label>
          <Label size="large" color="normal" />
          <Label className="contains-tooltip" size="large" color="normal">
            $40.00
            <TooltipIcon
              content="The price of the asset is based on the value of RUNE."
              placement="rightTop"
            />
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

  render() {
    const { tried } = this.state;

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
            {!tried && (
              <Button
                className="try-btn"
                onClick={this.handleTry}
                typevalue="outline"
              >
                try
              </Button>
            )}
            {tried && (
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
            {this.renderFlow()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default Swap;
