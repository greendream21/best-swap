import React, { Component } from 'react';

import { ContentViewWrapper } from './contentView.style';

export default class ContentView extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
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
