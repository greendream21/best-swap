import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { ConnectionStatusWrapper } from './connectionStatus.style';

class ConnectionStatus extends Component {
  render() {
    const { color, ...otherProps } = this.props;
    return <ConnectionStatusWrapper color={color} {...otherProps} />;
  }
}

ConnectionStatus.propTypes = {
  color: PropTypes.oneOf(['red', 'yellow', 'green']),
  className: PropTypes.string,
};

ConnectionStatus.defaultProps = {
  className: '',
};

export default ConnectionStatus;
