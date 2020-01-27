import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import WSEvent from './WSEvent';

class WSProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  handleData = newData => {
    const { data } = this.state;
    const dataArray = cloneDeep(data);

    dataArray.push(JSON.parse(newData));
    this.setState({
      data: dataArray,
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

WSProvider.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};

export default WSProvider;
