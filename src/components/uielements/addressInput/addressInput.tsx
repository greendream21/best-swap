import React, { useMemo, useState, useEffect } from 'react';
import { Icon, Popover } from 'antd';

import { AddressInputWrapper } from './addressInput.style';
import Input from '../input';

type Props = {
  value?: string;
  status?: boolean;
  onChange: (address: string) => void;
  onStatusChange: (status: boolean) => void;
  className?: string;
};

const AddressInput: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    value = '',
    status: initialStatus = false,
    onStatusChange,
    onChange,
    className = '',
    ...otherProps
  } = props;

  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    onStatusChange(status);
  }, [onStatusChange, status]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value ?? '';
    onChange(value);
  };

  const onClickWrapper = (_: React.MouseEvent<HTMLDivElement>) => {
    if (!status) {
      setStatus(true);
    }
  };

  const popoverContent = useMemo(() => {
    return (
      <div
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: '11px',
          color: '#50E3C2',
        }}
      >
        Add Recipient Address
      </div>
    );
  }, []);

  return (
    <AddressInputWrapper
      status={status}
      className={`addressInput-wrapper ${className}`}
      onClick={onClickWrapper}
      data-test="add-recipient-address-button"
      {...otherProps}
    >
      {!status && (
        <Popover
          content={popoverContent}
          placement="right"
          visible
          overlayClassName="addressInput-popover"
          overlayStyle={{
            padding: '6px',
            animationDuration: '0s !important',
            animation: 'none !important',
          }}
        >
          <div
            className="addressInput-icon"
            data-test="add-recipient-address-button"
          >
            <Icon type="plus" />
          </div>
        </Popover>
      )}
      {status && (
        <>
          <div className="addressInput-icon" onClick={_ => setStatus(false)}>
            <Icon type="delete" theme="filled" />
          </div>
          <Input
            className="address-input"
            color="success"
            sizevalue="normal"
            value={value}
            onChange={onChangeHandler}
            placeholder="Enter Recipient Address"
            data-test="recipient-address-field"
          />
        </>
      )}
    </AddressInputWrapper>
  );
};

export default AddressInput;
