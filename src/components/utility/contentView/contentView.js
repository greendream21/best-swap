import React, { Component } from 'react';

import { ContentViewWrapper } from './contentView.style';

export default class ContentView extends Component {
  render() {
    const { children, ...props } = this.props;
    return <ContentViewWrapper {...props}>{children}</ContentViewWrapper>;
  }
}
