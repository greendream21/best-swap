import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

import { ContentWrapper } from './StatsView.style';
import { stats } from './data';
import StatusGroup from '../../components/uielements/statusGroup';

class StatsView extends Component {
  componentDidMount() {
    const { getUserData } = this.props;

    getUserData();
  }

  getValues = fields => {
    const { userData } = this.props;

    return fields.map(field => {
      const { title, key, value } = field;

      if (key) {
        return {
          title,
          value: userData[key],
        };
      }
      return {
        title,
        value,
      };
    });
  };

  render() {
    return (
      <ContentWrapper>
        <Row>
          <Col span="12">
            <StatusGroup title="users" status={this.getValues(stats.users)} />
            <StatusGroup title="pools" status={this.getValues(stats.pools)} />
          </Col>
          <Col span="12">
            <StatusGroup
              title="transactions"
              status={this.getValues(stats.transactions)}
            />
            <StatusGroup
              title="stakers"
              status={this.getValues(stats.stakers)}
            />
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

StatsView.propTypes = {
  userData: PropTypes.object.isRequired,
  getUserData: PropTypes.func.isRequired,
};

export default connect(state => ({
  userData: state.Wallet.user,
}))(StatsView);
