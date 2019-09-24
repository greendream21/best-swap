import React, { Component } from 'react';

import { HeaderWrapper } from './panelHeader.style';

class PanelHeader extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { children, ...otherProps } = this.props;
    return <HeaderWrapper {...otherProps}>{children}</HeaderWrapper>;
  }
}

export default PanelHeader;
