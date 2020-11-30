import React from 'react';

import Collapse from 'components/uielements/collapse';

import { faqs } from './data';
import { ContentWrapper } from './FaqsView.style';

const FaqsView: React.FC = (): JSX.Element => {
  return (
    <ContentWrapper>
      <Collapse data={faqs} />
    </ContentWrapper>
  );
};

export default FaqsView;
