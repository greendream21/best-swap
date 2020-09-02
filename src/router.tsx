import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import * as H from 'history';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale-provider/en_US'; // same as default `locale` of `antd`

import asyncComponent from './helpers/AsyncFunc';
import { RootState } from './redux/store';
import { isMainnet } from './env';

const maintenanceRoute = [
  {
    path: '',
    component: asyncComponent(() => import('./containers/500')),
  },
];

type RouteType = {
  path: string;
  exact?: boolean;
  component: ReturnType<typeof asyncComponent>;
};

const publicRoutes: RouteType[] = [
  {
    path: '',
    component: asyncComponent(() => import('./containers/App')),
    exact: true,
  },
  {
    exact: true,
    path: '/404',
    component: asyncComponent(() => import('./containers/404')),
  },
  {
    exact: true,
    path: '/500',
    component: asyncComponent(() => import('./containers/500')),
  },
];

const isInMaintenance = () => {
  if (isMainnet && process.env.REACT_APP_MAINNET_STATUS === 'maintenance') {
    return true;
  } else if (
    !isMainnet &&
    process.env.REACT_APP_WEBSITE_STATUS === 'maintenance'
  ) {
    return true;
  }
  return false;
};

const routes = isInMaintenance() ? maintenanceRoute : publicRoutes;

type Props = {
  history: H.History;
};

const PublicRoutes = (props: Props) => {
  const { history } = props;

  return (
    <ConfigProvider locale={en_US}>
      <ConnectedRouter history={history}>
        <div>
          {routes.map((singleRoute: RouteType) => {
            const { exact = false, ...otherProps } = singleRoute;
            return (
              <Route exact={exact} key={singleRoute.path} {...otherProps} />
            );
          })}
        </div>
      </ConnectedRouter>
    </ConfigProvider>
  );
};

export default connect((state: RootState) => ({
  user: state.Wallet.user,
}))(PublicRoutes);
