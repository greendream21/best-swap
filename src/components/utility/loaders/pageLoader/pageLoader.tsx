import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80vh;
`;

export const Loader: React.FC = (): JSX.Element => {
  return (
    <LoaderWrapper>
      <Spin />
    </LoaderWrapper>
  );
};
