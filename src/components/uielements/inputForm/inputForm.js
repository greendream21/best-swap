import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputFormWrapper } from './inputForm.style';
import InputNumber from '../inputNumber';
import Label from '../label';

class InputForm extends Component {
  render() {
    const {
      title,
      type,
      value,
      step,
      className,
      onChange,
      ...props
    } = this.props;

    return (
      <InputFormWrapper className={`inputForm-wrapper ${className}`} {...props}>
        <Label className="title-label" color="light" weight="bold">
          {title}
        </Label>
        <div className="value-wrapper">
          <InputNumber
            className="value-input"
            value={value}
            onChange={onChange}
            min={0}
            step={step}
            placeholder="100000"
          />
          <Label className="name-label" color="gray" weight="bold">
            {type}
          </Label>
        </div>
      </InputFormWrapper>
    );
  }
}

InputForm.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number,
  step: PropTypes.number,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

InputForm.defaultProps = {
  title: '',
  type: '',
  value: 0,
  step: 1,
  reverse: false,
  className: '',
  onChange: () => {},
};

export default InputForm;
