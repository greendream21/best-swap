import React, { useCallback } from 'react';

import { match, withRouter, useLocation, useHistory } from 'react-router-dom';

import { LeftOutlined } from '@ant-design/icons';


import Footer from 'components/footer';
import Header from 'components/header';
import ViewPanel from 'components/viewPanel';

import { COMMIT_HASH } from 'helpers/envHelper';

import { ContentWrapper, BackLink } from './App.style';
import AppLayout from './AppLayout';
import AppRouter from './AppRouter';

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
      <BackLink
        onClick={() => {
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
      <Header title="SWAP AND ADD BEP2 ASSETS" />
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
