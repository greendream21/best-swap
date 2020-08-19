import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ChartLoader: React.FC = (): JSX.Element => (
  <LoaderWrapper>
    <Spin />
  </LoaderWrapper>
);

export default ChartLoader;
