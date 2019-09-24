import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormGroupWrapper } from './formGroup.style';
import Label from '../label';

class FormGroup extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    title: '',
    description: '',
  };

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

export default FormGroup;
