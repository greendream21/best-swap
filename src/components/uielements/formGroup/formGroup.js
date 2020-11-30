import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Label from '../label';
import { FormGroupWrapper } from './formGroup.style';

class FormGroup extends Component {
  render() {
    const {
      title,
      description,
      children,
      className = '',
      ...props
    } = this.props;

    return (
      <FormGroupWrapper className={`formGroup-wrapper ${className}`} {...props}>
        {title && (
          <Label color="normal" size="normal" weight="bold">
            {title}
          </Label>
        )}
        {children}
        {description && (
          <Label color="input" size="small" weight="bold">
            {description}
          </Label>
        )}
      </FormGroupWrapper>
    );
  }
}

FormGroup.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  description: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
};

FormGroup.defaultProps = {
  title: '',
  description: '',
};

export default FormGroup;
