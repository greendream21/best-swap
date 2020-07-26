import React, { useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { WalletOutlined } from '@ant-design/icons';

import * as RD from '@devexperts/remote-data-ts';

import Logo from '../uielements/logo';
import TxProgress from '../uielements/txProgress';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import ThemeSwitch from '../uielements/themeSwitch';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { Maybe, Nothing } from '../../types/bepswap';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';
import * as appActions from '../../redux/app/actions';

import { MAX_VALUE } from '../../redux/app/const';
import { TxStatus } from '../../redux/app/types';

type ConnectedProps = {
  user: Maybe<User>;
  midgardBasePath: Maybe<string>;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  txStatus: TxStatus;
};

type ComponentProps = {
  title: string;
};

type Props = ConnectedProps & ComponentProps;

const Header: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    user,
    midgardBasePath,
    setTxTimerModal,
    setTxTimerStatus,
    txStatus,
  } = props;
  const history = useHistory();

  const wallet: Maybe<string> = user ? user.wallet : Nothing;

  const handleClickTxProgress = useCallback(() => {
    if (txStatus.type !== undefined) {
      setTxTimerModal(true);
    } else {
      history.push('/transaction');
    }
  }, [setTxTimerModal, txStatus, history]);

  const handleEndTxProgress = useCallback(() => {
    // Update `status` from here if modal is hided (not running)
    // to avoid unexptected UX issues within modal (it's final icon won't be visible)
    if (!txStatus.modal) {
      setTxTimerStatus(false);
    }
  }, [txStatus, setTxTimerStatus]);

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
        {wallet && (
          <TxProgress
            status={txStatus.status}
            value={txStatus.value}
            maxValue={MAX_VALUE}
            className={txStatus.type === undefined ? 'disabled' : ''}
            onClick={handleClickTxProgress}
            onEnd={handleEndTxProgress}
          />
        )}
      </HeaderActionButtons>
    </StyledHeader>
  );
};

export default connect(
  (state: RootState) => ({
    txStatus: state.App.txStatus,
    user: state.Wallet.user,
    midgardBasePath: RD.toNullable(state.Midgard.apiBasePath),
  }),
  {
    setTxTimerModal: appActions.setTxTimerModal,
    setTxTimerStatus: appActions.setTxTimerStatus,
  },
)(Header);
