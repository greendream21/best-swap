/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

import { ContentWrapper } from './PoolIntro.style';
import Label from '../../../components/uielements/label';
import Button from '../../../components/uielements/button';

import {
  userAvatarIcon,
  orbBlueIcon,
  orbGreenIcon,
  arrowDashIcon,
} from '../../../components/icons';

class Pool extends Component {
  render() {
    return (
      <ContentWrapper>
        <Row className="pool-content-text">
          <Col span={8}>
            <Label size="normal" weight="bold" color="normal">
              POOL
            </Label>
            <Label size="small" color="dark">
              You can stake your assets in any of the pools.
            </Label>
            <Label size="small" color="dark">
              Each trade on the pool earns a commission which you can later
              claim
            </Label>
            <Label size="small" color="dark">
              Choose pools with low liquidity and high volume for maximum
              earnings.
            </Label>
          </Col>
        </Row>
        <Row className="rune-diagram-wrapper">
          <Col span={15}>
            <Row>
              <Col span={6} className="user-avatar-image">
                <img src={userAvatarIcon} alt="user-avatar" />
              </Col>
              <Col span={18} className="rune-diagram">
                <div className="rune-bnb-diagram">
                  <img src={arrowDashIcon} alt="arrow-dash" />
                  <img src={orbGreenIcon} alt="orb-green" />
                  <Label size="big" weight="bold">
                    RUNE:BNB
                  </Label>
                </div>
                <div className="rune-eth-diagram">
                  <img src={arrowDashIcon} alt="arrow-dash" />
                  <img src={orbBlueIcon} alt="orb-blue" />
                  <Label size="big" weight="bold">
                    RUNE:ETH
                  </Label>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={7} offset={2}>
            <Label size="small" color="dark">
              Since anyone can stake alongside you, you own a share of the pool
              which adjusts if people join or leave.
            </Label>

            <Label size="small" color="dark">
              As a trades happen the asset balances will change, but your share
              won't.
            </Label>

            <Label size="small" color="dark">
              Asset values may also change whilst you stake.
              <br />
              You can withdraw your assets plus any earnings at any time.
            </Label>
          </Col>
        </Row>
        <Row className="bottom-nav-button">
          <Link to="/introduction/swap">
            <Button color="primary" typevalue="ghost">
              back
            </Button>
          </Link>
        </Row>
      </ContentWrapper>
    );
  }
}

export default Pool;
