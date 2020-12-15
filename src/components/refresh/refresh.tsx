import React, { useState } from 'react';


import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { SyncOutlined } from '@ant-design/icons';

import * as appActions from 'redux/app/actions';

import useInterval from 'hooks/useInterval';

import { matchPage, matchParam } from 'helpers/routerHelper';

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
    if (matchPage.isHomePage(pathname)) {
      dispatch(appActions.getPoolViewData());
    } else if (matchPage.isPoolCreatePage(pathname)) {
      dispatch(appActions.getPoolViewData());
    } else if (matchPage.isPoolDetailPage(pathname)) {
      const assetName = matchParam.matchPoolDetailSymbol(pathname);

      if (assetName) {
        dispatch(
          appActions.getPoolDetailViewData(assetName[assetName.length - 1]),
        );
      }
    } else if (matchPage.isTransactionPage(pathname)) {
      dispatch(appActions.refreshTransactionData());
    } else if (matchPage.isSwapPage(pathname)) {
      dispatch(appActions.refreshSwapData());
    } else if (matchPage.isAddLiquidityPage(pathname)) {
      const symbol = matchParam.matchAddLiquiditySymbol(pathname);

      if (symbol) {
        dispatch(appActions.refreshStakeData(symbol));
      }
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
