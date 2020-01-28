import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { StatusWrapper } from './status.style';
import Label from '../label';
import StatusLoader from '../../utility/loaders/status';

const NoWrapLabel = styled(Label)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

class Status extends Component {
  render() {
    const {
      title,
      value,
      direction,
      loading,
      className,
      ...props
    } = this.props;

    return (
      <StatusWrapper
        className={`status-wrapper ${className}`}
        direction={direction}
        {...props}
      >
        {loading && <StatusLoader />}
        {!loading && (
          <>
            <NoWrapLabel className="status-title" size="normal" color="gray">
              {title}
            </NoWrapLabel>
            <NoWrapLabel className="status-value" size="normal">
              {value}
            </NoWrapLabel>
          </>
        )}
      </StatusWrapper>
    );
  }
}

Status.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  direction: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

Status.defaultProps = {
  title: '',
  value: '',
  direction: 'vertical',
  loading: false,
  className: '',
};

export default Status;
