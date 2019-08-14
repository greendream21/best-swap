import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

import Button from '../../../components/uielements/button';
import Drag from '../../../components/uielements/drag';
import CoinCard from '../../../components/uielements/coins/coinCard';
import Label from '../../../components/uielements/label';

import { ContentWrapper } from './PoolStake.style';

import { getPair } from '../../../helpers/stringHelper';

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
    // const { info } = this.props;
    // const URL = `/swap/detail/${info}`;
    // this.props.history.push(URL);
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
        <Row className="stake-status-view">stake status view</Row>
        <Row className="share-view">
          <Col className="your-share-view" span={8}>
            your share view
          </Col>
          <Col className="share-detail-view" span={16}>
            share detail
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default withRouter(PoolStake);
