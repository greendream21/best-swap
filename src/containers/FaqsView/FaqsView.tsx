import React from 'react';

import { ContentWrapper } from './FaqsView.style';
import Collapse from '../../components/uielements/collapse';
import { faqs } from './data';

const FaqsView: React.FC = (): JSX.Element => {
  return (
    <ContentWrapper>
      <Collapse data={faqs} />
    </ContentWrapper>
  );
};

export default FaqsView;
