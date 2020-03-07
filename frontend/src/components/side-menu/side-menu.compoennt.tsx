import React from 'react';
import { connect } from 'react-redux';

import {
  BellOutlined,
  CalendarOutlined,
  FlagOutlined,
  FolderOutlined,
  ProfileOutlined,
  SettingOutlined,
  SketchOutlined,
  TeamOutlined,
  UserOutlined,
  CarryOutOutlined,
  AccountBookOutlined,
  FileTextOutlined
} from '@ant-design/icons';

import AddGroup from '../../components/modals/add-group.component';
import AddProject from '../../components/modals/add-project.component';
import ProjectDnd from '../../components/project-dnd/project-dnd.component';
import { Menu, Avatar, Tooltip } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { Project, ProjectsWithOwner } from '../../features/project/interfaces';
import { createGroupByName, updateGroups } from '../../features/group/actions';
import { updateProjects } from '../../features/project/actions';
import { IState } from '../../store';

const { SubMenu } = Menu;
//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};
// props of projects
type ProjectProps = {
  ownProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  updateProjects: () => void;
};

export const iconMapper = {
  TODO: <CarryOutOutlined />,
  LEDGER: <AccountBookOutlined />,
  NOTE: <FileTextOutlined />
};

// props of router
type PathProps = RouteComponentProps;
// class compoennt
class SideMenu extends React.Component<GroupProps & PathProps & ProjectProps> {
  // click handler when click menu item
  onClick = (menu: any) => {
    const path = menu.keyPath.reverse().join('/');
    this.props.history.push(`/${path}`);
  };

  onProjectClick = (projectId: any) => {
    this.props.history.push(`/projects/${projectId}`);
  };

  // claick handler when clicking on the groups submenu
  onGroupsClick = (menu: any) => {
    this.props.history.push(`/${menu.key}`);
  };
  // load data of menu
  componentDidMount() {
    this.props.updateGroups();
    this.props.updateProjects();
  }

  render() {
    const { groups: groupsByOwner, history } = this.props;
    return (
      <Menu
        mode='inline'
        defaultOpenKeys={['todo']}
        style={{ height: '100%', fontWeight: 500 }}
        onClick={this.onClick}
      >
        <SubMenu
          key='bujo'
          title={
            <span>
              <SketchOutlined />
              <span>My BuJo</span>
            </span>
          }
        >
          <Menu.Item key='today'>
            <BellOutlined />
            Today
          </Menu.Item>
          <Menu.Item key='calendar'>
            <CalendarOutlined />
            Calendar
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key='projects'
          title={
            <span>
              <FolderOutlined />
              <span>Bullet Journal</span>
            </span>
          }
          onTitleClick={this.onGroupsClick}
        >
          <AddProject history={this.props.history} mode={'singular'}/>
          <SubMenu
            key='ownedProjects'
            title={
              <span>
                <ProfileOutlined />
                <Tooltip placement="right" title='BuJo created by me'>
                  <span>Owned BuJo</span>
                </Tooltip>
              </span>
            }
          ></SubMenu>
          <SubMenu
            key='sharedProjects'
            title={
              <span>
                <TeamOutlined />
                <Tooltip placement="right" title='BuJo shared with me'>
                  <span>Shared BuJo</span>
                </Tooltip>
              </span>
            }
          >
            <ProjectDnd sharedProjects={this.props.sharedProjects} />
          </SubMenu>
        </SubMenu>
        <SubMenu
          key='groups'
          onTitleClick={this.onGroupsClick}
          title={
            <span>
              <TeamOutlined />
              <span>Groups</span>
            </span>
          }
        >
          <AddGroup />

          {groupsByOwner.map((groupsOwner, index) => {
            return groupsOwner.groups.map(group => (
              <Menu.Item key={`group${group.id}`}>
                <span className='group-title'>
                  <span>
                    <Avatar size='small' src={group.ownerAvatar} />
                    <Tooltip placement="right" title={`Group "${group.name}" (owner "${group.owner}")`}>
                      <span
                        className='group-name'
                      >
                        {group.name}
                      </span>
                    </Tooltip>
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
        <Menu.Item key='labels'>
          <FlagOutlined />
          Labels
        </Menu.Item>
        <Menu.Item key='settings'>
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
