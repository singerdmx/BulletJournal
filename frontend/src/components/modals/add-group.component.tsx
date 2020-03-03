import React from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createGroupByName } from '../../features/group/actions';

import './modals.styles.less';

type GroupProps = {
  createGroupByName: (name: string) => void;
};

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
      <div className="add-group" title='Create New Group'>
        <Button onClick={this.showModal} type="dashed" block>
          <UsergroupAddOutlined style={{ fontSize: 20 }} />
        </Button>
        <Modal
          title="Create New Group"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addGroup}
        >
          <Form>
            <Form.Item>
              <Input placeholder="Enter Group Name"/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { createGroupByName })(AddGroup);
