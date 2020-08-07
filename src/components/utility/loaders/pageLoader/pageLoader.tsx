import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Loader: React.FC = (): JSX.Element => {
  return (
    <LoaderWrapper>
      <Spin />
    </LoaderWrapper>
  );
};
