import React from 'react';
import { Menu, Icon, Layout } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import * as logo from '../../assets/favicon466.ico';

import './side.styles.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

type PathComponentProps = RouteComponentProps;

class SideLayout extends React.Component<PathComponentProps> {
  onClick = (menu:any) => {
    const path = menu.keyPath.reverse().join('/');
    this.props.history.push(`/${path}`);
  }

  render() {
    return (
      <Sider width={249} className="sider">
        <div className="sider-header">
          <img src={logo} alt="Icon" className="icon-img" />
          <div className="title">
            <h2>Bullet Journal</h2>
          </div>
        </div>
        <Menu
          mode="inline"
          defaultOpenKeys={['todo']}
          style={{ height: '100%', fontWeight: 500 }}
          onClick={this.onClick}
        >
          <SubMenu key="todo" title="Todos">
            <Menu.Item key="today">
              <Icon type="carry-out" />
              Today
            </Menu.Item>
            <Menu.Item key="next7days">
              <Icon type="calendar" />
              Next 7 days
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="projects"
            title={
              <span>
                <Icon type="folder" />
                <span>Projects</span>
              </span>
            }
          ></SubMenu>
          <Menu.Item key="groups">
            <Icon type="team" />
            Groups
          </Menu.Item>
          <Menu.Item key="labels">
            <Icon type="flag" />
            Labels
          </Menu.Item>
          <Menu.Item key="settings">
            <Icon type="setting" />
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(SideLayout);
