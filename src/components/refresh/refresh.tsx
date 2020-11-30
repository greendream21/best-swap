import React, { useState } from 'react';


import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { SyncOutlined } from '@ant-design/icons';

import * as appActions from 'redux/app/actions';

import useInterval from 'hooks/useInterval';

import { StyledButton } from './refresh.style';

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
    if (pathname === '/' || pathname.includes('/pools')) {
      // poolview
      dispatch(appActions.getPoolViewData());
    } else if (pathname.includes('/pool') && pathname.includes('/new')) {
      // poolcreate
      dispatch(appActions.getPoolViewData());
    } else if (pathname.includes('/pool') && !pathname.includes('/new')) {
      // pool detail view
      const assetName = pathname.split('/');
      dispatch(
        appActions.getPoolDetailViewData(assetName[assetName.length - 1]),
      );
    } else if (pathname === '/transaction') {
      // transaction
      dispatch(appActions.refreshTransactionData());
    } else if (pathname.includes('/swap')) {
      // swap
      dispatch(appActions.refreshSwapData());
    } else if (pathname.includes('/liquidity')) {
      // add liquidity
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
