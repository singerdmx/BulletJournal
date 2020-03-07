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
import { Group, User } from '../../features/group/interfaces';
import { MyselfWithAvatar } from '../../features/myself/reducer';
import { IState } from '../../store';

import './group-card.styles.less';
import AddUser from '../modals/add-user.component';

type GroupProps = {
  group: Group;
  myself: MyselfWithAvatar;
  deleteGroup: (groupId: number, groupName: string) => void;
  removeUserGroupByUsername: (
    groupId: number,
    username: string,
    groupName: string
  ) => void;
  getGroup: (groupdId: number) => void;
  patchGroup: (groupdId: number, groupName: string) => void;
};

type PathProps = RouteComponentProps;

type GroupState = {
  showModal: boolean;
};

function getGroupUserTitle(item: User, group: Group): string {
  if (item.name === group.owner) {
    return 'Owner';
  }
  return item.accepted ? 'Joined' : 'Not Joined';
}

function getGroupUserSpan(item: User, group: Group): JSX.Element {
  if (item.name === group.owner) {
    return (
      <span>
        &nbsp;&nbsp;<strong>{item.name}</strong>
      </span>
    );
  }
  if (item.accepted) {
    return <span>&nbsp;&nbsp;{item.name}</span>;
  }

  return <span style={{ color: 'grey' }}>&nbsp;&nbsp;{item.name}</span>;
}

const { Title } = Typography;

class GroupCard extends React.Component<GroupProps & PathProps, GroupState> {
  state: GroupState = {
    showModal: false
  };

  deleteUser = (groupId: number, username: string, groupName: string) => {
    this.props.removeUserGroupByUsername(groupId, username, groupName);
  };

  deleteGroup = () => {
    this.props.deleteGroup(this.props.group.id, this.props.group.name);
    this.props.history.push("/groups");
  };

  titleChange = (content: string) => {
    this.props.patchGroup(this.props.group.id, content);
  };

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
            <UserOutlined />
            {group.users && group.users.length}
            {group.owner === this.props.myself.username && !group.default && (
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={this.deleteGroup}
                className="group-setting"
              >
                <DeleteOutlined title="Delete Group" />
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
                    {getGroupUserSpan(item, group)}
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
  myself: state.myself
});

export default connect(mapStateToProps, {
  deleteGroup,
  removeUserGroupByUsername,
  getGroup,
  patchGroup
})(withRouter(GroupCard));
