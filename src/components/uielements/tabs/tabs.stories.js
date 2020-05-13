import React from 'react';
import { storiesOf } from '@storybook/react';
import Tabs from './tabs';

const { TabPane } = Tabs;

storiesOf('Components/Tabs', module).add('default', () => {
  return (
    <>
      <Tabs defaultActivateKey="1">
        <TabPane tab="Swap" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Pools" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Trade" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
      <Tabs defaultActivateKey="1" withBorder>
        <TabPane tab="Swap" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Pools" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Trade" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  );
});
