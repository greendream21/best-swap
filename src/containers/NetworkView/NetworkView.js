import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { cloneDeep } from 'lodash';

import { ContentWrapper } from './NetworkView.style';
import StatusGroup from '../../components/uielements/statusGroup';
import { stats, tableData, columns } from './data';
import Table from '../../components/uielements/table';
import Label from '../../components/uielements/label';

class NetworkView extends Component {
  render() {
    const tableActionColumn = {
      title: '',
      dataIndex: '',
      key: '',
      render: () => (
        <Label className="action" color="primary" weight="bold">
          view
        </Label>
      ),
    };
    const tableColumns = cloneDeep(columns);
    tableColumns.push(tableActionColumn);

    return (
      <ContentWrapper>
        <Row>
          <Col span={12}>
            <StatusGroup title="nodes" status={stats.nodes} />
            <StatusGroup title="sidechain" status={stats.sidechain} />
          </Col>
          <Col span={12}>
            <StatusGroup title="threshold addresses" status={stats.threshold} />
          </Col>
        </Row>
        <Row className="network-blocks">
          <Label
            className="group-title"
            color="normal"
            size="big"
            weight="bold"
          >
            BLOCKS
          </Label>
          <Table dataSource={tableData} columns={tableColumns} />
        </Row>
      </ContentWrapper>
    );
  }
}

export default NetworkView;
