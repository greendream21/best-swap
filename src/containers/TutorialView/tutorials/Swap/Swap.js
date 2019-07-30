import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './Swap.style';
import Label from '../../../../components/uielements/label';
import Button from '../../../../components/uielements/button';

import {
  userAvatarIcon,
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
          <Col span="20" className="tutorial-content"></Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default Swap;
