import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusWrapper } from './status.style';
import Label from '../label';

class Status extends Component {
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    value: '',
    className: '',
  };

  render() {
    const { title, value, className, ...props } = this.props;

    return (
      <StatusWrapper className={`status-wrapper ${className}`} {...props}>
        <Label className="status-title" size="tiny" weight="bold">
          {title}
        </Label>
        <Label className="status-value" size="big" weight="bold">
          {value}
        </Label>
      </StatusWrapper>
    );
  }
}

export default Status;
