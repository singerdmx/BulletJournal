import React from 'react';
import { Menu, Icon } from 'antd';
import { logoutUser } from '../../apis/myselfApis';
import { History } from 'history';

const handleLogout = () => {
  logoutUser().then(res => {
    window.location.href = res.headers.get('Location')!;
  });
};

type menuProps = {
  username: string;
  history: History<History.PoorMansUnknown>;
};

const onClickSetting = (history: History<History.PoorMansUnknown>) => {
  history.push('/settings');
};

const DropdownMenu = ({ username, history }: menuProps) => (
  <Menu>
    <Menu.Item style={{cursor: 'default'}}>{username}</Menu.Item>
    <Menu.Item onClick={() => onClickSetting(history)}>
      <Icon type='setting'/>
      Settings
    </Menu.Item>
    <Menu.Item onClick={() => handleLogout()}>
      <Icon type='export' />
      Log Out
    </Menu.Item>
  </Menu>
);

export default DropdownMenu;
