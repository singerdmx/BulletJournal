import React from 'react';
import { Modal, Input, Button, Avatar, Empty } from 'antd';
import { connect } from 'react-redux';
import { addUserGroupByUsername } from '../../features/group/actions';
import { updateUser } from '../../features/user/actions';
import { UserWithAvatar } from '../../features/user/reducer';
import { IState } from '../../store';

import './modals.styles.less';

type ModalState = {
  isShow: boolean;
};

type ModalProps = {
  groupId: number;
  user: UserWithAvatar;
  addUserGroupByUsername: (
    groupId: number,
    username: string,
    groupName: string
  ) => void;
  updateUser: (username: string) => void;
};

class AddUser extends React.Component<ModalProps, ModalState> {
  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  searchUser = (value: string) => {
    this.props.updateUser(value);
  };

  render() {
    return (
      <div className="group-footer">
        <Button
          type="primary"
          icon="plus"
          shape="round"
          title="Add User"
          onClick={this.showModal}
        />
        <Modal
          title="Add User"
          visible={this.state.isShow}
          onCancel={() => this.setState({ isShow: false })}
          onOk={() => this.setState({ isShow: false })}
          centered={true}
          okButtonProps={{disabled : !this.props.user.name}}
        >
          <Input.Search allowClear onSearch={value => this.searchUser(value)} />
          <div className="search-result">
            {this.props.user.name ? (
              <Avatar src={this.props.user.avatar} />
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
  { addUserGroupByUsername, updateUser },
  null,
  { forwardRef: true }
)(AddUser);
