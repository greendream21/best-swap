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

  render() {
    const { type, view } = this.props;

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
        {type === 'swap' && <Swap view={view} />}
      </TutorialViewWrapper>
    );
  }
}

export default withRouter(TutorialView);
