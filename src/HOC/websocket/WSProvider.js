import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WSEvent from './WSEvent';

class WSProvider extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    data: [],
  };

  handleData = newData => {
    const { data } = this.state;

    data.push(JSON.parse(newData));
    this.setState({
      data,
    });
  };

  render() {
    const { url, children, ...props } = this.props;
    const { data } = this.state;

    return (
      <>
        <WSEvent url={url} onMessage={this.handleData} {...props} />
        {children({ data })}
      </>
    );
  }
}

export default WSProvider;
