import React, { Component } from 'react';

import { ViewPanelWrapper } from './viewPanel.style';

class ViewPanel extends Component {
  render() {
    const { children, style, className } = this.props;
    return (
      <ViewPanelWrapper
        className={`view-panel-wrapper ${className}`}
        style={style}
      >
        {children}
      </ViewPanelWrapper>
    );
  }
}

export default ViewPanel;
