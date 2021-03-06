import React from 'react';

import { Maybe } from 'types/bepswap';

import Button from '../button';
import { Props as ButtonProps } from '../button/button';

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
        <span style={{ display: 'flex', alignItems: 'center' }}>
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
      color={connected ? 'primary' : 'warning'}
      {...otherProps}
    >
      {getBtnValue()}
    </Button>
  );
};

export default WalletButton;
