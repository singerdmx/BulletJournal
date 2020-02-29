import React from 'react';
import { connect } from 'react-redux';

import {
  BellOutlined,
  CalendarOutlined,
  FlagOutlined,
  FolderAddOutlined,
  FolderOutlined,
  ProfileOutlined,
  SettingOutlined,
  SketchOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined
} from '@ant-design/icons';

import { Menu, Avatar } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { Project, ProjectsWithOwner } from '../../features/project/interfaces';
import { createGroupByName, updateGroups } from '../../features/group/actions';
import { updateProjects } from '../../features/project/actions';
import { IState } from '../../store';
const { SubMenu } = Menu;

type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

type ProjectProps = {
  ownProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  updateProjects: () => void;
};

type PathProps = RouteComponentProps;

class SideMenu extends React.Component<GroupProps & PathProps & ProjectProps> {
  onClick = (menu: any) => {
    const path = menu.keyPath.reverse().join('/');
    this.props.history.push(`/${path}`);
  };

  onGroupsClick = (menu: any) => {
    this.props.history.push(`/${menu.key}`);
  };

  componentDidMount() {
    this.props.updateGroups();
    this.props.updateProjects();
  }
  render() {
    const { groups: groupsByOwner, ownProjects, sharedProjects } = this.props;
    return (
      <Menu
        mode="inline"
        defaultOpenKeys={['todo']}
        style={{ height: '100%', fontWeight: 500 }}
        onClick={this.onClick}
      >
        <SubMenu
          key="bujo"
          title={
            <span>
              <SketchOutlined />
              <span>My BuJo</span>
            </span>
          }
        >
          <Menu.Item key="today">
            <BellOutlined />
            Today
          </Menu.Item>
          <Menu.Item key="calender">
            <CalendarOutlined />
            Calendar
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="projects"
          title={
            <span>
              <FolderOutlined />
              <span>Bullet Journal</span>
            </span>
          }
        >
          <SubMenu
            key="ownedProjects"
            title={
              <span>
                <ProfileOutlined />
                <span>Owned BuJo</span>
              </span>
            }
          >
            <Menu.Item key="addProject" title="Add New BuJo">
              <FolderAddOutlined />
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sharedProjects"
            title={
              <span>
                <TeamOutlined />
                <span>Shared BuJo</span>
              </span>
            }
          >
            {sharedProjects.map((item, index) => {
              return (
                <Menu.Item key={`project${index}`} title={item.owner}>
                  <div>{item.owner}</div>
                  <UsergroupAddOutlined style={{ fontSize: 20 }} />
                </Menu.Item>
              );
            })}
          </SubMenu>
        </SubMenu>
        <SubMenu
          key="groups"
          onTitleClick={this.onGroupsClick}
          title={
            <span>
              <TeamOutlined />
              <span>Groups</span>
            </span>
          }
        >
          <Menu.Item key="addGroup" title="Create New Group">
            <UsergroupAddOutlined style={{ fontSize: 20 }} />
          </Menu.Item>
          {groupsByOwner.map((groupsOwner, index) => {
            return groupsOwner.groups.map(group => (
              <Menu.Item key={`group${group.id}`}>
                <span className="group-title">
                  <span>
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
                      {group.owner.charAt(0)}
                    </Avatar>
                    <span
                      className="group-name"
                      title={
                        'Group "' +
                        group.name +
                        '" owned by "' +
                        group.owner +
                        '"'
                      }
                    >
                      {group.name}
                    </span>
                  </span>
                  <span>
                    <UserOutlined />
                    {group.users.length}
                  </span>
                </span>
              </Menu.Item>
            ));
          })}
        </SubMenu>
        <Menu.Item key="labels">
          <FlagOutlined />
          Labels
        </Menu.Item>
        <Menu.Item key="settings">
          <SettingOutlined />
          Settings
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
  timezone: state.myself.timezone,
  ownProjects: state.project.owned,
  sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {
  updateGroups,
  createGroupByName,
  updateProjects
})(withRouter(SideMenu));
