import React, { Component } from 'react';

import { ContentViewWrapper } from './contentView.style';

export default class ContentView extends Component {
  render() {
    const { className, children, ...props } = this.props;
    return (
      <ContentViewWrapper
        className={`content-view-wrapper ${className}`}
        {...props}
      >
        {children}
      </ContentViewWrapper>
    );
  }
}
