import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { ContentTitleWrapper } from './contentTitle.style';

class ContentTitle extends Component {
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
ContentTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ContentTitle.defaultProps = {
  className: '',
};

export default ContentTitle;
