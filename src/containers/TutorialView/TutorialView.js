import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { TutorialViewWrapper } from './TutorialView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import Swap from './tutorials/Swap';
import DoubleSwap from './tutorials/DoubleSwap';

const { TabPane } = Tabs;

class TutorialView extends Component {
  static propTypes = {
    type: PropTypes.string,
    view: PropTypes.string,
  };

  static defaultProps = {
    type: 'swap',
    view: 'intro',
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

  getView = () => {
    const { type, view } = this.props;

    if (type === 'swap') {
      if (view === 'intro' || view === 'play') {
        return 'single-swap';
      }
      if (view === 'doubleintro' || view === 'doubleplay') {
        return 'double-swap';
      }
    }
    if (type === 'pool') {
      if (view === 'stakingintro' || view === 'stakingplay') {
        return 'pool-staking';
      }
      if (view === 'earningintro' || view === 'earningintro') {
        return 'pool-earning';
      }
    }
    if (type === 'trade') {
      return 'trade';
    }
    return 'single-swap';
  };

  render() {
    const { type, view } = this.props;
    const currentView = this.getView();

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
        {currentView === 'single-swap' && <Swap view={view} />}
        {currentView === 'double-swap' && <DoubleSwap view={view} />}
      </TutorialViewWrapper>
    );
  }
}

export default withRouter(TutorialView);
