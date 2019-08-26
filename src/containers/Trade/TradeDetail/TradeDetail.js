import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import Drag from '../../../components/uielements/drag';
import CoinCard from '../../../components/uielements/coins/coinCard';

import { ContentWrapper } from './TradeDetail.style';

import { blackArrowIcon } from '../../../components/icons';

import { getPair } from '../../../helpers/stringHelper';
import { tradeData } from './data';
import Coin from '../../../components/uielements/coins/coin';
import Status from '../../../components/uielements/status';
import Slider from '../../../components/uielements/slider';

class TradeDetail extends Component {
  static propTypes = {
    info: PropTypes.string,
    view: PropTypes.string.isRequired,
  };

  static defaultProps = {
    info: '',
  };

  state = {};

  handleConfirm = () => {
    console.log('confirmed');
  };

  render() {
    const { info } = this.props;
    const pair = getPair(info);

    if (!pair) {
      return '';
    }

    const { source, target } = pair;

    const dragTitle = 'Drag to trade';
    const poolStatus = `${source}:${target}`;

    return (
      <ContentWrapper className="trade-detail-wrapper">
        <Row className="trade-asset-status-row">
          <Coin type={source} over={target} />
          <Status title="Pool" value={poolStatus} />
          {tradeData.map(info => (
            <Status {...info} />
          ))}
        </Row>
        <Row className="trade-detail-row">
          <Col className="trade-detail-panel" span={16}>
            <div className="trade-asset-card-wrapper">
              <div className="trade-asset-card">
                <CoinCard
                  title="You are selling"
                  asset={source}
                  amount={13.54}
                  price={2300}
                  slip={2}
                />
                <Slider className="trade-asset-slider" defaultValue={50} />
              </div>
              <img src={blackArrowIcon} alt="blackarrow-icon" />
              <div className="trade-asset-card">
                <CoinCard
                  title="You will receive"
                  asset={target}
                  amount={46000}
                  price={2530}
                  slip={2}
                />
              </div>
            </div>
            <div className="drag-confirm-wrapper">
              <Drag
                title={dragTitle}
                source={source}
                target={target}
                onConfirm={this.handleConfirm}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="trade-info-wrapper">
              <Status title="Current Pool Price" value="$1.20" />
              <Status title="Pool Price After Trade" value="$1.00" />
              <Status title="Potential Reward" value="$120.03" />
            </div>
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(TradeDetail);
