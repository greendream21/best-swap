import React, { Component } from 'react';

import { ContentWrapper } from './FaqsView.style';
import Collapse from '../../components/uielements/collapse';
import { faqs } from './data';

class FaqsView extends Component {
  render() {
    return (
      <ContentWrapper>
        <Collapse data={faqs} />
      </ContentWrapper>
    );
  }
}

export default FaqsView;
