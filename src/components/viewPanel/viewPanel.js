import React, { Component } from 'react';

import PropTypes from 'prop-types';

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

ViewPanel.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
};
export default ViewPanel;
