import React from 'react';
import {connect} from 'react-redux';

import {
  AppstoreOutlined,
  BellOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  FolderOutlined,
  ProfileOutlined,
  SettingOutlined,
  SketchOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';

import AddGroup from '../../components/modals/add-group.component';
import AddProject from '../../components/modals/add-project.component';
import {OwnProject, ProjectDnd} from '../../components/project-dnd';
import {Avatar, Menu, Tooltip} from 'antd';
import {RouteComponentProps, withRouter} from 'react-router';
import {GroupsWithOwner} from '../../features/group/interface';
import {Project, ProjectsWithOwner} from '../../features/project/interface';
import {createGroupByName, updateGroups} from '../../features/group/actions';
import {updateProjects} from '../../features/project/actions';
import {IState} from '../../store';
import {getProjectItemsAfterUpdateSelect} from '../../features/myBuJo/actions';
import {getCookie} from "../../index";

const {SubMenu} = Menu;
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
  todoSelected: boolean;
  ledgerSelected: boolean;
  noteSelected: boolean;
  getProjectItemsAfterUpdateSelect: (
      todoSelected: boolean,
      ledgerSelected: boolean,
      noteSelected: boolean,
      category: string,
      forceToday?: boolean
  ) => void;
};

export const iconMapper = {
  TODO: <CarryOutOutlined/>,
  LEDGER: <CreditCardOutlined/>,
  NOTE: <FileTextOutlined/>,
};

// props of router
type PathProps = RouteComponentProps;

// class component
class SideMenu extends React.Component<GroupProps & PathProps & ProjectProps> {
  // click handler when click menu item
  onClick = (menu: any) => {
    const path = menu.keyPath.reverse().join('/');
    this.props.history.push(`/${path}`);
  };

  onProjectClick = (projectId: any) => {
    this.props.history.push(`/projects/${projectId}`);
  };

  // click handler when clicking on the groups submenu
  onGroupsClick = (menu: any) => {
    this.props.history.push(`/${menu.key}`);
  };

  // load data of menu
  componentDidMount() {
    const loginCookie = getCookie('__discourse_proxy');
    if (loginCookie) {
      this.props.updateGroups();
      this.props.updateProjects();
    }
  }

  handleClickToday = () => {
    const {ledgerSelected, todoSelected, noteSelected} = this.props;
    this.props.getProjectItemsAfterUpdateSelect(
        todoSelected,
        ledgerSelected,
        noteSelected,
        'today',
        true
    );
  };

  handleClickCalendar = () => {
    const {ledgerSelected, todoSelected, noteSelected} = this.props;
    this.props.getProjectItemsAfterUpdateSelect(
        todoSelected,
        ledgerSelected,
        noteSelected,
        'calendar'
    );
  };

  render() {
    const {groups: groupsByOwner, ownProjects} = this.props;
    return (
        <Menu
            mode='inline'
            defaultOpenKeys={['todo', 'ownedProjects', 'sharedProjects']}
            style={{fontWeight: 500}}
            onClick={this.onClick}
        >
          <SubMenu
              key='bujo'
              title={
                <span>
              <SketchOutlined/>
              <span id='myBuJo'>My BuJo</span>
            </span>
              }
          >
            <Menu.Item key='today' onClick={() => this.handleClickToday()}>
              <BellOutlined/>
              Today
            </Menu.Item>
            <Menu.Item
                key='recent'
            >
              <AppstoreOutlined/>
              Recent
            </Menu.Item>
            <Menu.Item
                key='calendar'
                onClick={() => this.handleClickCalendar()}
            >
              <CalendarOutlined/>
              Calendar
            </Menu.Item>
          </SubMenu>
          <SubMenu
              key='projects'
              title={
                <span>
              <FolderOutlined/>
              <span id='ownBuJos'>Journals</span>
            </span>
              }
              onTitleClick={this.onGroupsClick}
          >
            <AddProject history={this.props.history} mode={'singular'}/>
            <SubMenu
                key='ownedProjects'
                title={
                  <span>
                <ProfileOutlined/>
                <Tooltip placement='right' title='BuJo created by me'>
                  <span>My Own</span>
                </Tooltip>
              </span>
                }
            >
              <OwnProject ownProjects={ownProjects} id={1}/>
            </SubMenu>
            <SubMenu
                key='sharedProjects'
                title={
                  <span>
                <TeamOutlined/>
                <Tooltip placement='right' title='BuJo shared with me'>
                  <span>Shared with Me</span>
                </Tooltip>
              </span>
                }
            >
              <ProjectDnd sharedProjects={this.props.sharedProjects}/>
            </SubMenu>
          </SubMenu>
          <SubMenu
              key='groups'
              onTitleClick={this.onGroupsClick}
              title={
                <span>
              <TeamOutlined/>
              <span id='allGroups'>Groups</span>
            </span>
              }
          >
            <AddGroup/>

            {groupsByOwner.map((groupsOwner, index) => {
              return groupsOwner.groups.map((group) => (
                  <Menu.Item key={`group${group.id}`}>
                <span className='group-title'>
                  <span>
                    <Avatar size='small' src={group.owner.avatar}/>
                    <Tooltip
                        placement='right'
                        title={`Group "${group.name}" (owner "${group.owner.alias}")`}
                    >
                      <span className='group-name'>{group.name}</span>
                    </Tooltip>
                  </span>
                  <span>
                    <UserOutlined/>
                    {group.users.length}
                  </span>
                </span>
                  </Menu.Item>
              ));
            })}
          </SubMenu>
          <Menu.Item key='labels'>
            <TagsOutlined/>
            <span id='labels'>Labels</span>
          </Menu.Item>
          <Menu.Item key='settings'>
            <SettingOutlined/>
            <span id='settings'>Settings</span>
          </Menu.Item>
        </Menu>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  ownerName: state.user.name,
  id: state.user.id,
  groups: state.group.groups,
  timezone: state.myself.timezone,
  ownProjects: state.project.owned,
  sharedProjects: state.project.shared,
  todoSelected: state.myBuJo.todoSelected,
  ledgerSelected: state.myBuJo.ledgerSelected,
  noteSelected: state.myBuJo.noteSelected,
});

export default connect(mapStateToProps, {
  updateGroups,
  createGroupByName,
  updateProjects,
  getProjectItemsAfterUpdateSelect,
})(withRouter(SideMenu));
