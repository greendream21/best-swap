import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { TutorialViewWrapper } from './TutorialView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import { Swap, SwapIntro } from './tutorials/Swap';

const { TabPane } = Tabs;

class TutorialView extends Component {
  state = {
    activeTab: 'swap',
  };

  handleChangeTab = activeTab => {
    this.setState({
      activeTab,
    });
  };

  handleSetTab = activeTab => () => {
    this.setState({
      activeTab,
    });
  };

  render() {
    const { activeTab } = this.state;

    return (
      <TutorialViewWrapper>
        <PanelHeader>
          <>
            <Tabs activeKey={activeTab} onChange={this.handleChangeTab} action>
              <TabPane tab="swap" key="swap" />
              <TabPane tab="pools" key="pools" />
              <TabPane tab="trade" key="trade" />
            </Tabs>
          </>
        </PanelHeader>
        {activeTab === 'swap' && <SwapIntro />}
      </TutorialViewWrapper>
    );
  }
}

export default withRouter(TutorialView);
