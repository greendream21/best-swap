import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="/profile">Profile</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="/setting">Setting</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">Cancel</Menu.Item>
  </Menu>
);

class HeaderSetting extends Component {
  render() {
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link" href="/">
          John Doe
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

export default HeaderSetting;
