import React from 'react';

import { Link } from 'react-router-dom';

import { SwitcherOutlined } from '@ant-design/icons';


import Label from '../label';
import WalletButton from '../walletButton';
import { AddWalletWrapper } from './AddWallet.style';

const AddWallet: React.FC = (): JSX.Element => (
  <AddWalletWrapper>
    <div className="add-wallet-icon">
      <SwitcherOutlined />
    </div>
    <Label className="connect-wallet-label">Please connect your wallet!</Label>
    <Link to="/connect">
      <WalletButton />
    </Link>
  </AddWalletWrapper>
);

export default AddWallet;
