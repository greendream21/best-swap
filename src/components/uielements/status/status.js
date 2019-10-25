import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { StatusWrapper } from './status.style';
import Label from '../label';

const NoWrapLabel = styled(Label)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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
        <NoWrapLabel className="status-title" size="normal" color="gray">
          {title}
        </NoWrapLabel>
        <NoWrapLabel className="status-value" size="normal">
          {value}
        </NoWrapLabel>
      </StatusWrapper>
    );
  }
}

export default Status;
