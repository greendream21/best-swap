import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import CoinCard from '../../../components/uielements/coins/coinCard';

import { ContentWrapper } from './SwapDetail.style';

import { blackArrowIcon } from '../../../components/icons';

class SwapDetail extends Component {
  static propTypes = {
    info: PropTypes.string,
  };

  static defaultProps = {
    info: '',
  };

  state = {};

  handleConfirm = () => {
    console.log('confirmed');
  };

  getSwapData = () => {
    const { info } = this.props;

    if (info) {
      const source = info.split('-')[0];
      const target = info.split('-')[1];

      return {
        source,
        target,
      };
    }
    return {};
  };

  render() {
    const swapData = this.getSwapData();

    if (!swapData) {
      return '';
    }

    const { source, target } = swapData;

    return (
      <ContentWrapper className="swap-detail-wrapper">
        <Row>
          <Col span={16}>
            <div className="swap-type-selector">
              <Button sizevalue="big" typevalue="outline">
                swap
              </Button>
              <Button sizevalue="big" typevalue="outline">
                swap & send
              </Button>
            </div>
            <div className="swap-asset-card">
              <CoinCard asset="bnb" amount={1.354} price={600} withSelection />
              <img src={blackArrowIcon} alt="blackarrow-icon" />
              <CoinCard asset="bolt" amount={13549} price={596} slip={2} />
            </div>
            <div className="drag-confirm-wrapper">
              <Drag onConfirm={this.handleConfirm} />
            </div>
          </Col>
          <Col span={8}></Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default SwapDetail;
