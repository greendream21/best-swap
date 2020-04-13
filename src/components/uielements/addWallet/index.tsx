import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import WalletButton from '../walletButton';

import Label from '../label';
import { AddWalletWrapper } from './AddWallet.style';

const AddWallet: React.FC = (): JSX.Element => (
  <AddWalletWrapper>
    <div className="add-wallet-icon">
      <Icon type="switcher" />
    </div>
    <Label className="connect-wallet-label">Please connect your wallet!</Label>
    <Link to="/connect">
      <WalletButton />
    </Link>
  </AddWalletWrapper>
);

export default AddWallet;
