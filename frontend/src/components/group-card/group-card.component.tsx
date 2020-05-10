import React from 'react';
import { CloseOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Button, List, Badge, Avatar, Typography, Popconfirm, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  deleteGroup,
  removeUserGroupByUsername,
  getGroup,
  patchGroup
} from '../../features/group/actions';
import { Group, User } from '../../features/group/interface';
import { MyselfWithAvatar } from '../../features/myself/reducer';
import { IState } from '../../store';

import './group-card.styles.less';
import AddUser from '../modals/add-user.component';
import { History } from "history";
import {changeAlias} from "../../features/user/actions";


type GroupProps = {
  group: Group;
  myself: MyselfWithAvatar;
  deleteGroup: (groupId: number, groupName: string, history: History<History.PoorMansUnknown>) => void;
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

type GroupState = {
  showModal: boolean;
};

function getGroupUserTitle(user: User, group: Group): string {
  if (user.name === group.owner) {
    return 'Owner';
  }
  return user.accepted ? `${user.name} Joined` : `${user.name} Not Joined`;
}

const { Title, Text } = Typography;

class GroupCard extends React.Component<GroupProps & PathProps, GroupState> {
  state: GroupState = {
    showModal: false
  };

  deleteUser = (groupId: number, username: string, groupName: string) => {
    this.props.removeUserGroupByUsername(groupId, username, groupName);
  };

  deleteGroup = () => {
    this.props.deleteGroup(this.props.group.id, this.props.group.name, this.props.history);
  };

  titleChange = (content: string) => {
    this.props.patchGroup(this.props.group.id, content);
  };

  onAliasChange(alias: string, targetUser: string, groupId: number) {
    this.props.changeAlias(targetUser, alias, groupId);
  }

  getGroupUserSpan(user: User, group: Group): JSX.Element {
    if (user.name === group.owner) {
      return (
          <span>
        &nbsp;&nbsp;<strong>{user.name}</strong>
      </span>
      );
    }
    if (this.props.myself.username === user.name) {
      return <span>&nbsp;&nbsp;{user.name}</span>;
    }

    if (user.accepted) {
      return <span><Text
          editable={{onChange: (e) => this.onAliasChange(e, user.name, group.id)}}
      >&nbsp;&nbsp;{user.alias}</Text></span>;
    }

    return <span style={{ color: 'grey' }}><Text
        editable={{onChange: (e) => this.onAliasChange(e, user.name, group.id)}}
    >&nbsp;&nbsp;{user.alias}</Text></span>;
  }

  render() {
    const { group } = this.props;
    const isEditable = group.owner === this.props.myself.username;
    return (
      <div className="group-card">
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
            {group.owner === this.props.myself.username && !group.default && (
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={this.deleteGroup}
                className="group-setting"
              >
                <Tooltip placement="top" title="Delete Group" >
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            )}
          </h3>
        </div>
        <div className="group-users">
          <List
            dataSource={group.users}
            renderItem={item => {
              return (
                <List.Item key={item.id}>
                  <Tooltip placement="right" title={getGroupUserTitle(item, group)}>
                    <div
                      className="group-user"
                    >
                      <Badge dot={!item.accepted}>
                        <Avatar size={item.name === group.owner ? 'large' : 'default'} src={item.avatar} />
                      </Badge>
                      {this.getGroupUserSpan(item, group)}
                    </div>
                  </Tooltip>
                  {item.name !== group.owner &&
                    group.owner === this.props.myself.username && (
                      <Tooltip placement="right" title={item.accepted ? 'Remove' : 'Cancel Invitation'}>
                        <Button
                          type="link"
                          size="small"

                          onClick={() =>
                            this.deleteUser(group.id, item.name, group.name)
                          }
                        >
                          <CloseOutlined />
                        </Button>
                      </Tooltip>
                    )}
                </List.Item>
              );
            }}
          />
        </div>
        {group.owner === this.props.myself.username && (
          <AddUser groupId={group.id} groupName={group.name} />
        )}
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
  changeAlias
})(withRouter(GroupCard));
