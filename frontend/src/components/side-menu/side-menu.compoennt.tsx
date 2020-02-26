import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Avatar } from 'antd';
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
  createGroupByName: (name: string) => void;
};

type ProjectProps = {
  ownProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  updateProjects: () => void;
}

type PathProps = RouteComponentProps;

class SideMenu extends React.Component<GroupProps & PathProps & ProjectProps> {
  state = {
    showModal: false
  };

  onClick = (menu: any) => {
    if (menu.key === 'addGroup') {
      console.log(menu);
    } else {
      const path = menu.keyPath.reverse().join('/');
      this.props.history.push(`/${path}`);
    }
  };

  onGroupsClick = (menu: any) => {
    this.props.history.push(`/${menu.key}`);
  };

  componentDidMount() {
    this.props.updateGroups();
    this.props.updateProjects();
  }
  render() {
    const { groups: groupsByOwner, ownProjects, sharedProjects}  = this.props;
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
              <Icon type='sketch' />
              <span>My BuJo</span>
            </span>
          }
        >
          <Menu.Item key='today'>
            <Icon type='bell' />
            Today
          </Menu.Item>
          <Menu.Item key='calender'>
            <Icon type='calendar' />
            Calendar
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key='projects'
          title={
            <span>
              <Icon type='folder' />
              <span>Bullet Journal</span>
            </span>
          }
        >
          <SubMenu
            key='own-Projects'
            title={
              <span>
                <Icon type='profile' />
                <span>Owned BuJo</span>
              </span>
            }
          >
            <Menu.Item key='addProjects' title='Add New BuJo'>
              <Icon type='folder-add' />
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key='share-Projects'
            title={
              <span>
                <Icon type='team' />
                <span>Shared BuJo</span>
              </span>
            }
          >
          {sharedProjects.map(((item, index)=>{
            return (
                <Menu.Item key={'project' + index} title={item.owner}>
                <div>{item.owner}</div>
                <Icon type='usergroup-add' style={{ fontSize: 20 }} />
                </Menu.Item>)
              }))}
          </SubMenu>
        </SubMenu>
        <SubMenu
          key='groups'
          onTitleClick={this.onGroupsClick}
          title={
            <span>
              <Icon type='team' />
              <span>Groups</span>
            </span>
          }
        >
          <Menu.Item key='addGroup' title='Create New Group'>
            <Icon type='usergroup-add' style={{ fontSize: 20 }} />
          </Menu.Item>
          {groupsByOwner.map((groupsOwner, index) => {
            return groupsOwner.groups.map(group => (
              <Menu.Item key={group.id}>
                <span className='group-title'>
                  <span>
                    <Avatar
                      size='small'
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
                      className='group-name'
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
                    <Icon type='user' />
                    {group.users.length}
                  </span>
                </span>
              </Menu.Item>
            ));
          })}
        </SubMenu>
        <Menu.Item key='labels'>
          <Icon type='flag' />
          Labels
        </Menu.Item>
        <Menu.Item
          key='settings'
        >
          <Icon type='setting' />
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
