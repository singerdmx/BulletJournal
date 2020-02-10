import React from 'react';
import { Menu, Icon, Layout} from 'antd';

import './side.styles.less';

const { Sider } = Layout;

class SideLayout extends React.Component {
    render () {
        return (
            <Sider width={249} className="sider">
            <div className="sider-header">
              <img src="favicon466.ico" alt="Icon" className="icon-img" />
              <div className="title">
                <h2>Bullet Journal</h2>
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['today']}
              style={{height: '100%', fontWeight: 500 }}
            >
              <Menu.Item key="today"><Icon type="carry-out" />Today</Menu.Item>
              <Menu.Item key="next7days"><Icon type="calendar" />Next 7 days</Menu.Item>
              <Menu.Item key="projects"><Icon type="folder" />Projects</Menu.Item>
              <Menu.Item key="groups"><Icon type="team" />Groups</Menu.Item>
              <Menu.Item key="labels"><Icon type="flag" />Labels</Menu.Item>
            </Menu>
          </Sider>
        )
    }
}

export default SideLayout;