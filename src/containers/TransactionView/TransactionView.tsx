import React from 'react';

import { ContentWrapper, StyledPagination } from './TransactionView.style';

const Transaction: React.FC = (): JSX.Element => {
  return (
    <>
      <ContentWrapper className="transaction-wrapper">
        Transaction View
      </ContentWrapper>
      <StyledPagination defaultCurrent={1} total={50} />
    </>
  );
};

export default Transaction;
