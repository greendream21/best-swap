import React from 'react';
import { Spin } from 'antd';
import { LoaderWrapper } from './WalletView.style';

export const Loader: React.FC = (): JSX.Element => {
  return (
    <LoaderWrapper>
      <Spin />
    </LoaderWrapper>
  );
};
