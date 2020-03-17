import React from 'react';
import { Layout } from 'antd';
import SideMenu from '../../components/side-menu/side-menu.component';
import * as logo from '../../assets/favicon466.ico';

import './side.styles.less';

const { Sider } = Layout;

class SideLayout extends React.Component {
  
  render() {
    return (
      <Sider width={249} className="sider">
        <div className="sider-header">
          <img src={logo} alt="Icon" className="icon-img" />
          <div className="title">
            <h2>Bullet Journal</h2>
          </div>
        </div>
        <SideMenu />
      </Sider>
    );
  }
}

export default SideLayout;
