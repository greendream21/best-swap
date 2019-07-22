import React, { Component } from 'react';

import { HeaderWrapper } from './sectionHeader.style';

class SectionHeader extends Component {
  render() {
    return <HeaderWrapper>{this.props.children}</HeaderWrapper>;
  }
}

export default SectionHeader;
