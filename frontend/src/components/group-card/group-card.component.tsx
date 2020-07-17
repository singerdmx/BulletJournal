import React from "react";
import {CloseOutlined, DeleteOutlined, UserOutlined, SearchOutlined} from "@ant-design/icons";
import {Avatar, Badge, Button, Input, List, Popconfirm, Tooltip, Typography,} from "antd";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {deleteGroup, getGroup, patchGroup, removeUserGroupByUsername,} from "../../features/group/actions";
import {Group, User} from "../../features/group/interface";
import {MyselfWithAvatar} from "../../features/myself/reducer";
import {IState} from "../../store";

import AddUser from "../modals/add-user.component";
import {History} from "history";
import {changeAlias} from "../../features/user/actions";

type GroupProps = {
  group: Group;
  multiple: boolean;
  myself: MyselfWithAvatar;
  deleteGroup: (
    groupId: number,
    groupName: string,
    history: History<History.PoorMansUnknown>
  ) => void;
  changeAlias: (targetUser: string, alias: string, groupId: number) => void;
  removeUserGroupByUsername: (
    groupId: number,
    username: string,
    groupName: string
  ) => void;
  getGroup: (groupId: number) => void;
  patchGroup: (groupId: number, groupName: string) => void;
};

type PathProps = RouteComponentProps;

type GroupCardState = {
  users: User[];
};

function getGroupUserTitle(user: User, group: Group): string {
  if (user.name === group.owner.name) {
    return `Owner ${user.name}`;
  }
  return user.accepted ? `${user.name} Joined` : `${user.name} Not Joined`;
}

const { Title, Text } = Typography;

class GroupCard extends React.Component<GroupProps & PathProps, GroupCardState> {

  state: GroupCardState = {
    users: this.props.group.users,
  };

  deleteUser = (groupId: number, username: string, groupName: string) => {
    this.props.removeUserGroupByUsername(groupId, username, groupName);
    const users = [] as User[];
    this.state.users.forEach(u => {
      if (u.name !== username) {
        users.unshift(u);
      }
    })
    this.setState({users: users});
  };

  deleteGroup = () => {
    this.props.deleteGroup(
      this.props.group.id,
      this.props.group.name,
      this.props.history
    );
  };

  titleChange = (content: string) => {
    this.props.patchGroup(this.props.group.id, content);
  };

  onAliasChange(alias: string, targetUser: string, groupId: number) {
    if (alias) {
      this.props.changeAlias(targetUser, alias, groupId);
    }
  }

  getGroupUserSpan(user: User, group: Group): JSX.Element {
    if (this.props.myself.username === user.name) {
      return <span className="group-user-info">{user.name}</span>;
    }

    if (user.accepted) {
      return (
        <Tooltip title='Change Alias' placement='right'>
          <span className="group-user-info">
            <Text
                ellipsis={true}
                editable={{
                  onChange: (e) => this.onAliasChange(e, user.name, group.id),
                }}
            >
              {user.alias}
            </Text>
          </span>
        </Tooltip>
      );
    }

    return (
      <Tooltip title='Change Alias' placement='right'>
        <span className="group-user-info" style={{ color: "grey" }}>
          <Text
            ellipsis={true}
            editable={{
              onChange: (e) => this.onAliasChange(e, user.name, group.id),
            }}
          >
            {user.alias}
          </Text>
        </span>
      </Tooltip>
    );
  }

  render() {
    const { group } = this.props;
    const isEditable = group.owner.name === this.props.myself.username;

    const getUserOps = (user: User, groupOwner: string) => {
      if (user.name !== groupOwner && groupOwner === this.props.myself.username) {
        return <Tooltip
            placement="right"
            title={user.accepted ? "Remove" : "Cancel Invitation"}
        >
          <Button
              type="link"
              size="small"
              onClick={() =>
                  this.deleteUser(group.id, user.name, group.name)
              }
          >
            <CloseOutlined/>
          </Button>
        </Tooltip>;
      }
      if (user.name !== groupOwner && user.name === this.props.myself.username) {
        return <Tooltip
            placement="right"
            title='Leave'
        >
          <Button
              type="link"
              size="small"
              onClick={() =>
                  this.deleteUser(group.id, user.name, group.name)
              }
          >
            <CloseOutlined/>
          </Button>
        </Tooltip>;
      }
      return null;
    };

    const shouldInclude = (u: User, value: string) => {

      return isSubsequence(u.name.toLowerCase(), value) || isSubsequence(u.alias.toLowerCase(), value);
    }

  
    const isSubsequence = (userInfo: string, value: string) => {
       var i = 0;
       var j = 0;    
      while (i < value.length && j< userInfo.length) {
          if (value.charAt(i) === userInfo.charAt(j)){
              i++;
          }
          j++;
          if(i === value.length)
              return true;
      }
      return false;
    }
   

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
      let { value } = e.target;
      console.log(value)

      if (!value) {
        this.setState({users: group.users});
        return;
      }

      value = value.toLowerCase();
      const users = [] as User[];
      group.users.forEach(u => {
        if (shouldInclude(u, value)) {
          users.unshift(u);
        }
      })
      this.setState({users: users});
    };

    return (
      <div className={`group-card ${this.props.multiple && 'multiple'}`}>
        <div className="group-title">
          <Title
            level={4}
            editable={isEditable ? { onChange: this.titleChange } : false}
          >
            {group.name}
          </Title>
          <h3 className="group-operation">
            <span className="group-setting">
              <UserOutlined />
              {group.users && group.users.length}
            </span>
            {group.owner.name === this.props.myself.username && !group.default && (
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={this.deleteGroup}
                className="group-setting"
              >
                <Tooltip placement="top" title="Delete Group">
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            )}
          </h3>
        </div>
        <div className="group-users">
          <List
            dataSource={this.state.users}
            renderItem={(user) => {
              return (
                <List.Item key={user.id}>
                    <div className="group-user">
                      <Tooltip
                          placement="topLeft"
                          title={getGroupUserTitle(user, group)}
                      >
                        <Badge dot={!user.accepted}>
                          <Avatar
                            size={user.name === group.owner.name ? "large" : "default"}
                            src={user.avatar}
                          />
                        </Badge>
                      </Tooltip>
                      {this.getGroupUserSpan(user, group)}
                    </div>
                  {getUserOps(user, group.owner.name)}
                </List.Item>
              );
            }}
          />
        </div>
        <div className='group-card-footer'>
          {group.owner.name === this.props.myself.username && (
              <AddUser groupId={group.id} groupName={group.name}/>
          )}
          <span className='group-card-footer-filter'>
            <Input placeholder="Filter" allowClear={true} prefix={<SearchOutlined />} onChange={e => onFilter(e)}/>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  myself: state.myself,
});

export default connect(mapStateToProps, {
  deleteGroup,
  removeUserGroupByUsername,
  getGroup,
  patchGroup,
  changeAlias,
})(withRouter(GroupCard));
