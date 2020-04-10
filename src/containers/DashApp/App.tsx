import React from 'react';
import { match } from 'react-router-dom';
import AppLayout from './AppLayout';

import Header from '../../components/header';
import Footer from '../../components/footer';
import AppRouter from './AppRouter';
import { ContentWrapper } from './App.style';
import { COMMIT_HASH } from '../../helpers/envHelper';

type Props = {
  match: match;
};

const App: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    match: { url },
  } = props;

  return (
    <AppLayout data-test="bepswap-app">
      <Header title="SWAP AND STAKE BEP2 ASSETS" />
      <ContentWrapper>
        <AppRouter url={url} />
      </ContentWrapper>
      <Footer commitHash={COMMIT_HASH} />
    </AppLayout>
  );
};

export default App;
