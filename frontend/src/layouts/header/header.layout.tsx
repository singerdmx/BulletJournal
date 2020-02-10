import React from 'react';
import { Layout, Input } from 'antd';
import UserInfo from '../../features/user-info/UserInfo';

const { Header } = Layout;
const { Search } = Input;
class HeaderLayout extends React.Component {
  render() {
    return (
      <Header className="header">
        <div className="search-box">
          <Search />
        </div>
        <UserInfo />
      </Header>
    );
  }
}

export default HeaderLayout;
