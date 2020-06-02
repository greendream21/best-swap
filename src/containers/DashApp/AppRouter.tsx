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
    component: asyncComponent(() => import('../pages/Swap/SwapLanding')),
  },
  {
    path: 'connect',
    component: asyncComponent(() => import('../pages/Connect')),
  },
  {
    path: 'stats',
    component: asyncComponent(() => import('../pages/Stats')),
  },
  {
    path: 'faqs',
    component: asyncComponent(() => import('../pages/Faqs')),
  },
  {
    path: 'network',
    component: asyncComponent(() => import('../pages/Network')),
  },
  {
    path: 'swap/:info',
    component: asyncComponent(() => import('../pages/Swap/SwapDetail')),
  },
  {
    path: 'swap/',
    component: asyncComponent(() => import('../pages/Swap')),
  },
  {
    path: 'pools',
    component: asyncComponent(() => import('../pages/Pool/Pools')),
  },
  {
    path: 'pool/:symbol/:action?',
    component: asyncComponent(() => import('../pages/Pool')),
  },
  {
    path: 'transaction',
    component: asyncComponent(() => import('../pages/Transactions')),
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
