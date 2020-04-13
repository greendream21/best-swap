import React from 'react';
import { withRouter } from 'react-router-dom';

import { TransactionWrapper } from './Transactions.style';
import ActionView from '../../ActionView';

const Transaction: React.FC = (): JSX.Element => {
  return (
    <TransactionWrapper>
      <ActionView type="transaction" view="history" />
    </TransactionWrapper>
  );
};

export default withRouter(Transaction);
