import React from 'react';
import { Layout, Input } from 'antd';
import Myself from '../../features/myself/Myself';

const { Header } = Layout;
const { Search } = Input;
class HeaderLayout extends React.Component {
  render() {
    return (
      <Header className='header'>
        <div className='search-box'>
          <Search placeholder='Search' style={{ width: '300px' }} />
        </div>
        <Myself />
      </Header>
    );
  }
}

export default HeaderLayout;
