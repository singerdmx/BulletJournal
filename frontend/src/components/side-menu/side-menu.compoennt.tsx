import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Avatar } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { createGroupByName, updateGroups } from '../../features/group/actions';
import { IState } from '../../store';
const { SubMenu } = Menu;

type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
  createGroupByName: (name: string) => void;
};

type MyselfProps = {
  timezone: string;
};

type PathProps = RouteComponentProps;

class SideMenu extends React.Component<GroupProps & PathProps & MyselfProps> {
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
  }
  render() {
    const groupsByOwner = this.props.groups;
    return (
      <Menu
        mode='inline'
        defaultOpenKeys={['todo']}
        style={{ height: '100%', fontWeight: 500 }}
        onClick={this.onClick}
      >
        <SubMenu
          key='todo'
          title={
            <span>
              <Icon type='sketch' />
              <span>My BUJOs</span>
            </span>
          }
        >
          <Menu.Item key='today'>
            <Icon type='bell' />
            Today
          </Menu.Item>
          <Menu.Item key='calendarView'>
            <Icon type='calendar' />
            Calendar View
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
        ></SubMenu>
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
  timezone: state.myself.timezone
});

export default connect(mapStateToProps, {
  updateGroups,
  createGroupByName
})(withRouter(SideMenu));
