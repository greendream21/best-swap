import React, { useState } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { StyledButton } from './refresh.style';

import * as appActions from '../../redux/app/actions';

import showNotification from '../uielements/notification';
import useInterval from '../../hooks/useInterval';

const Refresh = (): JSX.Element => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { pathname } = location;

  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 mins

  useInterval(() => {
    handleRefresh();
  }, REFRESH_INTERVAL);

  const handleRefresh = () => {
    if (pathname === '/' || pathname.includes('/pool')) {
      // poolview, poolcreate, pooldetail
      dispatch(appActions.getPoolViewData());
    } else if (pathname === '/transaction') {
      // transaction
      dispatch(appActions.refreshTransactionData());
    } else if (pathname.includes('/swap')) {
      // swap
      dispatch(appActions.refreshSwapData());
    } else if (pathname.includes('/stake')) {
      // stake
      const symbol = pathname.slice(pathname.lastIndexOf('/') + 1);
      dispatch(appActions.refreshStakeData(symbol));
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <StyledButton onClick={handleRefresh} typevalue="outline" round="true">
      <SyncOutlined spin={loading} />
    </StyledButton>
  );
};

export default Refresh;
