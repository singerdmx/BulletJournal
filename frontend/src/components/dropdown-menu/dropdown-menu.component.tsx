import React from "react";
import { Menu, Icon } from "antd";
import { logoutUser } from "../../apis/userApis";

const handleLogout = () => {
  logoutUser().then(res => {
    window.location.href = res.headers.get("Location")!;
  });
};

type menuProps = {
  username : string
}

const DropdownMenu = ({username} : menuProps) => (
  <Menu>
    <Menu.Item>
      {username}
    </Menu.Item>
    <Menu.Item>
      <Icon type="setting" />
      Settings
    </Menu.Item>
    <Menu.Item onClick={() => handleLogout()}>
      <Icon type="export" />
      Log Out
    </Menu.Item>
  </Menu>
);

export default DropdownMenu;
