import React, { useCallback, useMemo } from 'react';

import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { TutorialViewWrapper } from './TutorialView.style';
import Tabs from '../../components/uielements/tabs';
import PanelHeader from '../../components/uielements/panelHeader';

import Swap from './tutorials/Swap';
import DoubleSwap from './tutorials/DoubleSwap';
import Stake from './tutorials/Stake';
import Earning from './tutorials/Earning';
import { TutorialType, TutorialContent, TutorialMatch } from './types';

const { TabPane } = Tabs;

type Props = {};

const Tutorial: React.FC<Props> = (_: Props): JSX.Element => {
  const history = useHistory();

  const match = useRouteMatch<TutorialMatch>(
    '/tutorial/:type?/:view?/:content?',
  );

  const handleChangeTab = useCallback(
    (type: TutorialType) => history.push(`/tutorial/${type}`),
    [history],
  );

  const matchType = useMemo(() => match?.params?.type ?? '', [match]);

  return (
    <TutorialViewWrapper>
      <PanelHeader>
        <>
          <Tabs activeKey={matchType} onChange={handleChangeTab} action>
            <TabPane tab={TutorialType.SWAP} key={TutorialType.SWAP} />
            <TabPane tab={TutorialType.POOL} key={TutorialType.POOL} />
          </Tabs>
        </>
      </PanelHeader>

      <Switch>
        <Route path="/tutorial/swap/single/play">
          <Swap view={TutorialContent.PLAY} />
        </Route>
        <Route path="/tutorial/swap/single">
          <Swap view={TutorialContent.INTRO} />
        </Route>
        <Route path="/tutorial/swap/double/play">
          <DoubleSwap view={TutorialContent.PLAY} />
        </Route>
        <Route path="/tutorial/swap/double">
          <DoubleSwap view={TutorialContent.INTRO} />
        </Route>
        <Route path="/tutorial/pool/stake/play">
          <Stake view={TutorialContent.PLAY} />
        </Route>
        <Route path="/tutorial/pool/stake">
          <Stake view={TutorialContent.INTRO} />
        </Route>
        <Route path="/tutorial/pool/earn/play">
          <Earning view={TutorialContent.PLAY} />
        </Route>
        <Route path="/tutorial/pool/earn">
          <Earning view={TutorialContent.INTRO} />
        </Route>
        <Route path="/tutorial/pool">
          <Redirect
            to={{
              pathname: '/tutorial/pool/stake',
            }}
          />
        </Route>
        <Route path="/tutorial">
          <Redirect
            to={{
              pathname: '/tutorial/swap/single',
            }}
          />
        </Route>
      </Switch>
    </TutorialViewWrapper>
  );
};

export default Tutorial;
