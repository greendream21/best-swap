import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import Coin from '../../../components/uielements/coins/coin';
import CoinCard from '../../../components/uielements/coins/coinCard';
import Slider from '../../../components/uielements/slider';
import { greyArrowIcon } from '../../../components/icons';

import { ContentWrapper } from './PoolStake.style';

import { getPair } from '../../../helpers/stringHelper';
import { stakeInfo, stakeNewInfo, shareInfo } from './data';

class PoolStake extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {};

  handleGotoDetail = () => {
    const { info } = this.props;
    const URL = `/pool/stake-detail/${info}`;

    this.props.history.push(URL);
  };

  handleStake = () => {
    const { info } = this.props;
    const URL = `/pool/stake-view/${info}`;

    this.props.history.push(URL);
  };

  handleAddMore = () => {};

  renderStakeInfo = pair => {
    const { view } = this.props;
    const { source, target } = pair;

    const stakePool = `${source}:${target}`;

    return (
      <Row className="stake-status-view">
        <Col className="stake-pool-col" span={8}>
          <Coin type={source} over={target} />
          <Status
            className="stake-pool-status"
            title="Pool"
            value={stakePool}
          />
        </Col>
        <Col className="stake-info-col" span={16}>
          {view === 'stake-new' &&
            stakeNewInfo.map(info => {
              return <Status className="stake-info-status" {...info} />;
            })}
          {(view === 'stake-detail' || view === 'stake-view') &&
            stakeInfo.map(info => {
              return <Status className="stake-info-status" {...info} />;
            })}
        </Col>
      </Row>
    );
  };

  renderShareDetail = pair => {
    const { view } = this.props;
    const { source, target } = pair;

    if (view === 'stake-new') {
      return '';
    }

    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          ADD SHARE
        </Label>
        {view === 'stake-detail' && (
          <>
            <Label className="label-description" size="normal">
              Select the maximum deposit to stake.
            </Label>
            <Label className="label-no-padding" size="normal">
              Note: Pools always have RUNE as the base asset.
            </Label>
            <div className="stake-card-wrapper">
              <CoinCard
                asset={source}
                amount={0.75}
                price={217.29}
                withSelection
              />
              <CoinCard
                asset={target}
                amount={0.0}
                price={217.29}
                withSelection
              />
            </div>
            <Label className="label-title" size="normal" weight="bold">
              ADJUST BALANCE
            </Label>
            <Label size="normal">
              Fine tune balances to ensure you stake on both sides with the
              correct amount.
            </Label>
            <Slider defaultValue={500} max={1000} />
            <div className="stake-share-info-wrapper">
              <div className="info-status-wrapper">
                {shareInfo.map(info => {
                  return <Status className="share-info-status" {...info} />;
                })}
              </div>
              <Button onClick={this.handleStake} color="success">
                stake
              </Button>
            </div>
          </>
        )}
        {view === 'stake-view' && (
          <>
            <Label size="normal">Add more from your wallet.</Label>
            <Button
              onClick={this.handleAddMore}
              color="primary"
              typevalue="outline"
            >
              Add more
            </Button>
          </>
        )}
      </>
    );
  };

  render() {
    const { view, info } = this.props;

    const pair = getPair(info);

    if (!pair) {
      return '';
    }

    const { source, target } = pair;

    return (
      <ContentWrapper className="pool-stake-wrapper">
        {this.renderStakeInfo(pair)}
        <Row className="share-view">
          <Col className="your-share-view" span={8}>
            <Label className="label-title" size="normal" weight="bold">
              YOUR SHARE
            </Label>
            {view === 'stake-new' && (
              <>
                <Label size="normal">
                  You don't have any shares in this pool.
                </Label>
                <Button onClick={this.handleGotoDetail} color="success">
                  add share
                </Button>
              </>
            )}
            {view === 'stake-detail' && (
              <>
                <Label size="normal">
                  Complete the process to add a share.
                </Label>
                <div className="right-arrow-wrapper">
                  <img src={greyArrowIcon} alt="grey-arrow" />
                </div>
              </>
            )}
          </Col>
          <Col className="share-detail-view" span={16}>
            {this.renderShareDetail(pair)}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(PoolStake);
