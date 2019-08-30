import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConnectionStatusWrapper } from './connectionStatus.style';

class ConnectionStatus extends Component {
  static propTypes = {
    color: PropTypes.oneOf(['red', 'yellow', 'green']),
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { color, ...otherProps } = this.props;
    return <ConnectionStatusWrapper color={color} {...otherProps} />;
  }
}

export default ConnectionStatus;
