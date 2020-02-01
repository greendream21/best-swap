import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import Tabs from '../../components/uielements/tabs';
import { ContentWrapper } from './ConnectView.style';

import Keystore from './Keystore';
import WalletConnect from './WalletConnect';
import Ledger from './Ledger';

import * as midgardActions from '../../redux/midgard/actions';

const { TabPane } = Tabs;

class ConnectView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'keystore',
    };
  }

  componentDidMount() {
    const { getPools } = this.props;

    getPools();
  }

  setWalletType = active => {
    this.setState({
      active,
    });
  };

  render() {
    const { active } = this.state;

    const tabs = [
      {
        label: 'wallet connect',
        value: 'walletconnect',
        comp: <WalletConnect {...this.props} />,
      },
      {
        label: 'ledger',
        value: 'ledger',
        comp: <Ledger {...this.props} />,
      },
      {
        label: 'keystore file',
        value: 'keystore',
        comp: <Keystore {...this.props} />,
      },
    ];

    const selected = tabs.find(tab => tab.value === active);

    return (
      <ContentWrapper>
        <Row className="connect-view-header">
          <Tabs
            className="connect-view-tab"
            activeKey={active}
            onChange={this.setWalletType}
            action
          >
            {tabs.map(tab => {
              return (
                <TabPane
                  key={tab.value}
                  tab={tab.label}
                  disabled={tab.value === 'walletconnect'}
                />
              );
            })}
          </Tabs>
        </Row>
        <Row className="connect-view-content">
          <Col className="connect-view-content-form" xs={24}>
            {selected.comp}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

ConnectView.propTypes = {
  getPools: PropTypes.func.isRequired,
};

export default connect(null, {
  getPools: midgardActions.getPools,
})(ConnectView);
