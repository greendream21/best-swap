import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import Button from '../../../components/uielements/button';
import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import CoinIcon from '../../../components/uielements/coins/coinIcon';
import CoinCard from '../../../components/uielements/coins/coinCard';
import Slider from '../../../components/uielements/slider';
import { greyArrowIcon } from '../../../components/icons';

import { ContentWrapper } from './PoolCreate.style';

import { getPair } from '../../../helpers/stringHelper';
import { shareInfo } from './data';

class PoolCreate extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {};

  handleCreatePool = () => {
    const { info } = this.props;
    const URL = `/pool/stake-view/${info}`;

    this.props.history.push(URL);
  };

  renderAssetView = pair => {
    const { source, target } = pair;

    if (!target) {
      return '';
    }

    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          ADD ASSETS
        </Label>
        <Label className="label-description" size="normal">
          Select the maximum deposit to stake.
        </Label>
        <Label className="label-no-padding" size="normal">
          Note: Pools always have RUNE as the base asset.
        </Label>
        <div className="stake-card-wrapper">
          <CoinCard
            asset={source}
            amount={1.354}
            price={217.29}
            withSelection
          />
          <CoinCard asset={target} amount={50.0} price={217.29} withSelection />
        </div>
        <Label className="label-title" size="normal" weight="bold">
          ADJUST PRICE
        </Label>
        <Label size="normal">
          Fine tune balances to ensure you starting pool price matches the
          market price.
        </Label>
        <Slider defaultValue={500} max={1000} />
        <div className="create-pool-info-wrapper">
          <div className="create-token-detail">
            <div className="info-status-wrapper">
              {shareInfo.map(info => {
                return <Status className="share-info-status" {...info} />;
              })}
            </div>
            <Button onClick={this.handleStake} color="success">
              create pool
            </Button>
          </div>
        </div>
      </>
    );
  };

  renderTokenDetails = pair => {
    const { view } = this.props;
    const { target } = pair;

    const title = view === 'new' ? 'SELECT ASSET' : 'TOKEN DETAILS';

    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          {title}
        </Label>
        {!target && (
          <div className="left-arrow-wrapper">
            <img src={greyArrowIcon} alt="grey-arrow" />
          </div>
        )}
        {target && (
          <div className="new-token-detail-wrapper">
            <div className="new-token-coin">
              <CoinIcon type={target} />
            </div>
            <Status title="Token" value={String(target).toUpperCase()} />
            <Status title="Ticker" value={String(target).toUpperCase()} />
            <Status title="Market Price" value="$0.10" />
            <Status title="Total Supply" value="100,000,000" />
          </div>
        )}
      </>
    );
  };

  render() {
    const { info } = this.props;

    const pair = getPair(info);

    if (!pair) {
      return '';
    }

    return (
      <ContentWrapper className="pool-new-wrapper">
        <Row className="pool-new-row">
          <Col className="token-details-view" span={8}>
            {this.renderTokenDetails(pair)}
          </Col>
          <Col className="add-asset-view" span={16}>
            {this.renderAssetView(pair)}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(PoolCreate);
