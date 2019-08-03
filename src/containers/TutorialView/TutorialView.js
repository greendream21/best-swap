import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { TutorialViewWrapper } from './TutorialView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import Swap from './tutorials/Swap';
import DoubleSwap from './tutorials/DoubleSwap';
import Stake from './tutorials/Stake';
import Earning from './tutorials/Earning';
import Trade from './tutorials/Trade';

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
      this.props.history.push('/tutorial/swap/intro');
    }
    if (type === 'pool') {
      if (view === 'stakingintro' || view === 'stakingplay') {
        return 'pool-staking';
      }
      if (view === 'earningintro' || view === 'earningplay') {
        return 'pool-earning';
      }
      this.props.history.push('/tutorial/pool/stakingintro');
    }
    if (type === 'trade') {
      if (view === 'tradingintro' || view === 'tradingplay') {
        return 'trade';
      }
      this.props.history.push('/tutorial/trade/tradingintro');
    }
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
        {currentView === 'pool-staking' && <Stake view={view} />}
        {currentView === 'pool-earning' && <Earning view={view} />}
        {currentView === 'trade' && <Trade view={view} />}
      </TutorialViewWrapper>
    );
  }
}

export default withRouter(TutorialView);
