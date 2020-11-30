import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { CenteredWrapper } from './centered.style';

class Centered extends Component {
  render() {
    const { children, className, ...props } = this.props;
    return (
      <CenteredWrapper className={`centered-wrapper ${className}`} {...props}>
        {children}
      </CenteredWrapper>
    );
  }
}

Centered.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Centered.defaultProps = {
  className: '',
};

export default Centered;
