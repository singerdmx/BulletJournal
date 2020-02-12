import React from 'react';
import { Menu, Icon } from 'antd';

const DropdownMenu = () => (
  <Menu>
    <Menu.Item>
      <Icon type="setting" />
      Settings
    </Menu.Item>
    <Menu.Item>
      <Icon type="export" />
      Log Out
    </Menu.Item>
  </Menu>
);

export default DropdownMenu;
