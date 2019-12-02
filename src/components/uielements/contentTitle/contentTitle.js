import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ContentTitleWrapper } from './contentTitle.style';

class ContentTitle extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, children, ...props } = this.props;

    return (
      <ContentTitleWrapper
        className={`contentTitle-wrapper ${className}`}
        {...props}
      >
        {children}
      </ContentTitleWrapper>
    );
  }
}

export default ContentTitle;
