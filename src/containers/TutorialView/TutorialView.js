import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { TutorialViewWrapper } from './TutorialView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import Swap from './tutorials/Swap';

const { TabPane } = Tabs;

class TutorialView extends Component {
  static propTypes = {
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'swap',
  };

  handleChangeTab = activeTab => {
    this.goToTutorial(activeTab);
  };

  handleSetTab = activeTab => () => {
    this.goToTutorial(activeTab);
  };

  goToTutorial = type => {
    const URL = `/tutorial/${type}`;

    this.props.history.push(URL);
  };

  render() {
    const { type } = this.props;

    console.log(type);
    return (
      <TutorialViewWrapper>
        <PanelHeader>
          <>
            <Tabs activeKey={type} onChange={this.handleChangeTab} action>
              <TabPane tab="swap" key="swap" />
              <TabPane tab="pool" key="pool" />
              <TabPane tab="trade" key="trade" />
            </Tabs>
          </>
        </PanelHeader>
        {type === 'swap' && <Swap />}
      </TutorialViewWrapper>
    );
  }
}

export default withRouter(TutorialView);
