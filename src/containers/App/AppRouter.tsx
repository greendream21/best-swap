import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../helpers/AsyncFunc';

type AppRoute = {
  path: string;
  exact?: boolean;
  component: ReturnType<typeof asyncComponent>;
};

const routes: AppRoute[] = [
  {
    path: '',
    component: asyncComponent(() => import('../PoolView')),
    exact: true,
  },
  // URI Format: swap/RUNE-67C:BNB
  {
    path: 'swap/:symbolpair',
    component: asyncComponent(() => import('../SwapSend')),
  },
  {
    path: 'pools',
    component: asyncComponent(() => import('../PoolView')),
    exact: true,
  },
  {
    path: 'pool/:symbol/new',
    component: asyncComponent(() => import('../PoolCreate')),
    exact: true,
  },
  {
    path: 'pool/:symbol',
    component: asyncComponent(() => import('../PoolStake')),
    exact: true,
  },
  {
    path: 'connect',
    component: asyncComponent(() => import('../ConnectView')),
  },
  {
    path: 'faqs',
    component: asyncComponent(() => import('../FaqsView')),
  },
  {
    path: 'transaction',
    component: asyncComponent(() => import('../TransactionView')),
  },
  {
    path: '*',
    component: asyncComponent(() => import('../404')),
  },
];

type Props = {
  url: string;
};

const AppRouter: React.FC<Props> = (props: Props): JSX.Element => {
  const { url } = props;

  return (
    <div>
      <Switch>
        {routes.map(singleRoute => {
          const { path, exact = true, ...other } = singleRoute;
          return (
            <Route
              exact={exact}
              key={singleRoute.path}
              path={`${url}${singleRoute.path}`}
              {...other}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default AppRouter;
