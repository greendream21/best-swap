import React from 'react';
import { Icon } from 'antd';

import Button from '../button';
import { Props as ButtonProps } from '../button/button';
import { Maybe } from '../../../types/bepswap';

type ComponentProps = {
  connected?: boolean;
  address?: Maybe<string>;
  className?: string;
};

type Props = ComponentProps & ButtonProps;

const WalletButton: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    connected = false,
    address = '',
    className = '',
    ...otherProps
  } = props;

  const getBtnValue = () => {
    if (!connected) {
      return (
        <span>
          <Icon
            type="folder-add"
            theme="filled"
            style={{
              display: 'inline',
              marginRight: '6px',
              top: '1px',
              position: 'relative',
            }}
          />
          Add Wallet
        </span>
      );
    }

    if (connected) {
      if (address && address.length > 9) {
        const first = address.substr(0, 6);
        const last = address.substr(address.length - 3, 3);
        return `${first}...${last}`;
      }
      return address;
    }
  };

  return (
    <Button
      className={`${className} wallet-btn-wrapper`}
      sizevalue="normal"
      round="true"
      {...otherProps}
    >
      {getBtnValue()}
    </Button>
  );
};

export default WalletButton;
