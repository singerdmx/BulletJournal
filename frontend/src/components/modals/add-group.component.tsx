import React from 'react';
import { Modal, Input, Form } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createGroupByName } from '../../features/group/actions';

type GroupProps = {
    createGroupByName : (name : string) => void;
}

type ModalState = {
  isShow: boolean;
};

class AddGroup extends React.Component<GroupProps, ModalState> {
  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addGroup = (groupName: string) => {
    this.props.createGroupByName(groupName);
    this.setState({ isShow: false });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    return (
      <div className="add-group">
        <UsergroupAddOutlined style={{ fontSize: 20 }} />
        <Modal title="Add Group" visible={this.state.isShow} onCancel={this.onCancel} onOk={() => this.addGroup}>
            <Form>
                <Form.Item>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(null, {createGroupByName})(AddGroup);
