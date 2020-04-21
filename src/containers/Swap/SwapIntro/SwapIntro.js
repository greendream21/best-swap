import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { ContentWrapper } from './SwapIntro.style';
import Label from '../../../components/uielements/label';
import Button from '../../../components/uielements/button';

import {
  userAvatarIcon,
  orbGreenIcon,
  arrowGreenIcon,
  arrowYellowIcon,
} from '../../../components/icons';

class Swap extends Component {
  render() {
    return (
      <ContentWrapper>
        <Row className="swap-content-pool-text">
          <Col span={8}>
            <Label size="normal" weight="bold" color="normal">
              SWAP
            </Label>
            <Label size="small" color="dark">
              You can swap assets by sending them into pools containing BNB and
              BEP2 tokens.
            </Label>
            <Label size="small" color="dark">
              Swaps are calculated at prices relative to the ratio of assets in
              the pools
            </Label>
            <Label size="small" color="dark">
              You can swap both ways or swap and send to someone else.
            </Label>
          </Col>
        </Row>
        <Row className="rune-diagram-wrapper">
          <Col span={15}>
            <div className="rune-diagram-images">
              <img src={userAvatarIcon} alt="user-avatar" />
              <img src={arrowGreenIcon} alt="arrow-green" />
              <img src={orbGreenIcon} alt="orb-green" />
              <img src={arrowYellowIcon} alt="arrow-yellow" />
              <img src={userAvatarIcon} alt="user-avatar" />
            </div>
            <div className="rune-diagram-text">
              <Label size="big" weight="bold">
                RUNE:BNB
              </Label>
            </div>
          </Col>
          <Col span={7} offset={2}>
            <Label size="small" color="dark">
              When you swap. you change the balances of the assets in the pool,
              creating a <strong>SLIP</strong> since it changes the price.
            </Label>

            <Label size="small" color="dark">
              The deeper the pool, or the smaller your transaction, the less
              slip.
            </Label>

            <Label size="small" color="dark">
              A small fee proportional to the slip is paid to whoever put assets
              in the pool. Fees are always fair and transparent.
            </Label>
          </Col>
        </Row>
        <Row className="bottom-nav-button">
          <Link to="/introduction/pools">
            <Button color="primary" typevalue="outline">
              pools
              <ArrowRightOutlined />
            </Button>
          </Link>
        </Row>
      </ContentWrapper>
    );
  }
}

export default Swap;
