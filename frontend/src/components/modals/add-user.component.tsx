import React from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Modal, Input, Button, Avatar, Empty, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { addUserGroupByUsername } from '../../features/group/actions';
import { updateUser, clearUser, userApiErrorReceived } from '../../features/user/actions';
import { UserWithAvatar } from '../../features/user/reducer';
import { IState } from '../../store';

import './modals.styles.less';

type ModalState = {
  isShow: boolean;
};

type ModalProps = {
  groupId: number;
  groupName : string;
  user: UserWithAvatar;
  addUserGroupByUsername: (
    groupId: number,
    username: string,
    groupName: string
  ) => void;
  updateUser: (username: string) => void;
  clearUser : () => void;
  userApiErrorReceived: (error: string) => void;
};

class AddUser extends React.Component<ModalProps, ModalState> {
  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  searchUser = (value: string) => {
    if (value) {
      if (value.length > 1) {
        this.props.updateUser(value);
      } else {
        this.props.userApiErrorReceived('Username needs to have more than one character');
      }
    } else {
      this.props.clearUser();
    }
  };

  addUser =  (groupId: number, username : string, groupName: string) => {
    this.props.addUserGroupByUsername(groupId, username, groupName);
    this.setState({isShow : false});
  }

  onCancel = () => {
    this.props.clearUser();
    this.setState({isShow: false});
  }

  render() {
    const {groupId, user, groupName} = this.props;
    return (
      <div className="group-footer">
        <Tooltip placement="top" title="Add User">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            shape="round"
            onClick={this.showModal}
          />
        </Tooltip>
        <Modal
          title="Add User"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addUser(groupId, user.name, groupName)}
          okText="Add User"
          centered={true}
          width={300}
          okButtonProps={{disabled : !user.name}}
        >
          <Input.Search allowClear prefix={<UserOutlined className="site-form-item-icon" />}
            onSearch={value => this.searchUser(value)}
            className='input-search-box'
            onFocus={e => e.stopPropagation()}
            placeholder="Enter Username"/>
          <div className="search-result">
            {user.name ? (
              <Avatar size="large" src={user.avatar}/>
            ) : (
              <Empty
                description="No result found"
                imageStyle={{ height: '50px' }}
              />
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { addUserGroupByUsername, updateUser, clearUser, userApiErrorReceived },
  null,
  { forwardRef: true }
)(AddUser);
