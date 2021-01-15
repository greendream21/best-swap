import React from 'react';

import Helmet from 'components/helmet';
import Collapse from 'components/uielements/collapse';

import { faqs } from './data';
import { ContentWrapper } from './FaqsView.style';

const FaqsView: React.FC = (): JSX.Element => {
  return (
    <ContentWrapper>
      <Helmet title="FAQs" content="FAQs" />
      <Collapse data={faqs} />
    </ContentWrapper>
  );
};

export default FaqsView;
