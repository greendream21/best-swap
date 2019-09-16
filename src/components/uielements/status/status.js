import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { StatusWrapper } from './status.style';
import Label from '../label';

const TitleLabel = styled(Label)`
  white-space: nowrap;
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
        <TitleLabel className="status-title" size="tiny" weight="bold">
          {title}
        </TitleLabel>
        <Label className="status-value" size="big">
          {value}
        </Label>
      </StatusWrapper>
    );
  }
}

export default Status;
