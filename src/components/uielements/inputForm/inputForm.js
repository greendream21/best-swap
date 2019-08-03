import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InputFormWrapper } from './inputForm.style';
import InputNumber from '../inputNumber';
import Label from '../label';

class InputForm extends Component {
  static propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.number,
    reverse: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    type: '',
    value: 0,
    reverse: false,
    className: '',
    onChange: () => {},
  };

  render() {
    const { title, type, value, className, onChange, ...props } = this.props;

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

export default InputForm;
