import React from 'react';

import { Row, Col } from 'antd';

import ToolCard from 'components/toolCard';

import { toolsData } from './data';

const ToolsView: React.FC = (): JSX.Element => {
  return (
    <Row gutter={[16, 16]}>
      {toolsData.map((toolProps, index) => {
          return (
            <Col
              key={index}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <ToolCard {...toolProps} />
            </Col>
          );
        })}
    </Row>
  );
};

export default ToolsView;
