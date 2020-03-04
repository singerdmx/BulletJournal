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
import { Menu, Avatar, Tree } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { Project, ProjectsWithOwner } from '../../features/project/interfaces';
import { createGroupByName, updateGroups } from '../../features/group/actions';
import { updateProjects } from '../../features/project/actions';
import { IState } from '../../store';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { History } from 'history';

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
}

//dfs tree data
var loop = (data: Project[], owner: string, index: number, history: History<History.PoorMansUnknown>): TreeNodeNormal[] => {
    let res = [] as TreeNodeNormal[];
    data.forEach((item: Project) => {
      const node = {} as TreeNodeNormal;
      if (item.subProjects && item.subProjects.length) {
        node.children = loop(item.subProjects, owner, index, history);
      } else {
        node.children = [] as TreeNodeNormal[];
      }
      if (item.owner) {
        node.title = (<span onClick={(e)=>history.push(`/projects/${item.id}`)} title={'Owner: '+item.owner}>{iconMapper[item.projectType]}&nbsp;{item.name}</span>);
      } else {
        node.title = (<span title='Not Shared' style={{color: '#e0e0eb', cursor: 'default'}}>{iconMapper[item.projectType]}&nbsp;{item.name}</span>);
      }
      node.key = item.id.toString();
      res.push(node);
    });
    return res;
}

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
    this.props.history.push(`/projects/${projectId}`)
  }


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
          <Menu.Item key="calendar">
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
          onTitleClick={this.onGroupsClick}
        >
          <AddProject />
          <SubMenu
            key="ownedProjects"
            title={
              <span>
                <ProfileOutlined />
                <span title='BuJo created by me'>Owned BuJo</span>
              </span>
            }
          >
          </SubMenu>
          <SubMenu
            key="sharedProjects"
            title={
              <span>
                <TeamOutlined />
                <span title='BuJo shared with me'>Shared BuJo</span>
              </span>
            }
          >
            {sharedProjects.map((item, index) => {
              var treeNode = loop(item.projects, item.owner, index, this.props.history);
              return (
                <div style={{ marginLeft: '20%'}} key={'sharedProject' + item.owner + index}>
                  <Tree defaultExpandAll treeData={treeNode} selectable={false}/>
                </div>
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
            <AddGroup />
         
          {groupsByOwner.map((groupsOwner, index) => {
            return groupsOwner.groups.map(group => (
              <Menu.Item key={`group${group.id}`}>
                <span className="group-title">
                  <span>
                    <Avatar size="small" src={group.ownerAvatar} />
                    <span
                      className="group-name"
                      title={`Group "${group.name}" (owner "${group.owner}")`}
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
