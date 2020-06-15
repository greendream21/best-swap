import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { WalletOutlined } from '@ant-design/icons';

import * as RD from '@devexperts/remote-data-ts';
import Logo from '../uielements/logo';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import ThemeSwitch from '../uielements/themeSwitch';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { Maybe, Nothing } from '../../types/bepswap';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';

type ConnectedProps = {
  user: Maybe<User>;
  midgardBasePath: Maybe<string>;
};

type ComponentProps = {
  title: string;
};

type Props = ConnectedProps & ComponentProps;

const Header: React.FC<Props> = (props: Props): JSX.Element => {
  const { user, midgardBasePath } = props;
  const wallet: Maybe<string> = user ? user.wallet : Nothing;

  return (
    <StyledHeader>
      <LogoWrapper>
        <Link to="/pools">
          <Logo name="bepswap" type="long" />
        </Link>
        <HeaderSetting midgardBasePath={midgardBasePath} />
      </LogoWrapper>
      <HeaderActionButtons>
        {!wallet && (
          <Link to="/connect">
            <WalletButton
              data-test="add-wallet-button"
              connected={false}
              address={wallet}
            />
          </Link>
        )}
        {!wallet && (
          <Link to="/connect">
            <div className="wallet-mobile-btn">
              <WalletOutlined />
            </div>
          </Link>
        )}
        {wallet && <WalletDrawer />}
        <ThemeSwitch />
        <BasePriceSelector />
      </HeaderActionButtons>
    </StyledHeader>
  );
};

export default connect((state: RootState) => ({
  user: state.Wallet.user,
  midgardBasePath: RD.toNullable(state.Midgard.apiBasePath),
}))(Header);
