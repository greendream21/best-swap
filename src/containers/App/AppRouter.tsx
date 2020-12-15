import React from 'react';

import { Route, Switch } from 'react-router-dom';

import asyncComponent from 'helpers/AsyncFunc';

type AppRoute = {
  path: string;
  exact?: boolean;
  component: ReturnType<typeof asyncComponent>;
};

const routes: AppRoute[] = [
  {
    path: '',
    component: asyncComponent(() => import('../PoolView')),
  },
  {
    path: 'pools',
    component: asyncComponent(() => import('../PoolView')),
  },
  {
    path: 'pool/:symbol',
    component: asyncComponent(() => import('../PoolDetail')),
  },
  // URI Format: swap/RUNE-67C:BNB
  {
    path: 'swap/:symbolpair',
    component: asyncComponent(() => import('../SwapSend')),
  },
  {
    path: 'pool/:symbol/new',
    component: asyncComponent(() => import('../PoolCreate')),
  },
  {
    path: 'liquidity/:symbol',
    component: asyncComponent(() => import('../PoolStake')),
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
    path: 'tools',
    component: asyncComponent(() => import('../ToolsView')),
  },
  {
    path: 'explorer',
    component: asyncComponent(() => import('../ExplorerView')),
  },
  {
    path: 'education',
    component: asyncComponent(() => import('../EducationView')),
  },
  {
    path: 'apidoc',
    component: asyncComponent(() => import('../ApiDocView')),
  },
  {
    path: 'transaction',
    component: asyncComponent(() => import('../TransactionView')),
  },
  {
    path: 'stats',
    component: asyncComponent(() => import('../StatisticsView')),
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
