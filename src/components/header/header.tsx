import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
  SwapOutlined,
  DatabaseFilled,
  WalletOutlined,
  QuestionOutlined,
} from '@ant-design/icons';

import * as RD from '@devexperts/remote-data-ts';
import Tabs from '../uielements/tabs';
import TxView from '../uielements/txView';
import Logo from '../uielements/logo';

import { StyledHeader, LogoWrapper, HeaderActionButtons } from './header.style';
import HeaderSetting from './headerSetting';
import WalletDrawer from '../../containers/WalletView/WalletDrawer';

import * as appActions from '../../redux/app/actions';
import Button from '../uielements/button';
import WalletButton from '../uielements/walletButton';
import BasePriceSelector from './basePriceSelector';
import { MAX_VALUE } from '../../redux/app/const';
import { Maybe, Nothing } from '../../types/bepswap';
import { RootState } from '../../redux/store';
import { User } from '../../redux/wallet/types';
import { TxStatus } from '../../redux/app/types';

const { TabPane } = Tabs;

enum TAB_KEY {
  SWAP = 'swap',
  POOLS = 'pools',
}

type ConnectedProps = {
  user: Maybe<User>;
  setTxTimerModal: typeof appActions.setTxTimerModal;
  setTxTimerStatus: typeof appActions.setTxTimerStatus;
  txStatus: TxStatus;
  midgardBasePath: Maybe<string>;
};

type ComponentProps = {
  title: string;
};

type Props = ConnectedProps & ComponentProps;

const Header: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    setTxTimerModal,
    setTxTimerStatus,
    txStatus,
    user,
    midgardBasePath,
  } = props;
  const { status, value, type } = txStatus;
  const wallet: Maybe<string> = user ? user.wallet : Nothing;

  const matchSwap = useRouteMatch('/swap');
  const matchPools = useRouteMatch('/pools');
  const matchPool = useRouteMatch('/pool');

  const handleClickTxView = useCallback(() => {
    setTxTimerModal(true);
  }, [setTxTimerModal]);

  const handleEndTxView = useCallback(() => {
    // Update `status` from here if modal is hided (not running)
    // to avoid unexptected UX issues within modal (it's final icon won't be visible)
    if (!txStatus.modal) {
      setTxTimerStatus(false);
    }
  }, [txStatus, setTxTimerStatus]);

  const activeKey: Maybe<TAB_KEY> = useMemo(() => {
    if (matchSwap) {
      return TAB_KEY.SWAP;
    } else if (matchPools || matchPool) {
      return TAB_KEY.POOLS;
    } else {
      return Nothing;
    }
  }, [matchPool, matchPools, matchSwap]);

  const renderHeader = useMemo(() => {
    const swapTab = (
      <Link to="/swap">
        <span>
          <SwapOutlined />
          swap
        </span>
      </Link>
    );
    const poolsTab = (
      <Link to="/pools">
        <span>
          <DatabaseFilled />
          stake
        </span>
      </Link>
    );

    return (
      <div className="header-tab-container">
        <Tabs data-test="action-tabs" activeKey={activeKey} action>
          <TabPane tab={swapTab} key={TAB_KEY.SWAP} />
          <TabPane tab={poolsTab} key={TAB_KEY.POOLS} />
        </Tabs>
      </div>
    );
  }, [activeKey]);

  return (
    <StyledHeader>
      <LogoWrapper>
        <Link to="/">
          <Logo name="bepswap" type="long" />
        </Link>
        <Link to="/introduction">
          <Tooltip title="Introduction?">
            <Button
              className="intro-btn"
              typevalue="outline"
              shape="circle"
              size="small"
              icon={<QuestionOutlined />}
            />
          </Tooltip>
        </Link>
      </LogoWrapper>
      {renderHeader}
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
        <BasePriceSelector />
        <HeaderSetting midgardBasePath={midgardBasePath} />
        {wallet && (
          <TxView
            status={status}
            value={value}
            maxValue={MAX_VALUE}
            className={type === undefined ? 'disabled' : ''}
            onClick={type !== undefined ? handleClickTxView : undefined}
            onEnd={handleEndTxView}
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
