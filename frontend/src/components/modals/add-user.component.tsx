import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Input, Button, Avatar, Empty } from 'antd';
import { connect } from 'react-redux';
import { addUserGroupByUsername } from '../../features/group/actions';
import { updateUser, clearUser } from '../../features/user/actions';
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
};

class AddUser extends React.Component<ModalProps, ModalState> {
  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  searchUser = (value: string) => {
    if (value && value.length > 1) {
      this.props.updateUser(value);
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          title="Add User"
          onClick={this.showModal}
        />
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
          <Input.Search allowClear onSearch={value => this.searchUser(value)} />
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
  { addUserGroupByUsername, updateUser, clearUser },
  null,
  { forwardRef: true }
)(AddUser);
