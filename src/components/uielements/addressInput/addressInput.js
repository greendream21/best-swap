import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';

import { AddressInputWrapper } from './addressInput.style';
import Input from '../input';

class AddressInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    className: '',
  };

  state = {
    status: false,
  };

  setStatus = status => () => {
    this.setState({
      status,
    });
  };

  onChange = e => {
    this.props.onChange(e.target.value);
  };

  renderPopoverContent = () => {
    return (
      <div style={{ fontFamily: 'Roboto', color: '#50E3C2' }}>
        Add Recipient Address
      </div>
    );
  };

  render() {
    const { value, className, ...props } = this.props;
    const { status } = this.state;

    return (
      <AddressInputWrapper
        status={status}
        className={`addressInput-wrapper ${className}`}
        {...props}
      >
        {!status && (
          <Popover
            content={this.renderPopoverContent()}
            placement="right"
            trigger={[]}
            visible
            overlayClassName="addressInput-popover"
            overlayStyle={{ padding: '6px' }}
          >
            <div className="addressInput-icon" onClick={this.setStatus(true)}>
              <Icon type="plus" />
            </div>
          </Popover>
        )}
        {status && (
          <>
            <div className="addressInput-icon" onClick={this.setStatus(false)}>
              <Icon type="delete" theme="filled" />
            </div>
            <Input
              className="address-input"
              color="success"
              sizevalue="normal"
              value={value}
              onChange={this.onChange}
              placeholder="Recipient Address: Eg. bnbeh456..."
            />
          </>
        )}
      </AddressInputWrapper>
    );
  }
}

export default AddressInput;
