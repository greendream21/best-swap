import React, { useCallback } from 'react';
import { match, Link, withRouter, useLocation, useHistory } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

import AppLayout from './AppLayout';
import ViewPanel from '../../components/viewPanel';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AppRouter from './AppRouter';
import { ContentWrapper, BackLink } from './App.style';
import { COMMIT_HASH } from '../../helpers/envHelper';

type Props = {
  match: match;
};

const App: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    match: { url },
  } = props;

  const location = useLocation();
  const history = useHistory();

  const renderBack = useCallback(() => {
    const { pathname } = location;
    if (pathname === '/' || pathname === '/pools') {
      return <></>;
    }
    return (
      <BackLink onClick={() => {
        history.push('/pools');
      }}
      >
        <LeftOutlined />
        <span>Back</span>
      </BackLink>
    );
  }, [location, history]);

  return (
    <AppLayout data-test="bepswap-app">
      <Header title="SWAP AND STAKE BEP2 ASSETS" />
      <ContentWrapper>
        <ViewPanel>
          {renderBack()}
          <AppRouter url={url} />
        </ViewPanel>
      </ContentWrapper>
      <Footer commitHash={COMMIT_HASH} />
    </AppLayout>
  );
};

export default withRouter(App);
