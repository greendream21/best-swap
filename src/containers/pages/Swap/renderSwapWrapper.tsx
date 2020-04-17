import React from 'react';
import { Row, Col } from 'antd';

import { SwapWrapper } from './Swap.style';
import ActionView from '../../ActionView';

type Props = { view: string; info?: string };

const render = (props: Props) => {
  const { view, info = '' } = props;
  return (
    <SwapWrapper>
      <Row gutter={32}>
        <Col span={24}>
          <ActionView type="swap" view={view} info={info} />
        </Col>
      </Row>
    </SwapWrapper>
  );
};

export default render;
