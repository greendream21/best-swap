import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ViewPanelWrapper } from './viewPanel.style';

class ViewPanel extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
  };

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
