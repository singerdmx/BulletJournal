import React from 'react';
import { Menu, Icon, Layout, Avatar, Typography } from 'antd';
import { GroupsWithOwner } from '../../features/group/reducer';
import { updateGroups, createGroupByName } from '../../features/group/actions';
import { withRouter, RouteComponentProps } from 'react-router';
import * as logo from '../../assets/favicon466.ico';

import './side.styles.less';
import { connect } from 'react-redux';
import { IState } from '../../store';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;

type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
  createGroupByName: (name: string) => void;
};

type PathProps = RouteComponentProps;

class SideLayout extends React.Component<GroupProps & PathProps> {
  onClick = (menu: any) => {
    const path = menu.keyPath.reverse().join('/');
    this.props.history.push(`/${path}`);
  };

  componentDidMount() {
    this.props.updateGroups();
  }

  render() {
    const groupsByOwner = this.props.groups;
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
          <SubMenu key="todo" title="TODO">
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
                <span>Bullet Journal</span>
              </span>
            }
          ></SubMenu>
          <SubMenu
            key="groups"
            title={
              <span>
                <Icon type="team" />
                <span>Groups</span>
              </span>
            }
          >
            {groupsByOwner.map((groupsOwner, index) => {
              return groupsOwner.groups.map((group) => (
                <SubMenu
                  key={group.id}
                  title={
                    <span className="group-title">
                      <Avatar
                        size="small"
                        style={
                          index === 0
                            ? {
                                backgroundColor: '#f56a00'
                              }
                            : {
                                backgroundColor: '#fde3cf'
                              }
                        }
                      >
                        {group.owner[0]}
                      </Avatar>
                      <span className="group-name">{group.name}</span>
                    </span>
                  }
                >
                  {group.users.map(user => (
                    <Menu.Item key={user.id}>
                      <Avatar size="small" src={user.avatar} /> {user.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ));
            })}
          </SubMenu>
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

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups
});

export default connect(mapStateToProps, { updateGroups, createGroupByName })(
  withRouter(SideLayout)
);
