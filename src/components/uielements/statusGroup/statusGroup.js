import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Label from '../label';
import { StatusGroupWrapper } from './statusGroup.style';

class StatusGroup extends Component {
  render() {
    const { title, status, className, ...props } = this.props;

    return (
      <StatusGroupWrapper
        className={`statusGroup-wrapper ${className}`}
        {...props}
      >
        {title && (
          <Label
            className="group-title"
            color="normal"
            size="big"
            weight="bold"
          >
            {title}
          </Label>
        )}
        <div className="status-group-content">
          {status.map((data, index) => {
            const { title, value } = data;
            return (
              <div className="status-value" key={index}>
                <Label size="tiny" color="normal" weight="bold">
                  {title}
                </Label>
                <Label size="big" color="normal">
                  {value}
                </Label>
              </div>
            );
          })}
        </div>
      </StatusGroupWrapper>
    );
  }
}

StatusGroup.propTypes = {
  title: PropTypes.string,
  status: PropTypes.array,
  className: PropTypes.string,
};

StatusGroup.defaultProps = {
  title: '',
  status: [],
  className: '',
};

export default StatusGroup;
